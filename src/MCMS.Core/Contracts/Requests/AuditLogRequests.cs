using System;

namespace MCMS.Core.Contracts.Requests;

public record AuditLogQueryRequest(
    DateTimeOffset? From,
    DateTimeOffset? To,
    string? Category,
    string? Action,
    string? CreatedBy,
    Guid? RoutingId,
    int Page = 1,
    int PageSize = 50);

public record AuditLogStatisticsRequest(
    DateTimeOffset From,
    DateTimeOffset To,
    string? Category = null,
    string? CreatedBy = null,
    Guid? RoutingId = null);
