using System;

namespace MCMS.Core.Contracts.Dtos;

public record ChunkUploadSessionDto(
    Guid SessionId,
    DateTimeOffset ExpiresAt,
    int ChunkSizeBytes,
    int TotalChunks);
