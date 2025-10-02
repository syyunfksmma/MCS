using System;
using System.Collections.Generic;
using System.Linq;
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
            .Include(r => r.Steps)
            .Include(r => r.HistoryEntries)
            .Where(r => r.ItemRevisionId == routing.ItemRevisionId)
            .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
            .ToListAsync(cancellationToken);

        return siblings
            .Select(MapVersion)
            .ToArray();
    }

    public async Task<RoutingVersionDto> UpdateVersionAsync(Guid routingId, Guid versionRoutingId, SetRoutingVersionRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        if (string.IsNullOrWhiteSpace(request.RequestedBy))
        {
            throw new ArgumentException("RequestedBy is required.", nameof(request));
        }

        var baseRouting = await _dbContext.Routings
            .Include(r => r.ItemRevision)
            .FirstOrDefaultAsync(r => r.Id == routingId, cancellationToken)
            ?? throw new KeyNotFoundException("Routing not found.");

        var target = await _dbContext.Routings
            .Include(r => r.Files)
            .Include(r => r.Steps)
            .Include(r => r.HistoryEntries)
            .FirstOrDefaultAsync(r => r.Id == versionRoutingId, cancellationToken)
            ?? throw new KeyNotFoundException("Version routing not found.");

        if (target.ItemRevisionId != baseRouting.ItemRevisionId)
        {
            throw new InvalidOperationException("Version belongs to a different revision.");
        }

        var now = DateTimeOffset.UtcNow;
        var historyEntries = new List<HistoryEntryDto>();
        var changesMade = false;

        if (request.LegacyHidden is bool legacyHidden && target.IsLegacyHidden != legacyHidden)
        {
            var previous = target.IsLegacyHidden;
            target.IsLegacyHidden = legacyHidden;
            target.LegacyHiddenAt = legacyHidden ? now : null;
            target.LegacyHiddenBy = request.RequestedBy;
            target.UpdatedAt = now;
            target.UpdatedBy = request.RequestedBy;
            changesMade = true;

            historyEntries.Add(new HistoryEntryDto(
                Guid.NewGuid(),
                target.Id,
                "RoutingVersionLegacyVisibilityChanged",
                nameof(Routing.IsLegacyHidden),
                previous.ToString(),
                legacyHidden.ToString(),
                ApprovalOutcome.Pending,
                now,
                request.RequestedBy,
                request.Comment));
        }

        if (!string.IsNullOrWhiteSpace(request.CamRevision) && !string.Equals(target.CamRevision, request.CamRevision, StringComparison.OrdinalIgnoreCase))
        {
            historyEntries.Add(new HistoryEntryDto(
                Guid.NewGuid(),
                target.Id,
                "RoutingVersionCamRevisionChanged",
                nameof(Routing.CamRevision),
                target.CamRevision,
                request.CamRevision,
                ApprovalOutcome.Pending,
                now,
                request.RequestedBy,
                request.Comment));

            target.CamRevision = request.CamRevision;
            target.UpdatedAt = now;
            target.UpdatedBy = request.RequestedBy;
            changesMade = true;
        }

        if (request.IsPrimary is true && !target.IsPrimary)
        {
            var siblings = await _dbContext.Routings
                .Where(r => r.ItemRevisionId == baseRouting.ItemRevisionId)
                .ToListAsync(cancellationToken);

            foreach (var sibling in siblings)
            {
                sibling.IsPrimary = sibling.Id == target.Id;
                sibling.UpdatedAt = now;
                sibling.UpdatedBy = request.RequestedBy;
            }

            historyEntries.Add(new HistoryEntryDto(
                Guid.NewGuid(),
                target.Id,
                "RoutingVersionPromoted",
                nameof(Routing.IsPrimary),
                false.ToString(),
                true.ToString(),
                ApprovalOutcome.Approved,
                now,
                request.RequestedBy,
                request.Comment));

            changesMade = true;
        }
        else if (request.IsPrimary is false && target.IsPrimary)
        {
            target.IsPrimary = false;
            target.UpdatedAt = now;
            target.UpdatedBy = request.RequestedBy;
            historyEntries.Add(new HistoryEntryDto(
                Guid.NewGuid(),
                target.Id,
                "RoutingVersionDemoted",
                nameof(Routing.IsPrimary),
                true.ToString(),
                false.ToString(),
                ApprovalOutcome.Pending,
                now,
                request.RequestedBy,
                request.Comment));
            changesMade = true;
        }

        if (request.Is3DModeled is bool is3D && target.Is3DModeled != is3D)
        {
            var previous = target.Is3DModeled;
            target.Is3DModeled = is3D;
            target.Last3DModeledAt = is3D ? now : null;
            target.UpdatedAt = now;
            target.UpdatedBy = request.RequestedBy;
            historyEntries.Add(new HistoryEntryDto(
                Guid.NewGuid(),
                target.Id,
                "RoutingVersion3DStatusChanged",
                nameof(Routing.Is3DModeled),
                previous.ToString(),
                is3D.ToString(),
                ApprovalOutcome.Pending,
                now,
                request.RequestedBy,
                request.Comment));
            changesMade = true;
        }

        if (request.IsPgCompleted is bool isPg && target.IsPgCompleted != isPg)
        {
            var previous = target.IsPgCompleted;
            target.IsPgCompleted = isPg;
            target.LastPgCompletedAt = isPg ? now : null;
            target.UpdatedAt = now;
            target.UpdatedBy = request.RequestedBy;
            historyEntries.Add(new HistoryEntryDto(
                Guid.NewGuid(),
                target.Id,
                "RoutingVersionPgStatusChanged",
                nameof(Routing.IsPgCompleted),
                previous.ToString(),
                isPg.ToString(),
                ApprovalOutcome.Pending,
                now,
                request.RequestedBy,
                request.Comment));
            changesMade = true;
        }

        if (!changesMade)
        {
            return MapVersion(target);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        foreach (var entry in historyEntries)
        {
            await _historyService.RecordAsync(entry, cancellationToken);
        }

        var refreshed = await _dbContext.Routings
            .AsNoTracking()
            .Include(r => r.Files)
            .Include(r => r.Steps)
            .Include(r => r.HistoryEntries)
            .FirstOrDefaultAsync(r => r.Id == target.Id, cancellationToken)
            ?? target;

        return MapVersion(refreshed);
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
            routing.IsLegacyHidden,
            routing.Is3DModeled,
            routing.IsPgCompleted,
            routing.Last3DModeledAt,
            routing.LastPgCompletedAt,
            routing.LegacyHiddenAt,
            routing.LegacyHiddenBy,
            routing.UpdatedBy ?? routing.CreatedBy,
            routing.CreatedAt,
            routing.UpdatedAt,
            routing.Steps.Count,
            routing.Files.Count,
            history);
    }
}




