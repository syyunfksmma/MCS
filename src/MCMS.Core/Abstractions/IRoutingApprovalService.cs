using System;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IRoutingApprovalService
{
    Task<RoutingDto> RequestApprovalAsync(RequestRoutingApprovalRequest request, CancellationToken cancellationToken = default);
    Task<RoutingDto> ApproveAsync(ApproveRoutingRequest request, CancellationToken cancellationToken = default);
    Task<RoutingDto> RejectAsync(RejectRoutingRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<HistoryEntryDto>> GetApprovalHistoryAsync(Guid routingId, CancellationToken cancellationToken = default);
}
