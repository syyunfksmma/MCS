using System;
using System.IO;
using System.Linq;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MCMS.Infrastructure.Services;

public class SolidWorksLinkService : ISolidWorksLinkService
{
    private readonly McmsDbContext _dbContext;
    private readonly ISolidWorksIntegrationService _integrationService;
    private readonly IHistoryService _historyService;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILogger<SolidWorksLinkService> _logger;

    public SolidWorksLinkService(
        McmsDbContext dbContext,
        ISolidWorksIntegrationService integrationService,
        IHistoryService historyService,
        IFileStorageService fileStorageService,
        ILogger<SolidWorksLinkService> logger)
    {
        _dbContext = dbContext;
        _integrationService = integrationService;
        _historyService = historyService;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    public async Task<SolidWorksLinkDto> ReplaceAsync(Guid routingId, SolidWorksReplaceCommand command, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(command);
        if (string.IsNullOrWhiteSpace(command.RequestedBy))
        {
            throw new ArgumentException("RequestedBy is required.", nameof(command));
        }

        var routing = await _dbContext.Routings
            .Include(r => r.ItemRevision)!
            .ThenInclude(ir => ir!.Item)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing not found.");

        var itemRevision = routing.ItemRevision ??
            throw new InvalidOperationException("Routing is missing ItemRevision data.");
        if (itemRevision.Item is null)
        {
            itemRevision.Item = await _dbContext.ItemRevisions
                .Where(ir => ir.Id == itemRevision.Id)
                .Select(ir => ir.Item)
                .FirstOrDefaultAsync(cancellationToken)
                ?? throw new InvalidOperationException("ItemRevision is missing Item data.");
        }

        var now = DateTimeOffset.UtcNow;
        var link = await _dbContext.SolidWorksLinks
            .FirstOrDefaultAsync(l => l.ItemRevisionId == itemRevision.Id, cancellationToken);

        var previousModelPath = link?.ModelPath;

        string? newModelPath = null;

        if (command.FileStream is not null)
        {
            newModelPath = await SaveUploadedModelAsync(itemRevision.Item.ItemCode, command.FileStream, command.FileName, link?.ModelPath, now, cancellationToken);
        }

        if (string.IsNullOrWhiteSpace(newModelPath))
        {
            newModelPath = command.ModelPath;
        }

        if (string.IsNullOrWhiteSpace(newModelPath))
        {
            throw new ArgumentException("Either an uploaded file or model path must be provided.", nameof(command));
        }

        await _integrationService.LinkModelAsync(itemRevision.Id, newModelPath, command.Configuration, cancellationToken);

        if (link is null)
        {
            link = new SolidWorksLink
            {
                ItemRevisionId = itemRevision.Id,
                ModelPath = newModelPath,
                Configuration = command.Configuration,
                IsLinked = true,
                LastSyncedAt = now,
                CreatedBy = command.RequestedBy,
                UpdatedBy = command.RequestedBy,
                UpdatedAt = now
            };
            _dbContext.SolidWorksLinks.Add(link);
        }
        else
        {
            link.ModelPath = newModelPath;
            link.Configuration = command.Configuration;
            link.IsLinked = true;
            link.LastSyncedAt = now;
            link.UpdatedAt = now;
            link.UpdatedBy = command.RequestedBy;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            routing.Id,
            "SolidWorksModelReplaced",
            nameof(SolidWorksLink.ModelPath),
            previousModelPath,
            newModelPath,
            ApprovalOutcome.Pending,
            now,
            command.RequestedBy,
            command.Comment), cancellationToken);

        _logger.LogInformation("SolidWorks model replaced for routing {RoutingId} by {User}.", routing.Id, command.RequestedBy);

        return Map(link, routing.Id);
    }

    public async Task<SolidWorksLinkDto?> GetAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        var routing = await _dbContext.Routings
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken);

        if (routing is null)
        {
            return null;
        }

        var link = await _dbContext.SolidWorksLinks
            .AsNoTracking()
            .FirstOrDefaultAsync(l => l.ItemRevisionId == routing.ItemRevisionId, cancellationToken);

        return link is null ? null : Map(link, routing.Id);
    }

    private async Task<string> SaveUploadedModelAsync(
        string itemCode,
        Stream fileStream,
        string? fileName,
        string? previousModelPath,
        DateTimeOffset timestamp,
        CancellationToken cancellationToken)
    {
        var safeFileName = string.IsNullOrWhiteSpace(fileName)
            ? $"{itemCode}.3dm"
            : Path.GetFileName(fileName);

        var targetRelativePath = Path.Combine("3DM", itemCode, safeFileName).Replace('\\', '/');

        if (!string.IsNullOrWhiteSpace(previousModelPath) && await _fileStorageService.ExistsAsync(previousModelPath, cancellationToken))
        {
            var backupFileName = Path.GetFileName(previousModelPath);
            var backupRelativePath = Path.Combine("3DM", "archive", timestamp.ToString("yyyyMMddTHHmmss"), backupFileName).Replace('\\', '/');

            await using var existingStream = await _fileStorageService.OpenReadAsync(previousModelPath, cancellationToken);
            await _fileStorageService.SaveAsync(existingStream, backupRelativePath, cancellationToken);
        }

        if (fileStream.CanSeek)
        {
            fileStream.Seek(0, SeekOrigin.Begin);
        }

        await _fileStorageService.SaveAsync(fileStream, targetRelativePath, cancellationToken);
        return targetRelativePath;
    }

    private static SolidWorksLinkDto Map(SolidWorksLink link, Guid routingId) => new(
        link.Id,
        link.ItemRevisionId,
        routingId,
        link.ModelPath,
        link.Configuration,
        link.IsLinked,
        link.LastSyncedAt,
        link.UpdatedBy ?? link.CreatedBy,
        link.UpdatedAt ?? link.CreatedAt);
}


