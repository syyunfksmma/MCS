using System;

namespace MCMS.Core.Contracts.Requests;

public record ApproveRoutingRequest(
    Guid RoutingId,
    string ApprovedBy,
    string? Comment,
    DateTimeOffset ApprovedAt);
