using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
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

    private readonly McmsDbContext _dbContext;
    private readonly IFileStorageService _fileStorage;
    private readonly IHistoryService _historyService;
    private readonly ILogger<RoutingFileService> _logger;
    private readonly UploadRoutingFileRequestValidator _uploadValidator = new();

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

    public async Task<RoutingMetaDto> GetAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        var routing = await LoadRoutingAggregateAsync(routingId, cancellationToken);
        return await GenerateMetaAsync(routing, cancellationToken);
    }

    public async Task<RoutingMetaDto> UploadAsync(UploadRoutingFileRequest request, CancellationToken cancellationToken = default)
    {
        await _uploadValidator.ValidateAndThrowAsync(request, cancellationToken);
        EnsureFileTypeIsSupported(request.FileType);

        var routing = await _dbContext.Routings
            .Include(r => r.Files)
            .FirstOrDefaultAsync(r => r.Id == request.RoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing? ?? ? ????.");

        var relativePath = BuildRelativePath(routing, request.FileName);
        var saveResult = await _fileStorage.SaveAsync(request.Content, relativePath, cancellationToken);

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
        await _dbContext.SaveChangesAsync(cancellationToken);

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
            null), cancellationToken);

        var refreshed = await LoadRoutingAggregateAsync(routing.Id, cancellationToken);
        return await GenerateMetaAsync(refreshed, cancellationToken);
    }

    public async Task<RoutingMetaDto> DeleteAsync(Guid routingId, Guid fileId, string deletedBy, CancellationToken cancellationToken = default)
    {
        var file = await _dbContext.RoutingFiles
            .Include(f => f.Routing)
            .FirstOrDefaultAsync(f => f.Id == fileId && f.RoutingId == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("??? ?? ? ????.");

        file.Routing!.UpdatedAt = DateTimeOffset.UtcNow;
        file.Routing.UpdatedBy = deletedBy;

        _dbContext.RoutingFiles.Remove(file);
        await _dbContext.SaveChangesAsync(cancellationToken);

        await _fileStorage.DeleteAsync(file.RelativePath, cancellationToken);

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
            null), cancellationToken);

        var refreshed = await LoadRoutingAggregateAsync(routingId, cancellationToken);
        return await GenerateMetaAsync(refreshed, cancellationToken);
    }

    private async Task<Routing> LoadRoutingAggregateAsync(Guid routingId, CancellationToken cancellationToken)
    {
        return await _dbContext.Routings
            .AsNoTracking()
            .Include(r => r.Files)
            .Include(r => r.HistoryEntries)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing? ?? ? ????.");
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

        await _fileStorage.QueueJsonWriteAsync(meta.MetaPath, meta, cancellationToken);
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
            throw new ArgumentException($"???? ?? ?? ?????: {fileType}");
        }
    }
}
