using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingFileDto(
    Guid Id,
    ManagedFileType FileType,
    string FileName,
    string RelativePath,
    long FileSizeBytes,
    string Checksum,
    bool IsPrimary,
    DateTimeOffset UploadedAt,
    string UploadedBy);
