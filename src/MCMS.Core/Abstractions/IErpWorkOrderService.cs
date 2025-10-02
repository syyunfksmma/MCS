using MCMS.Core.Contracts.Dtos;

namespace MCMS.Core.Abstractions;

public interface IErpWorkOrderService
{
    Task<IReadOnlyList<ErpWorkOrderDto>> GetPendingWorkOrdersAsync(CancellationToken cancellationToken = default);
}
