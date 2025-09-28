using System;
using System.Buffers;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace MCMS.Infrastructure.FileStorage;

public sealed class FileStorageService : IFileStorageService, IAsyncDisposable
{
    private const int MaxRetryCount = 3;
    private const int DefaultBufferSize = 131072;
    private static readonly TimeSpan RetryDelay = TimeSpan.FromMilliseconds(150);
    private static readonly TimeSpan MetaWriteSla = TimeSpan.FromSeconds(1);
    private static readonly TimeSpan CacheWriteGuardWindow = TimeSpan.FromMilliseconds(500);
    private const int MetaCacheHistorySize = 3;

    private readonly FileStorageOptions _options;\r\n    private int _pendingJsonWrites;\r\n    private long _jsonWritesTotal;
    private readonly ILogger<FileStorageService> _logger;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly Channel<JsonWriteRequest> _jsonWriteChannel;
    private readonly CancellationTokenSource _queueCts = new();
    private readonly Task[] _jsonWriterTasks;
    private readonly SemaphoreSlim _writeSemaphore;
    private readonly ConcurrentDictionary<string, MetaFileCacheHistory> _metaCache = new(StringComparer.OrdinalIgnoreCase);
    private readonly FileSystemWatcher? _watcher;
    private readonly bool _enableMetaCaching;
    private readonly int _workerCount;

    public FileStorageService(IOptions<FileStorageOptions> options, ILogger<FileStorageService> logger)
    {
        _options = options.Value;
        _logger = logger;
        _jsonSerializerOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            DefaultBufferSize = DefaultBufferSize
        };

        _enableMetaCaching = _options.EnableMetaCaching;

        var defaultWorkerTarget = Math.Clamp(Environment.ProcessorCount / 2, 1, 4);
        _workerCount = _options.JsonWorkerCount > 0
            ? Math.Max(1, _options.JsonWorkerCount)
            : Math.Max(1, defaultWorkerTarget);

        var defaultParallelWrites = Math.Clamp(Environment.ProcessorCount / 2, 1, 4);
        var configuredParallel = _options.MaxParallelJsonWrites > 0
            ? _options.MaxParallelJsonWrites
            : defaultParallelWrites;
        var maxParallelJsonWrites = Math.Clamp(configuredParallel, 1, _workerCount);

        _writeSemaphore = new SemaphoreSlim(maxParallelJsonWrites);

        _jsonWriteChannel = Channel.CreateUnbounded<JsonWriteRequest>(new UnboundedChannelOptions
        {
            SingleReader = false,
            SingleWriter = false,
            AllowSynchronousContinuations = false
        });

        _jsonWriterTasks = Enumerable.Range(0, _workerCount)
            .Select(_ => Task.Run(() => ProcessJsonWriteQueueAsync(_queueCts.Token)))
            .ToArray();

