using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IRoutingSearchService
{
    Task<RoutingSearchResponseDto> SearchAsync(RoutingSearchRequest request, CancellationToken cancellationToken = default);
}
