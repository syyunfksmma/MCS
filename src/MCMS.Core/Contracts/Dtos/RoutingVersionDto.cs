using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingVersionDto(
    Guid VersionId,
    Guid RoutingId,
    string RoutingCode,
    string CamRevision,
    RoutingStatus Status,
    bool IsPrimary,
    string? Owner,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt,
    int StepCount,
    int FileCount,
    IReadOnlyCollection<RoutingVersionHistoryDto> History);

public record RoutingVersionHistoryDto(
    Guid HistoryId,
    string ChangeType,
    string? Comment,
    string Actor,
    DateTimeOffset RecordedAt);
