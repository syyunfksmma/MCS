using System;

namespace MCMS.Core.Contracts.Requests;

public record RequestRoutingApprovalRequest(
    Guid RoutingId,
    string RequestedBy,
    string? Comment);
