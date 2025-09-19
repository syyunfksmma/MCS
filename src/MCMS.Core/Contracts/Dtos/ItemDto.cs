namespace MCMS.Core.Contracts.Dtos;

public record ItemDto(
    Guid Id,
    string ItemCode,
    string Name,
    string? Description,
    DateTimeOffset CreatedAt,
    string CreatedBy,
    IReadOnlyCollection<ItemRevisionDto> Revisions);
