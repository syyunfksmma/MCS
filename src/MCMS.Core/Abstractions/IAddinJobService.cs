using System;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IAddinJobService
{
    Task<AddinJobDto> EnqueueAsync(AddinJobCreateRequest request, CancellationToken cancellationToken = default);
    Task<AddinJobDto?> DequeueAsync(CancellationToken cancellationToken = default);
    Task<AddinJobDto> CompleteAsync(Guid jobId, AddinJobCompleteRequest request, CancellationToken cancellationToken = default);
    Task<AddinJobDto?> GetAsync(Guid jobId, CancellationToken cancellationToken = default);
}
