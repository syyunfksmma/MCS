namespace MCMS.Core.Contracts.Dtos;

public record RoutingStepDto(
    Guid Id,
    int Sequence,
    string Machine,
    string ProcessDescription,
    string? ToolInformation,
    string? Notes);
