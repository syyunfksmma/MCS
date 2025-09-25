using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Abstractions;

public interface IRoutingChunkUploadService
{
    Task<ChunkUploadSessionDto> StartSessionAsync(Guid routingId, StartChunkUploadRequest request, CancellationToken cancellationToken = default);
    Task AcceptChunkAsync(Guid routingId, Guid sessionId, int chunkIndex, Stream content, CancellationToken cancellationToken = default);
    Task<RoutingMetaDto> CompleteSessionAsync(Guid routingId, Guid sessionId, CompleteChunkUploadRequest request, CancellationToken cancellationToken = default);
}
