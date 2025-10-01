using System;
using System.Collections.Generic;

namespace MCMS.Core.Exceptions;

public class MissingChunksException : Exception
{
    public MissingChunksException(Guid sessionId, IReadOnlyCollection<int> missingChunks, string? message = null)
        : base(message ?? $"Upload session {sessionId} is missing chunks.")
    {
        SessionId = sessionId;
        MissingChunks = missingChunks;
    }

    public Guid SessionId { get; }

    public IReadOnlyCollection<int> MissingChunks { get; }
}
