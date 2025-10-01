namespace MCMS.Infrastructure.FileStorage;

public class FileStorageOptions
{
    public required string RootPath { get; init; }
    public int JsonWorkerCount { get; init; }
    public int MaxParallelJsonWrites { get; init; }
    public bool EnableMetaCaching { get; init; } = true;
    public bool EnableObjectStorageReplica { get; init; }
    public string? ObjectStorageReplicaPath { get; init; }
}
