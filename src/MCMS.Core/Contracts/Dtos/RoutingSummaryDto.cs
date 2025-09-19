using System;
using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingSummaryDto(
    Guid Id,
    string RoutingCode,
    RoutingStatus Status,
    string CamRevision,
    bool IsPrimary,
    ApprovalStatus ApprovalStatus,
    DateTimeOffset? ApprovalRequestedAt,
    string? ApprovalRequestedBy,
    int StepCount,
    int FileCount,
    DateTimeOffset UpdatedAt,
    string? UpdatedBy);
