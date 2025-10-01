using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class RoutingVersionService : IRoutingVersionService
{
    private readonly McmsDbContext _dbContext;
    private readonly IHistoryService _historyService;

    public RoutingVersionService(McmsDbContext dbContext, IHistoryService historyService)
    {
        _dbContext = dbContext;
        _historyService = historyService;
    }

    public async Task<IReadOnlyCollection<RoutingVersionDto>> GetVersionsAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        var routing = await _dbContext.Routings
            .AsNoTracking()
            .Include(r => r.ItemRevision)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing not found.");

        var siblings = await _dbContext.Routings
            .AsNoTracking()
            .Include(r => r.Files)
            .Include(r => r.HistoryEntries)
            .Where(r => r.ItemRevisionId == routing.ItemRevisionId)
            .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
            .ToListAsync(cancellationToken);

        return siblings
            .Select(MapVersion)
            .ToArray();
    }

    public async Task<RoutingVersionDto> SetPrimaryVersionAsync(Guid routingId, Guid versionRoutingId, SetRoutingVersionRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var baseRouting = await _dbContext.Routings
            .Include(r => r.ItemRevision)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing not found.");

        var target = await _dbContext.Routings
            .Include(r => r.Files)
            .Include(r => r.HistoryEntries)
            .FirstOrDefaultAsync(r => r.Id == versionRoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Version routing not found.");

        if (target.ItemRevisionId != baseRouting.ItemRevisionId)
        {
            throw new InvalidOperationException("Version belongs to a different revision.");
        }

        if (!request.IsPrimary)
        {
            // No zero-primary state supported; ignore.
            return MapVersion(target);
        }

        var siblings = await _dbContext.Routings
            .Where(r => r.ItemRevisionId == baseRouting.ItemRevisionId)
            .ToListAsync(cancellationToken);

        foreach (var sibling in siblings)
        {
            sibling.IsPrimary = sibling.Id == target.Id;
            sibling.UpdatedAt = DateTimeOffset.UtcNow;
            sibling.UpdatedBy = request.RequestedBy;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        await _historyService.RecordAsync(new HistoryEntryDto(
            Guid.NewGuid(),
            target.Id,
            "RoutingVersionPromoted",
            nameof(Routing.IsPrimary),
            null,
            "true",
            ApprovalOutcome.Approved,
            DateTimeOffset.UtcNow,
            request.RequestedBy,
            request.Comment), cancellationToken);

        return MapVersion(target);
    }

    private static RoutingVersionDto MapVersion(Routing routing)
    {
        var history = routing.HistoryEntries
            .OrderByDescending(h => h.EffectiveDate)
            .ThenByDescending(h => h.CreatedAt)
            .Select(h => new RoutingVersionHistoryDto(
                h.Id,
                h.ChangeType,
                h.Comment,
                h.UpdatedBy ?? h.CreatedBy,
                h.EffectiveDate))
            .ToArray();

        return new RoutingVersionDto(
            routing.Id,
            routing.Id,
            routing.RoutingCode,
            routing.CamRevision ?? "1.0.0",
            routing.Status,
            routing.IsPrimary,
            routing.UpdatedBy ?? routing.CreatedBy,
            routing.CreatedAt,
            routing.UpdatedAt,
            routing.Steps.Count,
            routing.Files.Count,
            history);
    }
}
