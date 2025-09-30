using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MCMS.Api.Hubs;

[Authorize]
public sealed class TreeHub : Hub<ITreeClient>
{
    public Task SubscribeToProduct(Guid productId)
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, GetProductGroup(productId));
    }

    public Task UnsubscribeFromProduct(Guid productId)
    {
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, GetProductGroup(productId));
    }

    public Task SubscribeToRevision(Guid revisionId)
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, GetRevisionGroup(revisionId));
    }

    public Task UnsubscribeFromRevision(Guid revisionId)
    {
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, GetRevisionGroup(revisionId));
    }

    internal static string GetProductGroup(Guid productId) => $"tree:product:{productId}";
    internal static string GetRevisionGroup(Guid revisionId) => $"tree:revision:{revisionId}";
}

public interface ITreeClient
{
    Task ItemCreatedAsync(TreeItemCreatedPayload payload);
    Task ItemUpdatedAsync(TreeItemUpdatedPayload payload);
    Task ItemDeletedAsync(TreeItemDeletedPayload payload);
    Task GroupOrderChangedAsync(TreeGroupOrderChangedPayload payload);
}

public sealed record TreeItemCreatedPayload(string Level, Guid ParentId, Guid ItemId, string Name);
public sealed record TreeItemUpdatedPayload(string Level, Guid ItemId, object Patch);
public sealed record TreeItemDeletedPayload(string Level, Guid ItemId);
public sealed record TreeGroupOrderChangedPayload(Guid RevisionId, Guid[] OrderedGroupIds);
