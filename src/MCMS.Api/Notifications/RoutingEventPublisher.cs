using System;
using System.Linq;
using System.Threading.Tasks;
using MCMS.Api.Hubs;
using MCMS.Core.Contracts.Dtos;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace MCMS.Api.Notifications;

public interface IRoutingEventPublisher
{
    Task PublishRoutingUpdatedAsync(RoutingDto routing);
    Task PublishPackageReadyAsync(Guid routingId, string packagePath, string checksum);
    Task PublishAlertTriggeredAsync(Guid alertId, string severity, string message);
}

public sealed class RoutingEventPublisher : IRoutingEventPublisher
{
    private readonly IHubContext<RoutingHub, IRoutingClient> _hubContext;
    private readonly ILogger<RoutingEventPublisher> _logger;

    public RoutingEventPublisher(IHubContext<RoutingHub, IRoutingClient> hubContext, ILogger<RoutingEventPublisher> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task PublishRoutingUpdatedAsync(RoutingDto routing)
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

        _logger.LogInformation("Broadcasted routingUpdated for {RoutingId} (status: {Status})", routing.Id, routing.Status);
    }

    public async Task PublishPackageReadyAsync(Guid routingId, string packagePath, string checksum)
    {
        var payload = new PackageReadyPayload(routingId, packagePath, checksum);
        await _hubContext.Clients.Group(RoutingHub.AllConnectionsGroup).PackageReadyAsync(payload);
        _logger.LogInformation("Broadcasted packageReady for {RoutingId}", routingId);
    }

    public async Task PublishAlertTriggeredAsync(Guid alertId, string severity, string message)
    {
        var payload = new AlertTriggeredPayload(alertId, severity, message, DateTimeOffset.UtcNow);
        await _hubContext.Clients.Group(RoutingHub.AllConnectionsGroup).AlertTriggeredAsync(payload);
        _logger.LogWarning("Broadcasted alertTriggered {AlertId} ({Severity})", alertId, severity);
    }
}
