using MCMS.Core.Abstractions;
using MCMS.Core.Domain.Entities;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class CamWorkStatusService : ICamWorkStatusService
{
    private readonly McmsDbContext _dbContext;

    public CamWorkStatusService(McmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CamWorkStatus> UpsertAsync(
        string woNo,
        string procSeq,
        string? itemCd,
        bool is3DModeled,
        bool isPgCompleted,
        string? updatedBy,
        CancellationToken cancellationToken = default)
    {
        var status = await _dbContext.CamWorkStatuses
            .FirstOrDefaultAsync(x => x.WoNo == woNo && x.ProcSeq == procSeq, cancellationToken)
            .ConfigureAwait(false);

        var utcNow = DateTimeOffset.UtcNow;
        var actor = string.IsNullOrWhiteSpace(updatedBy) ? "system" : updatedBy;

        if (status is null)
        {
            status = new CamWorkStatus
            {
                WoNo = woNo,
                ProcSeq = procSeq,
                ItemCd = itemCd,
                Is3DModeled = is3DModeled,
                IsPgCompleted = isPgCompleted,
                Last3DModeledAt = is3DModeled ? utcNow : null,
                LastPgCompletedAt = isPgCompleted ? utcNow : null,
                CreatedBy = actor,
                UpdatedBy = actor,
                UpdatedAt = utcNow
            };

            await _dbContext.CamWorkStatuses.AddAsync(status, cancellationToken).ConfigureAwait(false);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(itemCd))
            {
                status.ItemCd = itemCd;
            }

            if (status.Is3DModeled != is3DModeled)
            {
                status.Last3DModeledAt = is3DModeled ? utcNow : null;
            }

            if (status.IsPgCompleted != isPgCompleted)
            {
                status.LastPgCompletedAt = isPgCompleted ? utcNow : null;
            }

            status.Is3DModeled = is3DModeled;
            status.IsPgCompleted = isPgCompleted;
            status.UpdatedBy = actor;
            status.UpdatedAt = utcNow;
        }

        await _dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return status;
    }

    public async Task<CamWorkStatus?> GetAsync(
        string woNo,
        string procSeq,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.CamWorkStatuses
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.WoNo == woNo && x.ProcSeq == procSeq, cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<IReadOnlyDictionary<(string WoNo, string ProcSeq), CamWorkStatus>> GetManyAsync(
        IEnumerable<(string WoNo, string ProcSeq)> keys,
        CancellationToken cancellationToken = default)
    {
        var keyList = keys.ToList();
        if (keyList.Count == 0)
        {
            return new Dictionary<(string WoNo, string ProcSeq), CamWorkStatus>();
        }

        var woNos = keyList.Select(static key => key.WoNo).Distinct(StringComparer.OrdinalIgnoreCase).ToList();

        var statuses = await _dbContext.CamWorkStatuses
            .AsNoTracking()
            .Where(status => woNos.Contains(status.WoNo))
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        var lookupKeys = keyList.ToHashSet();
        var result = new Dictionary<(string WoNo, string ProcSeq), CamWorkStatus>();

        foreach (var status in statuses)
        {
            var tuple = (status.WoNo, status.ProcSeq);
            if (lookupKeys.Contains(tuple))
            {
                result[tuple] = status;
            }
        }

        return result;
    }
}
