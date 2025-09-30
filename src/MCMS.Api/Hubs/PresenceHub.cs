using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MCMS.Api.Hubs;

[Authorize]
public sealed class PresenceHub : Hub<IPresenceClient>
{
    private static readonly ConcurrentDictionary<string, PresenceSession> Sessions = new();
    private static readonly ConcurrentDictionary<Guid, string> Locks = new();

    public override Task OnConnectedAsync()
    {
        var session = new PresenceSession(GetUserId(Context));
        Sessions[Context.ConnectionId] = session;
        return base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Sessions.TryRemove(Context.ConnectionId, out var session))
        {
            if (session.RoutingId.HasValue)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetRoutingGroup(session.RoutingId.Value));
                await Clients.Group(GetRoutingGroup(session.RoutingId.Value))
                    .PresenceUpdatedAsync(new PresenceUpdatePayload(session.UserId, session.ProductCode, session.RoutingId, "offline", DateTimeOffset.UtcNow));
            }

            if (session.LockedRoutingId.HasValue && Locks.TryRemove(session.LockedRoutingId.Value, out _))
            {
                await Clients.Group(GetRoutingGroup(session.LockedRoutingId.Value))
                    .LockReleasedAsync(new LockReleasedPayload(session.LockedRoutingId.Value));
            }
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinContext(string productCode, Guid routingId)
    {
        var session = Sessions.GetOrAdd(Context.ConnectionId, _ => new PresenceSession(GetUserId(Context)));
        if (session.RoutingId.HasValue)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetRoutingGroup(session.RoutingId.Value));
        }

        session.ProductCode = productCode;
        session.RoutingId = routingId;
        session.LastSeenUtc = DateTimeOffset.UtcNow;

        await Groups.AddToGroupAsync(Context.ConnectionId, GetRoutingGroup(routingId));
        await Clients.Group(GetRoutingGroup(routingId))
            .PresenceUpdatedAsync(new PresenceUpdatePayload(session.UserId, productCode, routingId, "online", session.LastSeenUtc));
    }

    public async Task LeaveContext(Guid routingId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetRoutingGroup(routingId));
        if (Sessions.TryGetValue(Context.ConnectionId, out var session) && session.RoutingId == routingId)
        {
            session.RoutingId = null;
            session.ProductCode = null;
            await Clients.Group(GetRoutingGroup(routingId))
                .PresenceUpdatedAsync(new PresenceUpdatePayload(session.UserId, null, routingId, "offline", DateTimeOffset.UtcNow));
        }
    }

    public Task Heartbeat()
    {
        if (Sessions.TryGetValue(Context.ConnectionId, out var session))
        {
            session.LastSeenUtc = DateTimeOffset.UtcNow;
        }

        return Task.CompletedTask;
    }

    public async Task RequestLock(Guid routingId)
    {
        var userId = GetUserId(Context);
        if (!Locks.TryAdd(routingId, Context.ConnectionId))
        {
            throw new HubException("LOCKED");
        }

        if (Sessions.TryGetValue(Context.ConnectionId, out var session))
        {
            session.LockedRoutingId = routingId;
        }

        await Clients.Group(GetRoutingGroup(routingId))
            .LockAcquiredAsync(new LockPayload(routingId, userId, DateTimeOffset.UtcNow.AddMinutes(5)));
    }

    public async Task ReleaseLock(Guid routingId)
    {
        if (Locks.TryGetValue(routingId, out var connectionId) && connectionId != Context.ConnectionId)
        {
            throw new HubException("LOCK_OWNER_MISMATCH");
        }

        Locks.TryRemove(routingId, out _);
        if (Sessions.TryGetValue(Context.ConnectionId, out var session) && session.LockedRoutingId == routingId)
        {
            session.LockedRoutingId = null;
        }

        await Clients.Group(GetRoutingGroup(routingId))
            .LockReleasedAsync(new LockReleasedPayload(routingId));
    }

    private static string GetRoutingGroup(Guid routingId) => $"presence:routing:{routingId}";

    private static string GetUserId(HubCallerContext context)
    {
        return string.IsNullOrWhiteSpace(context.UserIdentifier)
            ? (context.User?.Identity?.Name ?? context.ConnectionId)
            : context.UserIdentifier!;
    }

    private sealed class PresenceSession
    {
        public PresenceSession(string userId)
        {
            UserId = string.IsNullOrWhiteSpace(userId) ? "anonymous" : userId;
        }

        public string UserId { get; }
        public string? ProductCode { get; set; }
        public Guid? RoutingId { get; set; }
        public Guid? LockedRoutingId { get; set; }
        public DateTimeOffset LastSeenUtc { get; set; } = DateTimeOffset.UtcNow;
    }
}

public interface IPresenceClient
{
    Task PresenceUpdatedAsync(PresenceUpdatePayload payload);
    Task LockAcquiredAsync(LockPayload payload);
    Task LockReleasedAsync(LockReleasedPayload payload);
}

public sealed record PresenceUpdatePayload(string UserId, string? ProductCode, Guid? RoutingId, string Status, DateTimeOffset LastSeenUtc);

public sealed record LockPayload(Guid RoutingId, string UserId, DateTimeOffset ExpiresUtc);

public sealed record LockReleasedPayload(Guid RoutingId);