        if (_enableMetaCaching)
        {
            _watcher = InitializeWatcher(_options.RootPath);
        }
    }

    public async Task<FileSaveResult> SaveAsync(Stream content, string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        FileSaveResult result = default!;
        await ExecuteWithRetryAsync(async attempt =>
        {
            if (attempt > 1 && content.CanSeek)
            {
                content.Seek(0, SeekOrigin.Begin);
            }

            var options = new FileStreamOptions
            {
                Mode = FileMode.Create,
                Access = FileAccess.Write,
                Share = FileShare.ReadWrite,
                Options = FileOptions.Asynchronous | FileOptions.SequentialScan,
                BufferSize = DefaultBufferSize
            };

            await using var fileStream = new FileStream(fullPath, options);
            using var sha256 = SHA256.Create();

            var buffer = new byte[DefaultBufferSize];
            long totalBytes = 0;
            int bytesRead;
            while ((bytesRead = await content.ReadAsync(buffer.AsMemory(0, buffer.Length), cancellationToken)) > 0)
            {
                await fileStream.WriteAsync(buffer.AsMemory(0, bytesRead), cancellationToken);
                sha256.TransformBlock(buffer, 0, bytesRead, null, 0);
                totalBytes += bytesRead;
            }

            sha256.TransformFinalBlock(Array.Empty<byte>(), 0, 0);
            var checksum = Convert.ToHexString(sha256.Hash!).ToLowerInvariant();
            result = new FileSaveResult(relativePath, checksum, totalBytes);
        }, cancellationToken);

        if (content.CanSeek)
        {
            content.Seek(0, SeekOrigin.Begin);
        }

        return result;
    }

    public Task<Stream> OpenReadAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, 4096, useAsync: true);
        return Task.FromResult(stream);
    }

    public Task<bool> ExistsAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        return Task.FromResult(File.Exists(fullPath));
    }

    public Task DeleteAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var fullPath = GetFullPath(relativePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            InvalidateCache(fullPath);
        }

        return Task.CompletedTask;
    }

    public async Task WriteJsonAsync<T>(string relativePath, T payload, CancellationToken cancellationToken = default)
    {
        var request = CreateJsonRequest(relativePath, payload, typeof(T), cancellationToken, awaitCompletion: true);
        await EnqueueJsonWriteAsync(request, cancellationToken).ConfigureAwait(false);
        if (request.CompletionSource is not null)
        {
            await request.CompletionSource.Task.ConfigureAwait(false);
        }
    }

    public Task QueueJsonWriteAsync<T>(string relativePath, T payload, CancellationToken cancellationToken = default)
    {
        var request = CreateJsonRequest(relativePath, payload, typeof(T), cancellationToken, awaitCompletion: false);
        return EnqueueJsonWriteAsync(request, cancellationToken);
    }

    public async ValueTask DisposeAsync()
    {
        _queueCts.Cancel();
        _jsonWriteChannel.Writer.TryComplete();

        try
        {
            await Task.WhenAll(_jsonWriterTasks).ConfigureAwait(false);
        }
        catch (OperationCanceledException)
        {
            // ignored
        }

        _writeSemaphore.Dispose();
        _watcher?.Dispose();
        _queueCts.Dispose();
    }

    private JsonWriteRequest CreateJsonRequest(string relativePath, object? payload, Type payloadType, CancellationToken cancellationToken, bool awaitCompletion)
    {
        var completionSource = awaitCompletion
            ? new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously)
            : null;

        if (awaitCompletion && cancellationToken.CanBeCanceled && completionSource is not null)
        {
            cancellationToken.Register(static state =>
            {
                var tcs = (TaskCompletionSource<bool>)state!;
                tcs.TrySetCanceled();
            }, completionSource);
        }

        var enqueuedAt = DateTimeOffset.UtcNow;
        return new JsonWriteRequest(relativePath, payload, payloadType, cancellationToken, awaitCompletion, completionSource, enqueuedAt);
    }

    private async Task EnqueueJsonWriteAsync(JsonWriteRequest request, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!_jsonWriteChannel.Writer.TryWrite(request))
        {
            await _jsonWriteChannel.Writer.WriteAsync(request, cancellationToken).ConfigureAwait(false);
        }
    }

    private async Task ProcessJsonWriteQueueAsync(int workerId, CancellationToken cancellationToken)
    {
        await foreach (var request in _jsonWriteChannel.Reader.ReadAllAsync(cancellationToken))
        {
            CancellationTokenSource? linked = null;
            var effectiveToken = cancellationToken;
            try
            {
                if (request.RequestCancellation.CanBeCanceled)
                {
                    linked = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, request.RequestCancellation);
                    effectiveToken = linked.Token;
                }

                bool acquired = false;
                try
                {
                    await _writeSemaphore.WaitAsync(effectiveToken).ConfigureAwait(false);
                    acquired = true;

                    var stopwatch = Stopwatch.StartNew();
                    await WriteJsonInternalAsync(request.RelativePath, request.Payload, request.PayloadType, effectiveToken).ConfigureAwait(false);
                    stopwatch.Stop();

                    var totalLatency = DateTimeOffset.UtcNow - request.EnqueuedAt;
                    var queueLatency = totalLatency - stopwatch.Elapsed;
                    if (queueLatency < TimeSpan.Zero)
                    {
                        queueLatency = TimeSpan.Zero;
                    }

                    if (stopwatch.Elapsed > MetaWriteSla)
                    {
                        _logger.LogWarning(
                            "Meta JSON write exceeded SLA ({WriteMs} ms) for {RelativePath}; queue wait {QueueMs} ms.",
                            stopwatch.Elapsed.TotalMilliseconds,
                            request.RelativePath,
                            queueLatency.TotalMilliseconds);
                    }
                    else
                    {
                        _logger.LogDebug(
                            "Meta JSON write completed in {WriteMs} ms (queued {QueueMs} ms) for {RelativePath}.",
                            stopwatch.Elapsed.TotalMilliseconds,
                            queueLatency.TotalMilliseconds,
                            request.RelativePath);
                    }

                    request.CompletionSource?.TrySetResult(true);
                }
                finally
                {
                    if (acquired)
                    {
                        _writeSemaphore.Release();
                    }
                }
            }
            catch (OperationCanceledException oce) when (effectiveToken.IsCancellationRequested)
            {
                request.CompletionSource?.TrySetCanceled(oce.CancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to write JSON file {RelativePath}", request.RelativePath);
                request.CompletionSource?.TrySetException(ex);
            }
            finally
            {
                linked?.Dispose();
            }
        }
    }

    private PooledByteBufferWriter SerializePayload(object? payload, Type payloadType, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var writer = new PooledByteBufferWriter(DefaultBufferSize);
        var writerOptions = new JsonWriterOptions
        {
            Indented = _jsonSerializerOptions.WriteIndented,
            Encoder = _jsonSerializerOptions.Encoder
        };

        using (var jsonWriter = new Utf8JsonWriter(writer, writerOptions))
        {
            JsonSerializer.Serialize(jsonWriter, payload, payloadType, _jsonSerializerOptions);
        }

        cancellationToken.ThrowIfCancellationRequested();
        return writer;
    }

    private bool TrySkipWrite(string fullPath, string payloadHash, long payloadLength)
    {
        if (!_enableMetaCaching)
        {
            return false;
        }

        var normalized = Path.GetFullPath(fullPath);
        var history = _metaCache.GetOrAdd(normalized, _ => new MetaFileCacheHistory(MetaCacheHistorySize));
        var candidate = new MetaFileCacheEntry(payloadHash, payloadLength, DateTimeOffset.UtcNow);

        if (history.Contains(candidate))
        {
            history.Record(candidate);
            return true;
        }

        history.Record(candidate);
        return false;
    }

    private void UpdateCache(string fullPath, string payloadHash, long payloadLength)
    {
        if (!_enableMetaCaching)
        {
            return;
        }

        var normalized = Path.GetFullPath(fullPath);
        var history = _metaCache.GetOrAdd(normalized, _ => new MetaFileCacheHistory(MetaCacheHistorySize));
        history.Record(new MetaFileCacheEntry(payloadHash, payloadLength, DateTimeOffset.UtcNow));
    }
    private FileSystemWatcher? InitializeWatcher(string rootPath)
    {
        try
        {
            Directory.CreateDirectory(rootPath);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to ensure storage root exists for watcher initialization.");
            return null;
        }

        var watcher = new FileSystemWatcher(rootPath)
        {
            IncludeSubdirectories = true,
            NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite | NotifyFilters.Size | NotifyFilters.DirectoryName
        };

        watcher.Changed += (_, args) => InvalidateCache(args.FullPath);
        watcher.Created += (_, args) => InvalidateCache(args.FullPath);
        watcher.Deleted += (_, args) => InvalidateCache(args.FullPath);
        watcher.Renamed += (_, args) =>
        {
            InvalidateCache(args.OldFullPath);
            InvalidateCache(args.FullPath);
        };

        try
        {
            watcher.EnableRaisingEvents = true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to enable file system watcher; meta cache invalidation will be disabled.");
            watcher.Dispose();
            return null;
        }

        return watcher;
    }

    private void InvalidateCache(string? fullPath)
    {
        if (!_enableMetaCaching || string.IsNullOrWhiteSpace(fullPath))
        {
            return;
        }

        var normalized = Path.GetFullPath(fullPath);

        if (_metaCache.TryGetValue(normalized, out var history) && history.TryGetLatest(out var latest))
        {
            var now = DateTimeOffset.UtcNow;
            if (now - latest.LastUpdated < CacheWriteGuardWindow)
            {
                return;
            }

            _metaCache.TryRemove(normalized, out _);
        }
    }

    private async Task WriteJsonInternalAsync(string relativePath, object? payload, Type payloadType, CancellationToken cancellationToken)
    {
        var fullPath = GetFullPath(relativePath);
        var directory = Path.GetDirectoryName(fullPath)!;
        Directory.CreateDirectory(directory);

        using var bufferWriter = SerializePayload(payload, payloadType, cancellationToken);
        var payloadMemory = bufferWriter.WrittenMemory;
        var payloadLength = payloadMemory.Length;
        var payloadHash = Convert.ToHexString(SHA256.HashData(payloadMemory.Span)).ToLowerInvariant();

        if (TrySkipWrite(fullPath, payloadHash, payloadLength))
        {
            _logger.LogDebug("Skipping JSON write for {RelativePath} because content is unchanged.", relativePath);
            return;
        }

        await ExecuteWithRetryAsync(async _ =>
        {
            var tempFile = Path.Combine(directory, $".tmp-{Guid.NewGuid():N}.json");
            try
            {
                var options = new FileStreamOptions
                {
                    Mode = FileMode.Create,
                    Access = FileAccess.Write,
                    Share = FileShare.None,
                    Options = FileOptions.Asynchronous | FileOptions.SequentialScan,
                    BufferSize = DefaultBufferSize
                };

                await using (var stream = new FileStream(tempFile, options))
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    await stream.WriteAsync(payloadMemory, cancellationToken).ConfigureAwait(false);
                    await stream.FlushAsync(cancellationToken).ConfigureAwait(false);
                }

                File.Move(tempFile, fullPath, true);
                UpdateCache(fullPath, payloadHash, payloadLength);
            }
            finally
            {
                if (File.Exists(tempFile))
                {
                    try
                    {
                        File.Delete(tempFile);
                    }
                    catch (IOException ex)
                    {
                        _logger.LogWarning(ex, "Failed to cleanup temp file {TempFile}", tempFile);
                    }
                }
            }
        }, cancellationToken).ConfigureAwait(false);
    }

    private string GetFullPath(string relativePath)
    {
        relativePath = relativePath.Replace('\\', Path.DirectorySeparatorChar)
                                   .Replace('/', Path.DirectorySeparatorChar)
                                   .TrimStart(Path.DirectorySeparatorChar);
        return Path.GetFullPath(Path.Combine(_options.RootPath, relativePath));
    }

    private static async Task ExecuteWithRetryAsync(Func<int, Task> action, CancellationToken cancellationToken)
    {
        for (var attempt = 1; attempt <= MaxRetryCount; attempt++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            try
            {
                await action(attempt).ConfigureAwait(false);
                return;
            }
            catch (IOException) when (attempt < MaxRetryCount)
            {
                var delay = TimeSpan.FromMilliseconds(RetryDelay.TotalMilliseconds * attempt);
                await Task.Delay(delay, cancellationToken).ConfigureAwait(false);
            }
        }
    }

        private sealed class PooledByteBufferWriter : IBufferWriter<byte>, IDisposable
    {
        private byte[] _buffer;
        private int _index;
        private bool _disposed;

        public PooledByteBufferWriter(int initialCapacity)
        {
            var rentSize = Math.Max(initialCapacity, 256);
            _buffer = ArrayPool<byte>.Shared.Rent(rentSize);
        }

        public ReadOnlyMemory<byte> WrittenMemory => _buffer.AsMemory(0, _index);

        public void Advance(int count)
        {
            if (count < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(count));
            }

            if (_index > _buffer.Length - count)
            {
                throw new InvalidOperationException("Cannot advance beyond buffer size.");
            }

            _index += count;
        }

        public Memory<byte> GetMemory(int sizeHint = 0)
        {
            EnsureCapacity(sizeHint);
            return _buffer.AsMemory(_index);
        }

        public Span<byte> GetSpan(int sizeHint = 0)
        {
            EnsureCapacity(sizeHint);
            return _buffer.AsSpan(_index);
        }

        private void EnsureCapacity(int sizeHint)
        {
            if (sizeHint < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(sizeHint));
            }

            if (sizeHint == 0)
            {
                sizeHint = 1;
            }

            var remaining = _buffer.Length - _index;
            if (remaining >= sizeHint)
            {
                return;
            }

            var growBy = Math.Max(sizeHint, _buffer.Length);
            var newSize = checked(_buffer.Length + growBy);
            var newBuffer = ArrayPool<byte>.Shared.Rent(newSize);
            Array.Copy(_buffer, 0, newBuffer, 0, _index);
            ArrayPool<byte>.Shared.Return(_buffer);
            _buffer = newBuffer;
        }

        public void Dispose()
        {
            if (_disposed)
            {
                return;
            }

            ArrayPool<byte>.Shared.Return(_buffer);
            _buffer = Array.Empty<byte>();
            _index = 0;
            _disposed = true;
        }
    }

