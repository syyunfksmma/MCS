namespace MCMS.Core.Abstractions;

public interface ICommandQueue
{
    Task EnqueueAsync<T>(T command, CancellationToken cancellationToken = default) where T : class;
    IAsyncEnumerable<T> DequeueAsync<T>(CancellationToken cancellationToken = default) where T : class;
}
