using System;
using System.Collections.Generic;

namespace MCMS.Core.Contracts.Requests;

public record RenewAddinKeyRequest(string? RequestedBy, int? ValidDays);

public record AddinJobCreateRequest(Guid RoutingId, IDictionary<string, string> Parameters, string CreatedBy);

public record AddinJobCompleteRequest(string ResultStatus, string? Message);
