namespace MCMS.Core.Contracts.Requests;

public record SetRoutingVersionRequest
{
    public string RequestedBy { get; init; } = string.Empty;
    public string? Comment { get; init; }
    public bool? IsPrimary { get; init; }
    public bool? LegacyHidden { get; init; }
    public bool? Is3DModeled { get; init; }
    public bool? IsPgCompleted { get; init; }
    public string? CamRevision { get; init; }
}
