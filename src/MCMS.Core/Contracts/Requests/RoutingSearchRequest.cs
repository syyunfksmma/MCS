using System;

namespace MCMS.Core.Contracts.Requests;

public record RoutingSearchRequest(
    string Term,
    RoutingSearchFilters? Filters,
    int Page = 1,
    int PageSize = 25,
    int? SlaTargetMs = null);

public record RoutingSearchFilters(
    string? ProductCode,
    string? GroupId,
    string? FileType,
    string? Owner,
    DateTimeOffset? UpdatedAfter,
    DateTimeOffset? UpdatedBefore);
