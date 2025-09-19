using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Requests;

public record ReviewRoutingRequest(
    Guid RoutingId,
    ApprovalOutcome Outcome,
    string ReviewedBy,
    string? Comment,
    DateTimeOffset EffectiveDate);
