namespace MCMS.Core.Abstractions;

public readonly record struct FileSaveResult(string RelativePath, string Checksum, long Length);
