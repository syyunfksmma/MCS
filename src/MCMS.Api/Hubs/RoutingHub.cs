using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace MCMS.Api.Hubs;

public interface IRoutingClient
{
    Task RoutingUpdatedAsync(RoutingUpdatedPayload payload);
    Task PackageReadyAsync(PackageReadyPayload payload);
    Task AlertTriggeredAsync(AlertTriggeredPayload payload);
}

public sealed class RoutingHub : Hub<IRoutingClient>
{
    public const string AllConnectionsGroup = "routing:all";

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, AllConnectionsGroup);
        await base.OnConnectedAsync();
    }

    public Task SubscribeToRevision(Guid revisionId)
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, GetRevisionGroup(revisionId));
    }

    public Task UnsubscribeFromRevision(Guid revisionId)
    {
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, GetRevisionGroup(revisionId));
    }

    public static string GetRevisionGroup(Guid revisionId) => $"routing:revision:{revisionId}";
}

public sealed record RoutingUpdatedPayload(Guid RoutingId, string Status, string? UpdatedBy, DateTimeOffset UpdatedAt);

public sealed record PackageReadyPayload(Guid RoutingId, string PackagePath, string Checksum);

public sealed record AlertTriggeredPayload(Guid AlertId, string Severity, string Message, DateTimeOffset RaisedAt);
