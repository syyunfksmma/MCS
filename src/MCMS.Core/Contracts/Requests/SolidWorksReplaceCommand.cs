using System.IO;

namespace MCMS.Core.Contracts.Requests;

public class SolidWorksReplaceCommand
{
    public Stream? FileStream { get; init; }
    public string? FileName { get; init; }
    public string? ModelPath { get; init; }
    public string RequestedBy { get; init; } = string.Empty;
    public string? Configuration { get; init; }
    public string? Comment { get; init; }
}
