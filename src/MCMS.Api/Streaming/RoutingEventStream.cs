using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using System.Threading.Channels;

namespace MCMS.Api.Streaming;

public record ServerSentEvent(string Event, string Data, string? Id = null);

public interface IRoutingEventStream
{
    IAsyncEnumerable<ServerSentEvent> SubscribeAsync(CancellationToken cancellationToken);
    ValueTask PublishAsync(ServerSentEvent serverSentEvent, CancellationToken cancellationToken = default);
}

public sealed class RoutingEventStream : IRoutingEventStream
{
    private readonly ConcurrentDictionary<Guid, Channel<ServerSentEvent>> _subscribers = new();

    public IAsyncEnumerable<ServerSentEvent> SubscribeAsync(CancellationToken cancellationToken)
    {
        var channel = Channel.CreateUnbounded<ServerSentEvent>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        });

        var subscriptionId = Guid.NewGuid();
        _subscribers[subscriptionId] = channel;

        cancellationToken.Register(() => RemoveSubscriber(subscriptionId));

        return ReadAsync(subscriptionId, channel.Reader, cancellationToken);
    }

    public ValueTask PublishAsync(ServerSentEvent serverSentEvent, CancellationToken cancellationToken = default)
    {
        foreach (var (subscriptionId, channel) in _subscribers)
        {
            if (!channel.Writer.TryWrite(serverSentEvent))
            {
                RemoveSubscriber(subscriptionId);
            }
        }

        return ValueTask.CompletedTask;
    }

    private async IAsyncEnumerable<ServerSentEvent> ReadAsync(
        Guid subscriptionId,
        ChannelReader<ServerSentEvent> reader,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        try
        {
            while (await reader.WaitToReadAsync(cancellationToken).ConfigureAwait(false))
            {
                while (reader.TryRead(out var message))
                {
                    yield return message;
                }
            }
        }
        finally
        {
            RemoveSubscriber(subscriptionId);
        }
    }

    private void RemoveSubscriber(Guid subscriptionId)
    {
        if (_subscribers.TryRemove(subscriptionId, out var channel))
        {
            channel.Writer.TryComplete();
        }
    }
}
