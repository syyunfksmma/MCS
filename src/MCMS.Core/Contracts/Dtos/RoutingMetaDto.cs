using System;
using System.Collections.Generic;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingMetaDto(
    Guid RoutingId,
    string? CamRevision,
    string MetaPath,
    IReadOnlyCollection<RoutingMetaFileDto> Files,
    Guid? LatestHistoryId,
    bool RequiresResync = false,
    IReadOnlyCollection<string>? MissingFiles = null);

public record RoutingMetaFileDto(
    string FileName,
    string FileType,
    string RelativePath,
    string Checksum,
    bool IsPrimary,
    string UploadedBy,
    DateTimeOffset UploadedAt);
