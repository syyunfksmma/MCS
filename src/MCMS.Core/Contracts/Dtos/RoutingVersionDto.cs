using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingVersionDto(
    Guid VersionId,
    Guid RoutingId,
    string RoutingCode,
    string CamRevision,
    RoutingStatus Status,
    bool IsPrimary,
    bool IsLegacyHidden,
    bool Is3DModeled,
    bool IsPgCompleted,
    DateTimeOffset? Last3DModeledAt,
    DateTimeOffset? LastPgCompletedAt,
    DateTimeOffset? LegacyHiddenAt,
    string? LegacyHiddenBy,
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

