using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private const int SlaTargetMilliseconds = 1500;
    private readonly McmsDbContext _dbContext;

    public DashboardService(McmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync(
        DashboardSummaryRequest request,
        CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var (periodStart, periodEnd) = ResolvePeriod(request.Range, now);

        var routingQuery = _dbContext.Routings
            .AsNoTracking()
            .Where(r => (r.UpdatedAt ?? r.CreatedAt) >= periodStart && (r.UpdatedAt ?? r.CreatedAt) <= periodEnd);

        var statusCounts = await routingQuery
            .GroupBy(r => r.Status)
            .Select(g => new StatusCount(g.Key, g.Count()))
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        var totals = new DashboardTotalsDto(
            GetCount(statusCounts, RoutingStatus.Draft),
            GetCount(statusCounts, RoutingStatus.PendingApproval),
            GetCount(statusCounts, RoutingStatus.Approved));

        var durations = await _dbContext.AddinJobs
            .AsNoTracking()
            .Where(job => job.StartedAt.HasValue && job.CompletedAt.HasValue)
            .Where(job => job.CompletedAt >= periodStart && job.CompletedAt <= periodEnd)
            .Select(job => (job.CompletedAt!.Value - job.StartedAt!.Value).TotalMilliseconds)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        var sla = new DashboardSlaDto(
            SlaTargetMilliseconds,
            durations.Count == 0 ? 0 : Math.Round(CalculatePercentile(durations, 0.95), 2),
            durations.Count == 0 ? 0 : Math.Round(CalculatePercentile(durations, 0.99), 2));

        DashboardBreakdownDto? breakdown = null;
        if (request.IncludeBreakdown)
        {
            var ownerBreakdown = await routingQuery
                .GroupBy(r => string.IsNullOrWhiteSpace(r.CreatedBy) ? "Unknown" : r.CreatedBy)
                .Select(g => new DashboardBreakdownItemDto(g.Key!, g.Count()))
                .OrderByDescending(x => x.Count)
                .ThenBy(x => x.Key)
                .Take(5)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            var routingIds = await routingQuery
                .Select(r => r.Id)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            List<DashboardBreakdownItemDto> machineBreakdown;
            if (routingIds.Count == 0)
            {
                machineBreakdown = new List<DashboardBreakdownItemDto>();
            }
            else
            {
                machineBreakdown = await _dbContext.RoutingSteps
                    .AsNoTracking()
                    .Where(step => routingIds.Contains(step.RoutingId))
                    .GroupBy(step => string.IsNullOrWhiteSpace(step.Machine) ? "Unknown" : step.Machine)
                    .Select(g => new DashboardBreakdownItemDto(g.Key!, g.Count()))
                    .OrderByDescending(x => x.Count)
                    .ThenBy(x => x.Key)
                    .Take(5)
                    .ToListAsync(cancellationToken)
                    .ConfigureAwait(false);
            }

            breakdown = new DashboardBreakdownDto(ownerBreakdown, machineBreakdown);
        }

        var period = new DashboardPeriodDto(request.Range, periodStart, periodEnd);

        return new DashboardSummaryDto(totals, sla, breakdown, period);
    }

    private static int GetCount(IEnumerable<StatusCount> statusCounts, RoutingStatus status)
    {
        foreach (var entry in statusCounts)
        {
            if (entry.Status == status)
            {
                return entry.Count;
            }
        }

        return 0;
    }

    private static (DateTimeOffset Start, DateTimeOffset End) ResolvePeriod(DashboardRange range, DateTimeOffset reference)
    {
        var utcDate = reference.UtcDateTime;
        DateTimeOffset start;
        DateTimeOffset end;

        switch (range)
        {
            case DashboardRange.Weekly:
                var diff = (int)utcDate.DayOfWeek - (int)DayOfWeek.Monday;
                if (diff < 0)
                {
                    diff += 7;
                }

                start = new DateTimeOffset(utcDate.Date.AddDays(-diff), TimeSpan.Zero);
                end = start.AddDays(7).AddTicks(-1);
                break;
            case DashboardRange.Monthly:
                start = new DateTimeOffset(new DateTime(utcDate.Year, utcDate.Month, 1, 0, 0, 0, DateTimeKind.Utc));
                end = start.AddMonths(1).AddTicks(-1);
                break;
            default:
                start = new DateTimeOffset(utcDate.Date, TimeSpan.Zero);
                end = start.AddDays(1).AddTicks(-1);
                break;
        }

        return (start, end);
    }

    private static double CalculatePercentile(IReadOnlyList<double> values, double percentile)
    {
        if (values.Count == 0)
        {
            return 0;
        }

        var ordered = values.OrderBy(x => x).ToArray();
        var position = percentile * (ordered.Length - 1);
        var lowerIndex = (int)Math.Floor(position);
        var upperIndex = (int)Math.Ceiling(position);

        if (lowerIndex == upperIndex)
        {
            return ordered[lowerIndex];
        }

        var weight = position - lowerIndex;
        return ordered[lowerIndex] + (ordered[upperIndex] - ordered[lowerIndex]) * weight;
    }

    private readonly record struct StatusCount(RoutingStatus Status, int Count);
}
