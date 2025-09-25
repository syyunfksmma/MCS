using System;
using System.Diagnostics;
using System.IO;
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

    private readonly FileStorageOptions _options;
    private readonly ILogger<FileStorageService> _logger;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly Channel<JsonWriteRequest> _jsonWriteChannel;
    private readonly CancellationTokenSource _queueCts = new();
    private readonly Task _jsonWriterTask;

    public FileStorageService(IOptions<FileStorageOptions> options, ILogger<FileStorageService> logger)
    {
        _options = options.Value;
        _logger = logger;
        _jsonSerializerOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            DefaultBufferSize = DefaultBufferSize
        };

        _jsonWriteChannel = Channel.CreateUnbounded<JsonWriteRequest>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false,
            AllowSynchronousContinuations = false
        });

        _jsonWriterTask = Task.Run(() => ProcessJsonWriteQueueAsync(_queueCts.Token));
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
            await _jsonWriterTask.ConfigureAwait(false);
        }
        catch (OperationCanceledException)
        {
            // ignored
        }

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

    private async Task ProcessJsonWriteQueueAsync(CancellationToken stoppingToken)
    {
        await foreach (var request in _jsonWriteChannel.Reader.ReadAllAsync(stoppingToken))
        {
            CancellationTokenSource? linked = null;
            var effectiveToken = stoppingToken;

            if (request.RequestCancellation.CanBeCanceled)
            {
                linked = CancellationTokenSource.CreateLinkedTokenSource(request.RequestCancellation, stoppingToken);
                effectiveToken = linked.Token;
            }

            try
            {
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

    private async Task WriteJsonInternalAsync(string relativePath, object? payload, Type payloadType, CancellationToken cancellationToken)
    {
        var fullPath = GetFullPath(relativePath);
        var directory = Path.GetDirectoryName(fullPath)!;
        Directory.CreateDirectory(directory);

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
                    await JsonSerializer.SerializeAsync(stream, payload, payloadType, _jsonSerializerOptions, cancellationToken).ConfigureAwait(false);
                    await stream.FlushAsync(cancellationToken).ConfigureAwait(false);
                }

                File.Move(tempFile, fullPath, true);
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
        return Path.Combine(_options.RootPath, relativePath);
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

    private sealed record JsonWriteRequest(
        string RelativePath,
        object? Payload,
        Type PayloadType,
        CancellationToken RequestCancellation,
        bool AwaitCompletion,
        TaskCompletionSource<bool>? CompletionSource,
        DateTimeOffset EnqueuedAt);
}
