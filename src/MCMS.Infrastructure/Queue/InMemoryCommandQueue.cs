using System.Threading.Channels;
using MCMS.Core.Abstractions;

namespace MCMS.Infrastructure.Queue;

public class InMemoryCommandQueue : ICommandQueue
{
    private readonly Channel<object> _channel = Channel.CreateUnbounded<object>();

    public async Task EnqueueAsync<T>(T command, CancellationToken cancellationToken = default) where T : class
    {
        ArgumentNullException.ThrowIfNull(command);
        await _channel.Writer.WriteAsync(command, cancellationToken);
    }

    public async IAsyncEnumerable<T> DequeueAsync<T>([System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default) where T : class
    {
        await foreach (var message in _channel.Reader.ReadAllAsync(cancellationToken))
        {
            if (message is T typed)
            {
                yield return typed;
            }
        }
    }
}
