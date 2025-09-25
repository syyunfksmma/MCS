using System;
using System.Collections.Generic;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingSearchResponseDto(
    IReadOnlyList<RoutingSearchItemDto> Items,
    int Total,
    DateTimeOffset GeneratedAt,
    string Source,
    int? SlaMs);