private sealed class MetaFileCacheHistory
    {
        private readonly int _capacity;
        private readonly Queue<MetaFileCacheEntry> _entries;
        private readonly object _sync = new();
        private MetaFileCacheEntry? _latest;

        public MetaFileCacheHistory(int capacity)
        {
            _capacity = Math.Max(1, capacity);
            _entries = new Queue<MetaFileCacheEntry>(_capacity);
        }

        public bool Contains(MetaFileCacheEntry candidate)
        {
            lock (_sync)
            {
                foreach (var entry in _entries)
                {
                    if (entry.Hash == candidate.Hash && entry.Length == candidate.Length)
                    {
                        return true;
                    }
                }

                return false;
            }
        }

        public void Record(MetaFileCacheEntry entry)
        {
            lock (_sync)
            {
                _entries.Enqueue(entry);
                _latest = entry;
                while (_entries.Count > _capacity)
                {
                    _entries.Dequeue();
                }
            }
        }

        public bool TryGetLatest(out MetaFileCacheEntry latest)
        {
            lock (_sync)
            {
                if (_latest is null)
                {
                    latest = default!;
                    return false;
                }

                latest = _latest;
                return true;
            }
        }

        public void Clear()
        {
            lock (_sync)
            {
                _entries.Clear();
                _latest = null;
            }
        }
    }
    private sealed record JsonWriteRequest(
        string RelativePath,
        object? Payload,
        Type PayloadType,
        CancellationToken RequestCancellation,
        bool AwaitCompletion,
        TaskCompletionSource<bool>? CompletionSource,
        DateTimeOffset EnqueuedAt);

    private sealed record MetaFileCacheEntry(string Hash, long Length, DateTimeOffset LastUpdated);
}
























