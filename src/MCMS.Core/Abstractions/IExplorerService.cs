using MCMS.Core.Contracts.Dtos;

namespace MCMS.Core.Abstractions;

public interface IExplorerService
{
    Task<ExplorerResponseDto> GetExplorerAsync(CancellationToken cancellationToken = default);
}
