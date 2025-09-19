using System;
using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingDto(
    Guid Id,
    Guid ItemRevisionId,
    string RoutingCode,
    RoutingStatus Status,
    string CamRevision,
    bool IsPrimary,
    ApprovalStatus ApprovalStatus,
    DateTimeOffset? ApprovalRequestedAt,
    string? ApprovalRequestedBy,
    IReadOnlyCollection<RoutingStepDto> Steps,
    IReadOnlyCollection<RoutingFileDto> Files,
    IReadOnlyCollection<HistoryEntryDto> History);
