using System;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IRoutingFileService
{
    Task<RoutingMetaDto> GetAsync(Guid routingId, CancellationToken cancellationToken = default);
    Task<RoutingMetaDto> UploadAsync(UploadRoutingFileRequest request, CancellationToken cancellationToken = default);
    Task<RoutingMetaDto> DeleteAsync(Guid routingId, Guid fileId, string deletedBy, CancellationToken cancellationToken = default);
    Task<RoutingBundleStream> CreateBundleAsync(Guid routingId, string requestedBy, CancellationToken cancellationToken = default);
    Task<RoutingFileStream> OpenFileAsync(Guid routingId, Guid fileId, CancellationToken cancellationToken = default);
}
