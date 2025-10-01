namespace MCMS.Core.Contracts.Dtos;

public record SolidWorksLinkDto(
    Guid LinkId,
    Guid ItemRevisionId,
    Guid RoutingId,
    string ModelPath,
    string? Configuration,
    bool IsLinked,
    DateTimeOffset? LastSyncedAt,
    string? UpdatedBy,
    DateTimeOffset? UpdatedAt);