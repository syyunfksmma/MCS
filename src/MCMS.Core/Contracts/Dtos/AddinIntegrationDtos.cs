using System;
using System.Collections.Generic;

namespace MCMS.Core.Contracts.Dtos;

public record AddinKeyDto(Guid KeyId, string Value, DateTimeOffset ExpiresAt);

public record AddinJobDto(
    Guid JobId,
    Guid RoutingId,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? StartedAt,
    DateTimeOffset? CompletedAt,
    IReadOnlyDictionary<string, string> Parameters,
    string? ResultStatus,
    string? Message);
