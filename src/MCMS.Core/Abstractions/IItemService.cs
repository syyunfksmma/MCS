using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IItemService
{
    Task<ItemDto> CreateItemAsync(CreateItemRequest request, CancellationToken cancellationToken = default);
    Task<ItemDto?> GetItemAsync(Guid itemId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ItemDto>> SearchItemsAsync(string? term, CancellationToken cancellationToken = default);
    Task<ItemDto> CreateRevisionAsync(CreateItemRevisionRequest request, CancellationToken cancellationToken = default);
}
