namespace MCMS.Core.Contracts.Requests;

public record CreateItemRevisionRequest(
    Guid ItemId,
    string RevisionCode,
    DateTimeOffset? ValidFrom,
    string RequestedBy);
