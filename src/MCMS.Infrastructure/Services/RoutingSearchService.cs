using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MCMS.Infrastructure.Services;

public class RoutingSearchService : IRoutingSearchService
{
    private readonly McmsDbContext _dbContext;
    private readonly ILogger<RoutingSearchService> _logger;

    public RoutingSearchService(McmsDbContext dbContext, ILogger<RoutingSearchService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<RoutingSearchResponseDto> SearchAsync(RoutingSearchRequest request, CancellationToken cancellationToken = default)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 200);
        var term = request.Term?.Trim();

        var query = _dbContext.Routings
            .AsNoTracking()
            .Include(r => r.ItemRevision!)
                .ThenInclude(rev => rev.Item)
            .Include(r => r.Files)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(term))
        {
            var like = $"%{term}%";
            query = query.Where(r =>
                EF.Functions.Like(r.RoutingCode, like) ||
                (r.ItemRevision != null && EF.Functions.Like(r.ItemRevision.RevisionCode, like)) ||
                (r.ItemRevision != null && r.ItemRevision.Item != null && EF.Functions.Like(r.ItemRevision.Item.ItemCode, like)) ||
                (r.UpdatedBy != null && EF.Functions.Like(r.UpdatedBy, like)));
        }

        var filters = request.Filters;
        if (filters is not null)
        {
            if (!string.IsNullOrWhiteSpace(filters.ProductCode))
            {
                query = query.Where(r => r.ItemRevision != null && r.ItemRevision.Item != null && r.ItemRevision.Item.ItemCode == filters.ProductCode);
            }

            if (!string.IsNullOrWhiteSpace(filters.GroupId))
            {
                query = query.Where(r => r.ItemRevision != null && r.ItemRevision.Item != null && r.ItemRevision.Item.Description == filters.GroupId);
            }

            if (!string.IsNullOrWhiteSpace(filters.FileType))
            {
                query = query.Where(r => r.Files.Any(f => f.FileType.ToString().Equals(filters.FileType, StringComparison.OrdinalIgnoreCase)));
            }

            if (!string.IsNullOrWhiteSpace(filters.Owner))
            {
                query = query.Where(r => r.UpdatedBy == filters.Owner || r.CreatedBy == filters.Owner);
            }

            if (filters.UpdatedAfter.HasValue)
            {
                var lowerBound = filters.UpdatedAfter.Value;
                query = query.Where(r => (r.UpdatedAt ?? r.CreatedAt) >= lowerBound);
            }

            if (filters.UpdatedBefore.HasValue)
            {
                var upperBound = filters.UpdatedBefore.Value;
                query = query.Where(r => (r.UpdatedAt ?? r.CreatedAt) <= upperBound);
            }
        }

        var stopwatch = Stopwatch.StartNew();
        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new RoutingSearchItemDto(
                r.Id,
                r.RoutingCode,
                r.ItemRevision != null && r.ItemRevision.Item != null ? r.ItemRevision.Item.ItemCode : string.Empty,
                r.ItemRevision != null ? r.ItemRevision.RevisionCode : string.Empty,
                r.ItemRevision != null && r.ItemRevision.Item != null ? r.ItemRevision.Item.Name : "",
                r.Status.ToString(),
                r.UpdatedAt ?? r.CreatedAt,
                r.Files.OrderByDescending(f => f.CreatedAt).Select(f => f.RelativePath).FirstOrDefault()))
            .ToListAsync(cancellationToken);

        stopwatch.Stop();
        var observedMs = (int)Math.Round(stopwatch.Elapsed.TotalMilliseconds);

        if (request.SlaTargetMs.HasValue && observedMs > request.SlaTargetMs.Value)
        {
            _logger.LogWarning("Search SLA exceeded: observed {Observed}ms > target {Target}ms", observedMs, request.SlaTargetMs);
        }

        return new RoutingSearchResponseDto(
            items,
            total,
            DateTimeOffset.UtcNow,
            "api",
            observedMs);
    }
}
