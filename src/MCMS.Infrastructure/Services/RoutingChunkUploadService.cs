using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace MCMS.Infrastructure.Services;

public class RoutingChunkUploadService : IRoutingChunkUploadService
{
    private readonly McmsDbContext _dbContext;
    private readonly IRoutingFileService _routingFileService;
    private readonly ILogger<RoutingChunkUploadService> _logger;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _sessionTtl = TimeSpan.FromMinutes(30);
    private readonly MemoryCacheEntryOptions _cacheOptions;
    private readonly string _sessionRoot;

    public RoutingChunkUploadService(
        McmsDbContext dbContext,
        IRoutingFileService routingFileService,
        ILogger<RoutingChunkUploadService> logger,
        IMemoryCache cache)
    {
        _dbContext = dbContext;
        _routingFileService = routingFileService;
        _logger = logger;
        _cache = cache;
        _sessionRoot = Path.Combine(Path.GetTempPath(), "mcms", "chunk-uploads");
        Directory.CreateDirectory(_sessionRoot);
        _cacheOptions = new MemoryCacheEntryOptions
        {
            SlidingExpiration = _sessionTtl,
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6)
        };
    }

    public async Task<ChunkUploadSessionDto> StartSessionAsync(Guid routingId, StartChunkUploadRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.ChunkSizeBytes <= 0)
        {
            throw new ArgumentException("Chunk size must be positive.", nameof(request));
        }

        var routingExists = await _dbContext.Routings.AsNoTracking().AnyAsync(r => r.Id == routingId, cancellationToken);
        if (!routingExists)
        {
            throw new KeyNotFoundException("Routing not found.");
        }

        var totalChunks = Math.Max(1, (int)Math.Ceiling(request.TotalSizeBytes / (double)request.ChunkSizeBytes));
        var sessionId = Guid.NewGuid();
        var workingDirectory = Path.Combine(_sessionRoot, sessionId.ToString("N", CultureInfo.InvariantCulture));
        Directory.CreateDirectory(workingDirectory);

        var session = new SessionState(
            sessionId,
            routingId,
            request.FileName,
            request.FileType,
            request.UploadedBy,
            request.ChunkSizeBytes,
            request.TotalSizeBytes,
            totalChunks,
            workingDirectory,
            DateTimeOffset.UtcNow.Add(_sessionTtl));

        StoreSession(session);
        _logger.LogInformation("Started chunk upload session {SessionId} for routing {RoutingId} ({FileName})", sessionId, routingId, request.FileName);

        return new ChunkUploadSessionDto(sessionId, session.ExpiresAt, session.ChunkSizeBytes, session.TotalChunks);
    }

    public async Task AcceptChunkAsync(Guid routingId, Guid sessionId, int chunkIndex, Stream content, CancellationToken cancellationToken = default)
    {
        var session = GetSession(sessionId, routingId);

        await session.Gate.WaitAsync(cancellationToken);
        try
        {
            EnsureSessionActive(session);

            if (chunkIndex < 0 || chunkIndex >= session.TotalChunks)
            {
                throw new ArgumentOutOfRangeException(nameof(chunkIndex), chunkIndex, "Chunk index is outside the session range.");
            }

            var chunkPath = session.GetChunkPath(chunkIndex);
            await using var fileStream = File.Create(chunkPath);
            await content.CopyToAsync(fileStream, cancellationToken);
            session.MarkChunkReceived(chunkIndex);
            session.Touch(_sessionTtl);
            StoreSession(session);
            _logger.LogDebug("Accepted chunk {ChunkIndex} for session {SessionId}", chunkIndex, sessionId);
        }
        finally
        {
            session.Gate.Release();
        }
    }

    public async Task<RoutingMetaDto> CompleteSessionAsync(Guid routingId, Guid sessionId, CompleteChunkUploadRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var session = GetSession(sessionId, routingId);

        await session.Gate.WaitAsync(cancellationToken);
        try
        {
            EnsureSessionActive(session);

            if (session.ReceivedChunks.Count != session.TotalChunks)
            {
                throw new InvalidOperationException($"Session {sessionId} is missing chunks: expected {session.TotalChunks}, received {session.ReceivedChunks.Count}.");
            }

            var mergedPath = session.GetMergedPath();
            await MergeChunksAsync(session, mergedPath, cancellationToken);

            await using var fileStream = new FileStream(mergedPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            var computedChecksum = await ComputeSha256Async(fileStream, cancellationToken);

            if (!computedChecksum.Equals(request.Checksum, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException($"Checksum mismatch for session {sessionId}. expected {request.Checksum}, computed {computedChecksum}");
            }

            fileStream.Position = 0;
            var meta = await _routingFileService.UploadAsync(new UploadRoutingFileRequest(
                routingId,
                fileStream,
                session.FileName,
                session.FileType,
                request.IsPrimary ?? false,
                session.UploadedBy), cancellationToken);

            _logger.LogInformation("Completed chunk upload session {SessionId} for routing {RoutingId}", sessionId, routingId);
            CleanupSession(sessionId, session);
            return meta;
        }
        finally
        {
            session.Gate.Release();
        }
    }

    private SessionState GetSession(Guid sessionId, Guid routingId)
    {
        if (!_cache.TryGetValue(sessionId, out SessionState? session) || session is null || session.RoutingId != routingId)
        {
            throw new KeyNotFoundException("Upload session not found.");
        }

        return session;
    }

    private void StoreSession(SessionState session)
    {
        session.ExpiresAt = DateTimeOffset.UtcNow.Add(_sessionTtl);
        _cache.Set(session.SessionId, session, _cacheOptions);
    }

    private void CleanupSession(Guid sessionId, SessionState session)
    {
        _cache.Remove(sessionId);
        try
        {
            if (Directory.Exists(session.WorkingDirectory))
            {
                Directory.Delete(session.WorkingDirectory, recursive: true);
            }
        }
        catch (IOException ex)
        {
            _logger.LogWarning(ex, "Failed to clean up chunk directory for session {SessionId}", sessionId);
        }
    }

    private void EnsureSessionActive(SessionState session)
    {
        if (DateTimeOffset.UtcNow > session.ExpiresAt)
        {
            CleanupSession(session.SessionId, session);
            throw new InvalidOperationException($"Upload session {session.SessionId} expired.");
        }
    }

    private async Task MergeChunksAsync(SessionState session, string mergedPath, CancellationToken cancellationToken)
    {
        await using var output = new FileStream(mergedPath, FileMode.Create, FileAccess.Write, FileShare.None);
        for (var index = 0; index < session.TotalChunks; index++)
        {
            var chunkPath = session.GetChunkPath(index);
            if (!File.Exists(chunkPath))
            {
                throw new FileNotFoundException($"Missing chunk {index} for session {session.SessionId}", chunkPath);
            }

            await using var input = new FileStream(chunkPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            await input.CopyToAsync(output, cancellationToken);
        }

        await output.FlushAsync(cancellationToken);
    }

    private static async Task<string> ComputeSha256Async(Stream stream, CancellationToken cancellationToken)
    {
        stream.Position = 0;
        using var sha = SHA256.Create();
        var hashBytes = await sha.ComputeHashAsync(stream, cancellationToken);
        return Convert.ToHexString(hashBytes);
    }

    private sealed class SessionState
    {
        public SessionState(
            Guid sessionId,
            Guid routingId,
            string fileName,
            string fileType,
            string uploadedBy,
            int chunkSizeBytes,
            long totalSizeBytes,
            int totalChunks,
            string workingDirectory,
            DateTimeOffset expiresAt)
        {
            SessionId = sessionId;
            RoutingId = routingId;
            FileName = fileName;
            FileType = fileType;
            UploadedBy = uploadedBy;
            ChunkSizeBytes = chunkSizeBytes;
            TotalSizeBytes = totalSizeBytes;
            TotalChunks = totalChunks;
            WorkingDirectory = workingDirectory;
            ExpiresAt = expiresAt;
        }

        public Guid SessionId { get; }
        public Guid RoutingId { get; }
        public string FileName { get; }
        public string FileType { get; }
        public string UploadedBy { get; }
        public int ChunkSizeBytes { get; }
        public long TotalSizeBytes { get; }
        public int TotalChunks { get; }
        public string WorkingDirectory { get; }
        public DateTimeOffset ExpiresAt { get; set; }
        public SemaphoreSlim Gate { get; } = new(1, 1);
        public HashSet<int> ReceivedChunks { get; } = new();

        public void MarkChunkReceived(int index)
        {
            ReceivedChunks.Add(index);
        }

        public string GetChunkPath(int index)
        {
            var fileName = index.ToString("D6", CultureInfo.InvariantCulture) + ".part";
            return Path.Combine(WorkingDirectory, fileName);
        }

        public string GetMergedPath()
        {
            return Path.Combine(WorkingDirectory, "merged.tmp");
        }

        public void Touch(TimeSpan ttl)
        {
            ExpiresAt = DateTimeOffset.UtcNow.Add(ttl);
        }
    }
}


