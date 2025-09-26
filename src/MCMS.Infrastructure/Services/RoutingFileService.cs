using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Core.Validation;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MCMS.Infrastructure.Services;

public class RoutingFileService : IRoutingFileService
{
    private static readonly HashSet<string> AllowedFileTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "esprit", "nc", "wp", "stl", "mprj", "gdml", "meta", "solidworks", "other"
    };

    private static readonly TimeSpan MetaGenerationSla = TimeSpan.FromSeconds(1);
    private static readonly TimeSpan MetaBatchWindow = TimeSpan.FromMilliseconds(300);

    private readonly McmsDbContext _dbContext;
    private readonly IFileStorageService _fileStorage;
    private readonly IHistoryService _historyService;
    private readonly ILogger<RoutingFileService> _logger;
    private readonly UploadRoutingFileRequestValidator _uploadValidator = new();
    private readonly ConcurrentDictionary<Guid, RoutingMetaWorkItem> _metaWorkItems = new();
    private readonly ConcurrentDictionary<Guid, RoutingMetaFingerprint> _metaFingerprints = new();

    public RoutingFileService(
        McmsDbContext dbContext,
        IFileStorageService fileStorage,
        IHistoryService historyService,
        ILogger<RoutingFileService> logger)
    {
        _dbContext = dbContext;
        _fileStorage = fileStorage;
        _historyService = historyService;
        _logger = logger;
    }

    public Task<RoutingMetaDto> GetAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        return ScheduleMetaRefreshAsync(routingId, cancellationToken);
    }

    public async Task<RoutingMetaDto> UploadAsync(UploadRoutingFileRequest request, CancellationToken cancellationToken = default)
    {
        await _uploadValidator.ValidateAndThrowAsync(request, cancellationToken).ConfigureAwait(false);
        EnsureFileTypeIsSupported(request.FileType);

        var routing = await _dbContext.Routings
            .Include(r => r.Files)
            .FirstOrDefaultAsync(r => r.Id == request.RoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing not found.");

        var relativePath = BuildRelativePath(routing, request.FileName);
        var saveResult = await _fileStorage.SaveAsync(request.Content, relativePath, cancellationToken).ConfigureAwait(false);

        var entity = new RoutingFile
        {
            RoutingId = routing.Id,
            FileName = request.FileName,
            RelativePath = saveResult.RelativePath,
            FileType = MapFileType(request.FileType),
            FileSizeBytes = saveResult.Length,
            Checksum = saveResult.Checksum,
            IsPrimary = request.IsPrimary,
            CreatedBy = request.UploadedBy
        };

        if (entity.IsPrimary)
        {
            foreach (var sibling in routing.Files)
            {
                sibling.IsPrimary = false;
            }
        }

        routing.UpdatedAt = DateTimeOffset.UtcNow;
        routing.UpdatedBy = request.UploadedBy;

        _dbContext.RoutingFiles.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            routing.Id,
            "RoutingFileUploaded",
            entity.FileName,
            null,
            entity.RelativePath,
            ApprovalOutcome.Pending,
            entity.CreatedAt,
            entity.CreatedBy,
            null), cancellationToken).ConfigureAwait(false);

        return await ScheduleMetaRefreshAsync(routing.Id, cancellationToken).ConfigureAwait(false);
    }

    public async Task<RoutingMetaDto> DeleteAsync(Guid routingId, Guid fileId, string deletedBy, CancellationToken cancellationToken = default)
    {
        var file = await _dbContext.RoutingFiles
            .Include(f => f.Routing)
            .FirstOrDefaultAsync(f => f.Id == fileId && f.RoutingId == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("File not found.");

        file.Routing!.UpdatedAt = DateTimeOffset.UtcNow;
        file.Routing.UpdatedBy = deletedBy;

        _dbContext.RoutingFiles.Remove(file);
        await _dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            routingId,
            "RoutingFileDeleted",
            file.FileName,
            file.RelativePath,
            null,
            ApprovalOutcome.Pending,
            DateTimeOffset.UtcNow,
            deletedBy,
            null), cancellationToken).ConfigureAwait(false);

        return await ScheduleMetaRefreshAsync(routingId, cancellationToken).ConfigureAwait(false);
    }

    private async Task<Routing> LoadRoutingAggregateAsync(Guid routingId, CancellationToken cancellationToken)
    {
        return await _dbContext.Routings
            .AsNoTracking()
            .Include(r => r.Files)
            .Include(r => r.HistoryEntries)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing not found.");
    }

    private async Task<RoutingMetaDto> GenerateMetaAsync(Routing routing, CancellationToken cancellationToken)
    {
        var startTimestamp = Stopwatch.GetTimestamp();
        var metaPath = BuildMetaPath(routing);
        var latestHistoryId = routing.HistoryEntries
            .OrderByDescending(h => h.CreatedAt)
            .FirstOrDefault()?.Id;

        var files = routing.Files
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new RoutingMetaFileDto(
                f.FileName,
                f.FileType.ToString(),
                f.RelativePath,
                f.Checksum,
                f.IsPrimary,
                f.CreatedBy,
                f.CreatedAt))
            .ToList();

        var meta = new RoutingMetaDto(
            routing.Id,
            routing.CamRevision,
            metaPath,
            files,
            latestHistoryId);

        if (ShouldSkipMetaWrite(routing.Id, meta))
        {
            _logger.LogDebug("Routing meta unchanged; skipping write for RoutingId={RoutingId}", routing.Id);
        }
        else
        {
            await _fileStorage.QueueJsonWriteAsync(meta.MetaPath, meta, cancellationToken).ConfigureAwait(false);
        }

        var elapsed = Stopwatch.GetElapsedTime(startTimestamp);

        if (elapsed > MetaGenerationSla)
        {
            _logger.LogWarning("Routing meta generation exceeded SLA ({ElapsedMs} ms) for RoutingId={RoutingId}", elapsed.TotalMilliseconds, routing.Id);
        }
        else
        {
            _logger.LogDebug("Routing meta generation completed in {ElapsedMs} ms for RoutingId={RoutingId}", elapsed.TotalMilliseconds, routing.Id);
        }

        return meta;
    }

    private bool ShouldSkipMetaWrite(Guid routingId, RoutingMetaDto meta)
    {
        var fingerprint = RoutingMetaFingerprint.Create(meta);
        if (_metaFingerprints.TryGetValue(routingId, out var existing) && existing == fingerprint)
        {
            return true;
        }

        _metaFingerprints[routingId] = fingerprint;
        return false;
    }

    private async Task<RoutingMetaDto> GenerateMetaForRoutingAsync(Guid routingId, CancellationToken cancellationToken)
    {
        var routing = await LoadRoutingAggregateAsync(routingId, cancellationToken).ConfigureAwait(false);
        return await GenerateMetaAsync(routing, cancellationToken).ConfigureAwait(false);
    }

    private Task<RoutingMetaDto> ScheduleMetaRefreshAsync(Guid routingId, CancellationToken cancellationToken)
    {
        var workItem = _metaWorkItems.GetOrAdd(
            routingId,
            id => new RoutingMetaWorkItem(
                id,
                MetaBatchWindow,
                GenerateMetaForRoutingAsync,
                RemoveMetaWorkItem,
                _logger));

        return workItem.GetTask(cancellationToken);
    }

    private void RemoveMetaWorkItem(Guid routingId, RoutingMetaWorkItem workItem)
    {
        _metaWorkItems.TryRemove(new KeyValuePair<Guid, RoutingMetaWorkItem>(routingId, workItem));
    }

    private static string BuildRelativePath(Routing routing, string fileName)
    {
        var sanitizedName = Path.GetFileName(fileName);
        return Path.Combine("routings", routing.Id.ToString("N"), sanitizedName).Replace('\\', '/');
    }

    private static string BuildMetaPath(Routing routing)
    {
        return Path.Combine("routings", routing.Id.ToString("N"), "meta.json").Replace('\\', '/');
    }

    private static ManagedFileType MapFileType(string fileType)
    {
        return fileType.ToLowerInvariant() switch
        {
            "esprit" => ManagedFileType.Esprit,
            "nc" => ManagedFileType.Nc,
            "wp" => ManagedFileType.Workpiece,
            "stl" => ManagedFileType.Stl,
            "mprj" => ManagedFileType.MachineProject,
            "gdml" => ManagedFileType.Fixture,
            "meta" => ManagedFileType.Meta,
            "solidworks" => ManagedFileType.SolidWorks,
            _ => ManagedFileType.Other
        };
    }

    private static void EnsureFileTypeIsSupported(string fileType)
    {
        if (!AllowedFileTypes.Contains(fileType))
        {
            throw new ArgumentException($"Unsupported file type: {fileType}");
        }
    }

    private sealed record RoutingMetaFingerprint(string? LatestHistoryId, string FilesComposite)
    {
        public static RoutingMetaFingerprint Create(RoutingMetaDto meta)
        {
            var latestHistoryId = meta.LatestHistoryId?.ToString();
            var builder = new StringBuilder();
            foreach (var file in meta.Files.OrderBy(f => f.RelativePath, StringComparer.OrdinalIgnoreCase))
            {
                builder.Append(file.RelativePath)
                       .Append(':')
                       .Append(file.Checksum)
                       .Append(':')
                       .Append(file.IsPrimary ? '1' : '0')
                       .Append('|');
            }

            return new RoutingMetaFingerprint(latestHistoryId, builder.ToString());
        }
    }

    private sealed class RoutingMetaWorkItem : IDisposable
    {
        private readonly Guid _routingId;
        private readonly TimeSpan _batchWindow;
        private readonly Func<Guid, CancellationToken, Task<RoutingMetaDto>> _executor;
        private readonly Action<Guid, RoutingMetaWorkItem> _onCompleted;
        private readonly ILogger _logger;
        private readonly TaskCompletionSource<RoutingMetaDto> _tcs = new(TaskCreationOptions.RunContinuationsAsynchronously);
        private readonly Timer _timer;
        private int _executed;

        public RoutingMetaWorkItem(
            Guid routingId,
            TimeSpan batchWindow,
            Func<Guid, CancellationToken, Task<RoutingMetaDto>> executor,
            Action<Guid, RoutingMetaWorkItem> onCompleted,
            ILogger logger)
        {
            _routingId = routingId;
            _batchWindow = batchWindow;
            _executor = executor;
            _onCompleted = onCompleted;
            _logger = logger;
            _timer = new Timer(OnTimer, null, batchWindow, Timeout.InfiniteTimeSpan);
        }

        public Task<RoutingMetaDto> GetTask(CancellationToken cancellationToken)
        {
            Reschedule();
            if (cancellationToken.CanBeCanceled)
            {
                cancellationToken.Register(state =>
                {
                    var source = (TaskCompletionSource<RoutingMetaDto>)state!;
                    source.TrySetCanceled(cancellationToken);
                }, _tcs);
            }

            return _tcs.Task;
        }

        private void Reschedule()
        {
            if (Volatile.Read(ref _executed) == 0)
            {
                _timer.Change(_batchWindow, Timeout.InfiniteTimeSpan);
            }
        }

        private void OnTimer(object? state)
        {
            TriggerExecution();
        }

        private void TriggerExecution()
        {
            if (Interlocked.Exchange(ref _executed, 1) == 1)
            {
                return;
            }

            _ = ExecuteAsync();
        }

        private async Task ExecuteAsync()
        {
            try
            {
                var result = await _executor(_routingId, CancellationToken.None).ConfigureAwait(false);
                _tcs.TrySetResult(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate routing meta for {RoutingId}", _routingId);
                _tcs.TrySetException(ex);
            }
            finally
            {
                _onCompleted(_routingId, this);
                Dispose();
            }
        }

        public void Dispose()
        {
            _timer.Dispose();
        }
    }
}
