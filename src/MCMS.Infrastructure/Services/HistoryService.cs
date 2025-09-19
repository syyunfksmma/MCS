using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Domain.Entities;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class HistoryService : IHistoryService
{
    private readonly McmsDbContext _dbContext;

    public HistoryService(McmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<HistoryEntryDto>> GetHistoryForRoutingAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        var entries = await _dbContext.HistoryEntries
            .AsNoTracking()
            .Where(x => x.RoutingId == routingId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return entries.Select(Map).ToList();
    }

    public async Task RecordAsync(HistoryEntryDto entry, CancellationToken cancellationToken = default)
    {
        var entity = new HistoryEntry
        {
            Id = entry.Id == Guid.Empty ? Guid.NewGuid() : entry.Id,
            RoutingId = entry.RoutingId,
            ChangeType = entry.ChangeType,
            Field = entry.Field,
            PreviousValue = entry.PreviousValue,
            CurrentValue = entry.CurrentValue,
            Outcome = entry.Outcome,
            CreatedAt = entry.CreatedAt,
            CreatedBy = entry.CreatedBy,
            Comment = entry.Comment,
            EffectiveDate = entry.CreatedAt
        };

        _dbContext.HistoryEntries.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static HistoryEntryDto Map(HistoryEntry entity) => new(
        entity.Id,
        entity.RoutingId,
        entity.ChangeType,
        entity.Field,
        entity.PreviousValue,
        entity.CurrentValue,
        entity.Outcome,
        entity.CreatedAt,
        entity.CreatedBy,
        entity.Comment);
}

