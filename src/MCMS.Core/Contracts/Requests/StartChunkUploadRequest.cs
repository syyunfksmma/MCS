using System;

namespace MCMS.Core.Contracts.Requests;

public record StartChunkUploadRequest(
    string FileName,
    string FileType,
    long TotalSizeBytes,
    int ChunkSizeBytes,
    string UploadedBy);
