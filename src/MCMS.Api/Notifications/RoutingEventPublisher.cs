using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using MCMS.Api.Hubs;
using MCMS.Api.Streaming;
using MCMS.Core.Contracts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace MCMS.Api.Notifications;

public interface IRoutingEventPublisher
{
    Task PublishRoutingUpdatedAsync(RoutingDto routing, CancellationToken cancellationToken = default);
    Task PublishPackageReadyAsync(Guid routingId, string packagePath, string checksum, CancellationToken cancellationToken = default);
    Task PublishAlertTriggeredAsync(Guid alertId, string severity, string message, CancellationToken cancellationToken = default);
}

public sealed class RoutingEventPublisher : IRoutingEventPublisher
{
    private readonly IHubContext<RoutingHub, IRoutingClient> _hubContext;
    private readonly ILogger<RoutingEventPublisher> _logger;
    private readonly IRoutingEventStream _eventStream;
    private readonly JsonSerializerOptions _jsonOptions;

    public RoutingEventPublisher(
        IHubContext<RoutingHub, IRoutingClient> hubContext,
        ILogger<RoutingEventPublisher> logger,
        IRoutingEventStream eventStream,
        IOptions<JsonOptions> jsonOptions)
    {
        _hubContext = hubContext;
        _logger = logger;
        _eventStream = eventStream;
        _jsonOptions = jsonOptions.Value.JsonSerializerOptions;
    }

    public async Task PublishRoutingUpdatedAsync(RoutingDto routing, CancellationToken cancellationToken = default)
    {
        var latest = routing.History
            .OrderByDescending(entry => entry.CreatedAt)
            .FirstOrDefault();

        var payload = new RoutingUpdatedPayload(
            routing.Id,
            routing.Status.ToString(),
            latest?.CreatedBy,
            latest?.CreatedAt ?? DateTimeOffset.UtcNow);

        await _hubContext.Clients.Group(RoutingHub.AllConnectionsGroup).RoutingUpdatedAsync(payload);
        await _hubContext.Clients.Group(RoutingHub.GetRevisionGroup(routing.ItemRevisionId)).RoutingUpdatedAsync(payload);

        await BroadcastAsync("routingUpdated", payload, cancellationToken);

        _logger.LogInformation("Broadcasted routingUpdated for {RoutingId} (status: {Status})", routing.Id, routing.Status);
    }

    public async Task PublishPackageReadyAsync(Guid routingId, string packagePath, string checksum, CancellationToken cancellationToken = default)
    {
        var payload = new PackageReadyPayload(routingId, packagePath, checksum);
        await _hubContext.Clients.Group(RoutingHub.AllConnectionsGroup).PackageReadyAsync(payload);
        await BroadcastAsync("packageReady", payload, cancellationToken);
        _logger.LogInformation("Broadcasted packageReady for {RoutingId}", routingId);
    }

    public async Task PublishAlertTriggeredAsync(Guid alertId, string severity, string message, CancellationToken cancellationToken = default)
    {
        var payload = new AlertTriggeredPayload(alertId, severity, message, DateTimeOffset.UtcNow);
        await _hubContext.Clients.Group(RoutingHub.AllConnectionsGroup).AlertTriggeredAsync(payload);
        await BroadcastAsync("alertTriggered", payload, cancellationToken);
        _logger.LogWarning("Broadcasted alertTriggered {AlertId} ({Severity})", alertId, severity);
    }

    private Task BroadcastAsync(string eventName, object payload, CancellationToken cancellationToken)
    {
        var json = JsonSerializer.Serialize(payload, _jsonOptions);
        var sse = new ServerSentEvent(eventName, json);
        return _eventStream.PublishAsync(sse, cancellationToken).AsTask();
    }
}
