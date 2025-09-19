using MCMS.Core.Contracts.Dtos;

namespace MCMS.Client.Services;

public interface IItemDataService
{
    Task<IReadOnlyList<ItemDto>> GetItemsAsync(CancellationToken cancellationToken = default);
}
