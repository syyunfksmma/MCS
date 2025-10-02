using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IRoutingVersionService
{
    Task<IReadOnlyCollection<RoutingVersionDto>> GetVersionsAsync(Guid routingId, CancellationToken cancellationToken = default);
    Task<RoutingVersionDto> UpdateVersionAsync(Guid routingId, Guid versionRoutingId, SetRoutingVersionRequest request, CancellationToken cancellationToken = default);
}
