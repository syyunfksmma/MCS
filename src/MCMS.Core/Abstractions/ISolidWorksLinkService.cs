using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface ISolidWorksLinkService
{
    Task<SolidWorksLinkDto> ReplaceAsync(Guid routingId, SolidWorksReplaceCommand request, CancellationToken cancellationToken = default);
    Task<SolidWorksLinkDto?> GetAsync(Guid routingId, CancellationToken cancellationToken = default);
}
