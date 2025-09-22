using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Contracts.Responses;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class AuditLogService : IAuditLogService
{
    private const int CsvExportLimit = 5000;
    private readonly McmsDbContext _dbContext;

    public AuditLogService(McmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task RecordAsync(AuditLogEntryDto entry, CancellationToken cancellationToken = default)
    {
        var entity = new AuditLogEntry
        {
            Id = entry.Id == Guid.Empty ? Guid.NewGuid() : entry.Id,
            Category = entry.Category,
            Action = entry.Action,
            Severity = entry.Severity,
            Summary = entry.Summary,
            Details = entry.Details,
            RoutingId = entry.RoutingId,
            HistoryEntryId = entry.HistoryEntryId,
            MetadataJson = entry.MetadataJson,
            TraceId = entry.TraceId,
            RequestId = entry.RequestId,
            EventAt = entry.EventAt,
            CreatedAt = entry.EventAt,
            CreatedBy = entry.CreatedBy,
            UpdatedAt = entry.EventAt,
            UpdatedBy = entry.CreatedBy
        };

        _dbContext.AuditLogEntries.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<AuditLogSearchResponse> SearchAsync(AuditLogQueryRequest request, CancellationToken cancellationToken = default)
    {
        var (query, page, pageSize) = BuildFilteredQuery(request);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.EventAt)
            .ThenByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(MapToDto)
            .ToListAsync(cancellationToken);

        return new AuditLogSearchResponse(items, totalCount, page, pageSize);
    }

    public async Task<byte[]> ExportCsvAsync(AuditLogQueryRequest request, CancellationToken cancellationToken = default)
    {
        request = request with { Page = 1, PageSize = CsvExportLimit };
        var (query, _, _) = BuildFilteredQuery(request);

        var rows = await query
            .OrderByDescending(x => x.EventAt)
            .Take(CsvExportLimit)
            .ToListAsync(cancellationToken);

        var builder = new StringBuilder();
        builder.AppendLine("Timestamp,Category,Action,Severity,Actor,Summary,RoutingId,HistoryEntryId,TraceId,RequestId");
        foreach (var row in rows)
        {
            var summary = row.Summary?.Replace("\"", "\"\"") ?? string.Empty;
            var actor = row.CreatedBy?.Replace("\"", "\"\"") ?? string.Empty;
            builder.AppendFormat(CultureInfo.InvariantCulture,
                "{0},{1},{2},{3},\"{4}\",\"{5}\",{6},{7},{8},{9}",
                row.EventAt.UtcDateTime.ToString("o"),
                row.Category,
                row.Action,
                row.Severity,
                actor,
                summary,
                row.RoutingId?.ToString() ?? string.Empty,
                row.HistoryEntryId?.ToString() ?? string.Empty,
                row.TraceId ?? string.Empty,
                row.RequestId ?? string.Empty);
            builder.AppendLine();
        }

        return Encoding.UTF8.GetBytes(builder.ToString());
    }

    public async Task<AuditLogStatisticsDto> GetStatisticsAsync(AuditLogStatisticsRequest request, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.AuditLogEntries.AsNoTracking();

        query = query.Where(x => x.EventAt >= request.From && x.EventAt <= request.To);

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(x => x.Category == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.CreatedBy))
        {
            query = query.Where(x => x.CreatedBy == request.CreatedBy);
        }

        if (request.RoutingId.HasValue)
        {
            query = query.Where(x => x.RoutingId == request.RoutingId);
        }

        var entries = await query.ToListAsync(cancellationToken);
        var totalEvents = entries.Count;
        var approvalEvents = entries.Count(e => string.Equals(e.Category, "Approval", StringComparison.OrdinalIgnoreCase));
        var rejectionEvents = entries.Count(e => string.Equals(e.Action, "RoutingRejected", StringComparison.OrdinalIgnoreCase));
        var criticalEvents = entries.Count(e => e.Severity == AuditSeverity.Critical);

        var eventsByCategory = entries
            .GroupBy(e => e.Category)
            .OrderByDescending(g => g.Count())
            .ToDictionary(g => g.Key, g => g.Count());

        var eventsByActor = entries
            .GroupBy(e => string.IsNullOrWhiteSpace(e.CreatedBy) ? "unknown" : e.CreatedBy)
            .OrderByDescending(g => g.Count())
            .Take(5)
            .ToDictionary(g => g.Key, g => g.Count());

        var approvalDurations = CalculateApprovalDurations(entries);
        var pendingApprovalAverageHours = approvalDurations.Any() ? approvalDurations.Average() : 0d;

        var alerts = BuildAlerts(totalEvents, criticalEvents, rejectionEvents, pendingApprovalAverageHours);

        return new AuditLogStatisticsDto(
            request.From,
            request.To,
            totalEvents,
            approvalEvents,
            rejectionEvents,
            criticalEvents,
            pendingApprovalAverageHours,
            eventsByCategory,
            eventsByActor,
            alerts);
    }

    private static IEnumerable<double> CalculateApprovalDurations(IEnumerable<AuditLogEntry> entries)
    {
        var requests = entries
            .Where(e => string.Equals(e.Action, "ApprovalRequested", StringComparison.OrdinalIgnoreCase) && e.RoutingId.HasValue)
            .GroupBy(e => e.RoutingId!.Value)
            .ToDictionary(g => g.Key, g => g.Min(x => x.EventAt));

        var decisions = entries
            .Where(e => e.RoutingId.HasValue &&
                        (string.Equals(e.Action, "RoutingApproved", StringComparison.OrdinalIgnoreCase)
                         || string.Equals(e.Action, "RoutingRejected", StringComparison.OrdinalIgnoreCase)));

        foreach (var decision in decisions)
        {
            if (requests.TryGetValue(decision.RoutingId!.Value, out var requestedAt))
            {
                var duration = (decision.EventAt - requestedAt).TotalHours;
                if (duration >= 0)
                {
                    yield return duration;
                }
            }
        }
    }

    private static IReadOnlyList<AuditAlertDto> BuildAlerts(int totalEvents, int criticalEvents, int rejectionEvents, double avgHours)
    {
        var alerts = new List<AuditAlertDto>();
        var now = DateTimeOffset.UtcNow;

        if (criticalEvents > 0)
        {
            alerts.Add(new AuditAlertDto(
                $"critical-{now.ToUnixTimeSeconds()}",
                "Critical audit events detected",
                "critical",
                $"{criticalEvents} critical events recorded in the selected window.",
                now));
        }

        if (totalEvents > 0)
        {
            var rejectionRate = (double)rejectionEvents / totalEvents;
            if (rejectionRate >= 0.25)
            {
                alerts.Add(new AuditAlertDto(
                    $"rejection-{now.ToUnixTimeSeconds()}",
                    "High rejection rate",
                    "warning",
                    $"Rejection rate is {(rejectionRate * 100):F1}% of total audit events.",
                    now));
            }
        }

        if (avgHours >= 12)
        {
            alerts.Add(new AuditAlertDto(
                $"sla-{now.ToUnixTimeSeconds()}",
                "Approval SLA at risk",
                "warning",
                $"Average approval turnaround is {avgHours:F1}h. Target is under 12h.",
                now));
        }

        if (alerts.Count == 0)
        {
            alerts.Add(new AuditAlertDto(
                $"ok-{now.ToUnixTimeSeconds()}",
                "No anomalies detected",
                "info",
                "Audit activity within normal thresholds.",
                now));
        }

        return alerts;
    }

    private (IQueryable<AuditLogEntry> Query, int Page, int PageSize) BuildFilteredQuery(AuditLogQueryRequest request)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 200);

        var query = _dbContext.AuditLogEntries.AsNoTracking();

        if (request.From.HasValue)
        {
            query = query.Where(x => x.EventAt >= request.From.Value);
        }

        if (request.To.HasValue)
        {
            query = query.Where(x => x.EventAt <= request.To.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(x => x.Category == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Action))
        {
            query = query.Where(x => x.Action == request.Action);
        }

        if (!string.IsNullOrWhiteSpace(request.CreatedBy))
        {
            query = query.Where(x => x.CreatedBy == request.CreatedBy);
        }

        if (request.RoutingId.HasValue)
        {
            query = query.Where(x => x.RoutingId == request.RoutingId);
        }

        return (query, page, pageSize);
    }

    private static AuditLogEntryDto MapToDto(AuditLogEntry entity) => new(
        entity.Id,
        entity.Category,
        entity.Action,
        entity.Severity,
        entity.Summary,
        entity.Details,
        entity.RoutingId,
        entity.HistoryEntryId,
        entity.EventAt,
        entity.CreatedBy,
        entity.MetadataJson,
        entity.TraceId,
        entity.RequestId);
}
