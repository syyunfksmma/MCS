using System.Collections.Concurrent;
using System.IO;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class ExplorerService : IExplorerService
{
    private readonly McmsDbContext _dbContext;

    public ExplorerService(McmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ExplorerResponseDto> GetExplorerAsync(CancellationToken cancellationToken = default)
    {
        var routingContexts = new ConcurrentDictionary<Guid, RoutingContext>();

        var items = await _dbContext.Items
            .AsNoTracking()
            .Include(item => item.Revisions)
                .ThenInclude(revision => revision.Routings)
                    .ThenInclude(routing => routing.Files)
            .Include(item => item.Revisions)
                .ThenInclude(revision => revision.Routings)
                    .ThenInclude(routing => routing.HistoryEntries)
            .OrderBy(item => item.ItemCode)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        var itemDtos = items.Select(item =>
        {
            var revisionDtos = item.Revisions
                .OrderByDescending(revision => revision.RevisionCode)
                .Select(revision => MapRevision(item, revision, routingContexts))
                .ToArray();

            return new ExplorerItemDto(
                item.Id.ToString(),
                item.ItemCode,
                item.Name,
                revisionDtos);
        }).ToArray();

        var routingIds = routingContexts.Keys.ToArray();

        var addinJobs = routingIds.Length == 0
            ? Array.Empty<ExplorerAddinJobDto>()
            : await LoadAddinJobsAsync(routingIds, routingContexts, cancellationToken).ConfigureAwait(false);

        var approvalEvents = routingContexts
            .Where(pair => pair.Value.Routing.HistoryEntries.Count > 0)
            .Select(pair => new KeyValuePair<string, IReadOnlyCollection<ExplorerApprovalEventDto>>(
                pair.Key.ToString(),
                pair.Value.Routing.HistoryEntries
                    .OrderByDescending(entry => entry.EffectiveDate)
                    .ThenByDescending(entry => entry.CreatedAt)
                    .Select(MapApprovalEvent)
                    .ToArray()))
            .ToDictionary(static pair => pair.Key, static pair => pair.Value);

        return new ExplorerResponseDto(
            Source: "api",
            GeneratedAt: DateTimeOffset.UtcNow,
            Items: itemDtos,
            AddinJobs: addinJobs,
            ApprovalEvents: approvalEvents);
    }

    private ExplorerRevisionDto MapRevision(Item item, ItemRevision revision, ConcurrentDictionary<Guid, RoutingContext> contexts)
    {
        var routingGroups = BuildGroups(item, revision, contexts);
        return new ExplorerRevisionDto(
            revision.Id.ToString(),
            revision.RevisionCode,
            routingGroups);
    }

    private IReadOnlyCollection<ExplorerRoutingGroupDto> BuildGroups(
        Item item,
        ItemRevision revision,
        ConcurrentDictionary<Guid, RoutingContext> contexts)
    {
        if (revision.Routings.Count == 0)
        {
            return Array.Empty<ExplorerRoutingGroupDto>();
        }

        var ordered = revision.Routings
            .OrderBy(routing => routing.Status)
            .ThenByDescending(routing => routing.UpdatedAt ?? routing.CreatedAt)
            .ThenBy(routing => routing.RoutingCode)
            .ToList();

        var groups = ordered
            .GroupBy(routing => routing.Status)
            .Select((group, index) =>
            {
                var routings = group
                    .Select(routing =>
                    {
                        contexts[routing.Id] = new RoutingContext(item, revision, routing);
                        return MapRouting(routing);
                    })
                    .ToArray();

                var sharedDrivePath = routings
                    .Select(routing => routing.SharedDrivePath)
                    .FirstOrDefault(path => !string.IsNullOrWhiteSpace(path));

                return new ExplorerRoutingGroupDto(
                    Id: $"{revision.Id:N}-{group.Key}",
                    Name: MapGroupName(group.Key),
                    Description: $"Routings currently in {group.Key} status.",
                    DisplayOrder: index + 1,
                    IsDeleted: false,
                    UpdatedBy: revision.UpdatedBy,
                    UpdatedAt: revision.UpdatedAt,
                    SharedDrivePath: sharedDrivePath,
                    Routings: routings);
            })
            .OrderBy(group => group.DisplayOrder)
            .ToArray();

        return groups;
    }

    private static ExplorerRoutingDto MapRouting(Routing routing)
    {
        var files = routing.Files
            .OrderBy(file => file.FileName)
            .Select(MapFile)
            .ToArray();

        return new ExplorerRoutingDto(
            routing.Id.ToString(),
            routing.RoutingCode,
            routing.Status.ToString(),
            routing.CamRevision ?? "1.0.0",
            routing.IsPrimary,
            routing.UpdatedBy ?? routing.CreatedBy,
            routing.HistoryEntries
                .OrderByDescending(entry => entry.EffectiveDate)
                .ThenByDescending(entry => entry.CreatedAt)
                .Select(entry => entry.Comment)
                .FirstOrDefault(comment => !string.IsNullOrWhiteSpace(comment)),
            ResolveSharedDrivePath(routing),
            files.Length > 0,
            routing.CreatedAt,
            routing.UpdatedAt,
            files);
    }

    private static ExplorerFileDto MapFile(RoutingFile file)
    {
        return new ExplorerFileDto(
            file.Id.ToString(),
            file.FileName,
            MapFileType(file.FileType),
            file.RelativePath,
            file.IsPrimary,
            file.FileSizeBytes,
            file.Checksum,
            file.CreatedAt,
            file.UpdatedAt);
    }

    private async Task<IReadOnlyCollection<ExplorerAddinJobDto>> LoadAddinJobsAsync(
        Guid[] routingIds,
        ConcurrentDictionary<Guid, RoutingContext> contexts,
        CancellationToken cancellationToken)
    {
        var jobs = await _dbContext.AddinJobs
            .AsNoTracking()
            .Where(job => routingIds.Contains(job.RoutingId))
            .OrderByDescending(job => job.CreatedAt)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return jobs
            .Select(job => MapAddinJob(job, contexts))
            .Where(dto => dto is not null)
            .Select(dto => dto!)
            .ToArray();
    }

    private static ExplorerAddinJobDto? MapAddinJob(
        AddinJob job,
        ConcurrentDictionary<Guid, RoutingContext> contexts)
    {
        if (!contexts.TryGetValue(job.RoutingId, out var context))
        {
            return null;
        }

        return new ExplorerAddinJobDto(
            job.Id.ToString(),
            job.RoutingId.ToString(),
            context.Routing.RoutingCode,
            context.Item.ItemCode,
            context.Item.Name,
            context.Revision.RevisionCode,
            MapAddinJobStatus(job.Status),
            job.CreatedBy,
            job.CreatedAt,
            job.UpdatedAt ?? job.CompletedAt ?? job.StartedAt,
            job.Message ?? job.ResultStatus);
    }

    private static ExplorerApprovalEventDto MapApprovalEvent(HistoryEntry entry)
    {
        return new ExplorerApprovalEventDto(
            entry.Id.ToString(),
            entry.RoutingId.ToString(),
            MapApprovalDecision(entry.Outcome),
            entry.UpdatedBy ?? entry.CreatedBy,
            entry.Comment ?? entry.ChangeType,
            entry.EffectiveDate,
            ResolveApprovalSource(entry.ChangeType),
            entry.ChangeType);
    }

    private static string MapGroupName(RoutingStatus status) => status switch
    {
        RoutingStatus.Approved => "Approved",
        RoutingStatus.PendingApproval => "Pending Approval",
        RoutingStatus.Rejected => "Rejected",
        RoutingStatus.Retired => "Retired",
        _ => "Draft"
    };

    private static string MapFileType(ManagedFileType type) => type switch
    {
        ManagedFileType.Esprit => "esprit",
        ManagedFileType.Nc => "nc",
        ManagedFileType.Meta => "meta",
        _ => "other"
    };

    private static string MapAddinJobStatus(AddinJobStatus status) => status switch
    {
        AddinJobStatus.Pending => "queued",
        AddinJobStatus.InProgress => "running",
        AddinJobStatus.Completed => "succeeded",
        AddinJobStatus.Failed => "failed",
        _ => "queued"
    };

    private static string MapApprovalDecision(ApprovalOutcome outcome) => outcome switch
    {
        ApprovalOutcome.Approved => "approved",
        ApprovalOutcome.Rejected => "rejected",
        _ => "pending"
    };

    private static string ResolveApprovalSource(string? changeType)
    {
        if (string.IsNullOrWhiteSpace(changeType))
        {
            return "user";
        }

        if (changeType.Contains("signal", StringComparison.OrdinalIgnoreCase))
        {
            return "signalr";
        }

        if (changeType.Contains("auto", StringComparison.OrdinalIgnoreCase) ||
            changeType.Contains("system", StringComparison.OrdinalIgnoreCase))
        {
            return "system";
        }

        return "user";
    }

    private static string? ResolveSharedDrivePath(Routing routing)
    {
        var candidate = routing.Files
            .OrderByDescending(file => file.IsPrimary)
            .ThenBy(file => file.FileName)
            .Select(file => file.RelativePath)
            .FirstOrDefault(path => !string.IsNullOrWhiteSpace(path));

        if (string.IsNullOrWhiteSpace(candidate))
        {
            return null;
        }

        var directory = Path.GetDirectoryName(candidate);
        if (string.IsNullOrWhiteSpace(directory))
        {
            return candidate.Replace('/', '\\');
        }

        return directory
            .Replace(Path.DirectorySeparatorChar, '\\')
            .Replace('/', '\\');
    }

    private sealed record RoutingContext(Item Item, ItemRevision Revision, Routing Routing);
}
