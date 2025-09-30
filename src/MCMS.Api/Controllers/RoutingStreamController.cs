using System.Text;
using System.Threading;
using MCMS.Api.Streaming;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("stream")]
public class RoutingStreamController : ControllerBase
{
    private static readonly TimeSpan HeartbeatInterval = TimeSpan.FromSeconds(25);
    private readonly IRoutingEventStream _eventStream;

    public RoutingStreamController(IRoutingEventStream eventStream)
    {
        _eventStream = eventStream;
    }

    [HttpGet("routing")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public async Task StreamRoutingAsync(CancellationToken cancellationToken)
    {
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["Content-Type"] = "text/event-stream";
        Response.Headers["Connection"] = "keep-alive";

        await Response.WriteAsync("retry: 5000\n\n", cancellationToken);
        await Response.Body.FlushAsync(cancellationToken);

        await using var enumerator = _eventStream.SubscribeAsync(HttpContext.RequestAborted).GetAsyncEnumerator(cancellationToken);
        using var heartbeatTimer = new PeriodicTimer(HeartbeatInterval);

        while (!cancellationToken.IsCancellationRequested)
        {
            var heartbeatTask = heartbeatTimer.WaitForNextTickAsync(cancellationToken).AsTask();
            var moveNextTask = enumerator.MoveNextAsync().AsTask();

            var completed = await Task.WhenAny(moveNextTask, heartbeatTask);

            if (completed == heartbeatTask)
            {
                if (!heartbeatTask.Result)
                {
                    break;
                }

                await Response.WriteAsync(": keep-alive\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
                continue;
            }

            if (!moveNextTask.Result)
            {
                break;
            }

            var sse = enumerator.Current;
            var builder = new StringBuilder();
            if (!string.IsNullOrWhiteSpace(sse.Id))
            {
                builder.Append("id: ").Append(sse.Id).Append('\n');
            }

            builder.Append("event: ").Append(sse.Event).Append('\n');
            builder.Append("data: ").Append(sse.Data).Append("\n\n");

            await Response.WriteAsync(builder.ToString(), cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);
        }
    }
}
