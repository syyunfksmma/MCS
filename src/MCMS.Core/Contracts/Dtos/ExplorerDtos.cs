namespace MCMS.Core.Contracts.Dtos;

public record ExplorerFileDto(
    string Id,
    string Name,
    string Type,
    string RelativePath,
    bool IsPrimary,
    long SizeBytes,
    string? Checksum,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt);

public record ExplorerRoutingDto(
    string Id,
    string Code,
    string Status,
    string CamRevision,
    bool IsPrimary,
    string? Owner,
    string? Notes,
    string? SharedDrivePath,
    bool SharedDriveReady,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt,
    IReadOnlyCollection<ExplorerFileDto> Files);

public record ExplorerRoutingGroupDto(
    string Id,
    string Name,
    string? Description,
    int DisplayOrder,
    bool IsDeleted,
    string? UpdatedBy,
    DateTimeOffset? UpdatedAt,
    string? SharedDrivePath,
    IReadOnlyCollection<ExplorerRoutingDto> Routings);

public record ExplorerRevisionDto(
    string Id,
    string Code,
    IReadOnlyCollection<ExplorerRoutingGroupDto> RoutingGroups);

public record ExplorerItemDto(
    string Id,
    string Code,
    string Name,
    IReadOnlyCollection<ExplorerRevisionDto> Revisions);

public record ExplorerAddinJobDto(
    string Id,
    string RoutingId,
    string RoutingCode,
    string ItemCode,
    string ItemName,
    string RevisionCode,
    string Status,
    string RequestedBy,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt,
    string? LastMessage);

public record ExplorerApprovalEventDto(
    string Id,
    string RoutingId,
    string Decision,
    string Actor,
    string? Comment,
    DateTimeOffset CreatedAt,
    string Source,
    string? Action);

public record ExplorerResponseDto(
    string Source,
    DateTimeOffset GeneratedAt,
    IReadOnlyCollection<ExplorerItemDto> Items,
    IReadOnlyCollection<ExplorerAddinJobDto> AddinJobs,
    IReadOnlyDictionary<string, IReadOnlyCollection<ExplorerApprovalEventDto>> ApprovalEvents);
