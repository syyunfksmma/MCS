namespace MCMS.Core.Contracts.Requests;

public record CompleteChunkUploadRequest(
    string Checksum,
    bool? IsPrimary);
