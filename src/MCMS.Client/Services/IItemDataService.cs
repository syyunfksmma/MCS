using System;
using System.Collections.Generic;
using System.Threading;
using MCMS.Core.Contracts.Dtos;

namespace MCMS.Client.Services;

public interface IItemDataService
{
    Task<IReadOnlyList<ItemDto>> GetItemsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<HistoryEntryDto>> GetRoutingHistoryAsync(Guid routingId, CancellationToken cancellationToken = default);
}
