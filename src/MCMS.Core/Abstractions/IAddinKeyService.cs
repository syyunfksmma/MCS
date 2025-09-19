using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IAddinKeyService
{
    Task<AddinKeyDto?> GetCurrentAsync(CancellationToken cancellationToken = default);
    Task<AddinKeyDto> RenewAsync(RenewAddinKeyRequest request, CancellationToken cancellationToken = default);
    Task<bool> ValidateAsync(string value, CancellationToken cancellationToken = default);
}
