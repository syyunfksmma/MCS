using MCMS.Core.Contracts.Dtos;

namespace MCMS.Core.Abstractions;

public interface IHistoryService
{
    Task<IEnumerable<HistoryEntryDto>> GetHistoryForRoutingAsync(Guid routingId, CancellationToken cancellationToken = default);
    Task RecordAsync(HistoryEntryDto entry, CancellationToken cancellationToken = default);
}
