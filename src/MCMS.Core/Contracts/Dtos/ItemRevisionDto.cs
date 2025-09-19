using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record ItemRevisionDto(
    Guid Id,
    string RevisionCode,
    RevisionStatus Status,
    DateTimeOffset? ValidFrom,
    DateTimeOffset? ValidTo,
    string? SolidWorksConfiguration,
    IReadOnlyCollection<RoutingSummaryDto> Routings);
