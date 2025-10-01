using System;
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
    private readonly ILogger<SolidWorksLinkService> _logger;

    public SolidWorksLinkService(
        McmsDbContext dbContext,
        ISolidWorksIntegrationService integrationService,
        IHistoryService historyService,
        ILogger<SolidWorksLinkService> logger)
    {
        _dbContext = dbContext;
        _integrationService = integrationService;
        _historyService = historyService;
        _logger = logger;
    }

    public async Task<SolidWorksLinkDto> ReplaceAsync(Guid routingId, ReplaceSolidWorksRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.ModelPath))
        {
            throw new ArgumentException("Model path is required.", nameof(request));
        }

        var routing = await _dbContext.Routings
            .Include(r => r.ItemRevision)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing not found.");

        await _integrationService.LinkModelAsync(routing.ItemRevisionId, request.ModelPath, request.Configuration, cancellationToken);

        var link = await _dbContext.SolidWorksLinks
            .FirstOrDefaultAsync(l => l.ItemRevisionId == routing.ItemRevisionId, cancellationToken);

        var now = DateTimeOffset.UtcNow;
        if (link is null)
        {
            link = new SolidWorksLink
            {
                ItemRevisionId = routing.ItemRevisionId,
                ModelPath = request.ModelPath,
                Configuration = request.Configuration,
                IsLinked = true,
                LastSyncedAt = now,
                CreatedBy = request.RequestedBy,
                UpdatedBy = request.RequestedBy,
                UpdatedAt = now
            };
            _dbContext.SolidWorksLinks.Add(link);
        }
        else
        {
            link.ModelPath = request.ModelPath;
            link.Configuration = request.Configuration;
            link.IsLinked = true;
            link.LastSyncedAt = now;
            link.UpdatedAt = now;
            link.UpdatedBy = request.RequestedBy;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            routing.Id,
            "SolidWorksModelReplaced",
            nameof(SolidWorksLink.ModelPath),
            null,
            request.ModelPath,
            ApprovalOutcome.Pending,
            now,
            request.RequestedBy,
            request.Comment), cancellationToken);

        _logger.LogInformation("SolidWorks model replaced for routing {RoutingId} by {User}.", routing.Id, request.RequestedBy);

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