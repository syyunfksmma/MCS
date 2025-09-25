using System;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingSearchItemDto(
    Guid RoutingId,
    string RoutingCode,
    string ProductCode,
    string RevisionCode,
    string GroupName,
    string Status,
    DateTimeOffset? UpdatedAt,
    string? SharedDrivePath);
