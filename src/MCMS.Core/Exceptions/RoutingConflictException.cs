using System;
using MCMS.Core.Contracts.Dtos;

namespace MCMS.Core.Exceptions;

public class RoutingConflictException : Exception
{
    public RoutingConflictException(RoutingDto existingRouting, bool fromIdempotencyKey, string? message = null)
        : base(message ?? "Routing already exists.")
    {
        ExistingRouting = existingRouting;
        FromIdempotencyKey = fromIdempotencyKey;
    }

    public RoutingDto ExistingRouting { get; }

    public bool FromIdempotencyKey { get; }
}
