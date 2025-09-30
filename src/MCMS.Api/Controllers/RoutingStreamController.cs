using System.Text;
using MCMS.Api.Streaming;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("stream")]
public class RoutingStreamController : ControllerBase
{
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

        await foreach (var sse in _eventStream.SubscribeAsync(HttpContext.RequestAborted))
        {
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
