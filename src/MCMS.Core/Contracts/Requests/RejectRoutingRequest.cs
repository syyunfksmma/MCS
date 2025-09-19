using System;

namespace MCMS.Core.Contracts.Requests;

public record RejectRoutingRequest(
    Guid RoutingId,
    string RejectedBy,
    string Reason,
    DateTimeOffset RejectedAt);
