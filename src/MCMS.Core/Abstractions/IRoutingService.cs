using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IRoutingService
{
    Task<RoutingDto> CreateRoutingAsync(CreateRoutingRequest request, CancellationToken cancellationToken = default);
    Task<RoutingDto?> GetRoutingAsync(Guid routingId, CancellationToken cancellationToken = default);
    Task<IEnumerable<RoutingSummaryDto>> GetRoutingsForRevisionAsync(Guid itemRevisionId, CancellationToken cancellationToken = default);
    Task<RoutingDto> UpdateRoutingAsync(UpdateRoutingRequest request, CancellationToken cancellationToken = default);
    Task<RoutingDto> ReviewRoutingAsync(ReviewRoutingRequest request, CancellationToken cancellationToken = default);
}
