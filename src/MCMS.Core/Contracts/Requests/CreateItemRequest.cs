namespace MCMS.Core.Contracts.Requests;

public record CreateItemRequest(
    string ItemCode,
    string Name,
    string? Description,
    string CreatedBy);
