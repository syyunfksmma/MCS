namespace MCMS.Core.Contracts.Requests;

public record UpdateRoutingRequest(
    Guid RoutingId,
    string? CamRevision,
    bool? IsPrimary,
    IEnumerable<RoutingStepWriteModel>? Steps,
    IEnumerable<RoutingFileWriteModel>? Files,
    string UpdatedBy);
