using MCMS.Core.Domain.Entities;

namespace MCMS.Core.Abstractions;

public interface ICamWorkStatusService
{
    Task<CamWorkStatus> UpsertAsync(
        string woNo,
        string procSeq,
        string? itemCd,
        bool is3DModeled,
        bool isPgCompleted,
        string? updatedBy,
        CancellationToken cancellationToken = default);

    Task<CamWorkStatus?> GetAsync(
        string woNo,
        string procSeq,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyDictionary<(string WoNo, string ProcSeq), CamWorkStatus>> GetManyAsync(
        IEnumerable<(string WoNo, string ProcSeq)> keys,
        CancellationToken cancellationToken = default);
}
