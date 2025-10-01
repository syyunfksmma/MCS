using System;
using System.Collections.Generic;

namespace MCMS.Core.Contracts.Dtos;

public record ChunkUploadStatusDto(
    Guid SessionId,
    Guid RoutingId,
    int TotalChunks,
    IReadOnlyCollection<int> ReceivedChunks,
    IReadOnlyCollection<int> MissingChunks,
    DateTimeOffset ExpiresAt);
