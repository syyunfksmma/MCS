namespace MCMS.Core.Contracts.Requests;

public record SetRoutingVersionRequest(bool IsPrimary, string RequestedBy, string? Comment);
