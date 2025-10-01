namespace MCMS.Core.Contracts.Requests;

public record ReplaceSolidWorksRequest(
    string ModelPath,
    string RequestedBy,
    string? Configuration = null,
    string? Comment = null);