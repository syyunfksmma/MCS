
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using MCMS.CmdContracts.Commands;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MCMS.Tests.Services;

public class AddinJobServiceTests
{
    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    private static async Task<Guid> SeedRoutingAsync(McmsDbContext context)
    {
        var item = new Item { ItemCode = "ITEM-001", Name = "테스트 품목", CreatedBy = "tester" };
        var revision = new ItemRevision { Item = item, RevisionCode = "REV-A", CreatedBy = "tester" };
        var routing = new Routing { ItemRevision = revision, RoutingCode = "ROUT-001", CreatedBy = "tester" };

        context.Items.Add(item);
        context.ItemRevisions.Add(revision);
        context.Routings.Add(routing);
        await context.SaveChangesAsync();
        return routing.Id;
    }

    [Fact]
    public async Task EnqueueAsync_PersistsJob()
    {
        await using var context = CreateContext();
        var queue = new TestCommandQueue();
        var service = new AddinJobService(context, queue);
        var routingId = await SeedRoutingAsync(context);

        var request = new AddinJobCreateRequest(routingId, new Dictionary<string, string> { { "mode", "test" } }, "tester");
        var dto = await service.EnqueueAsync(request);

        Assert.Equal(routingId, dto.RoutingId);
        Assert.Equal("Pending", dto.Status);
        Assert.Equal("test", dto.Parameters["mode"]);
        Assert.Empty(queue.Commands);
    }

    [Fact]
    public async Task DequeueAsync_UpdatesStatusToInProgress()
    {
        await using var context = CreateContext();
        var queue = new TestCommandQueue();
        var service = new AddinJobService(context, queue);
        var routingId = await SeedRoutingAsync(context);

        await service.EnqueueAsync(new AddinJobCreateRequest(routingId, new Dictionary<string, string>(), "tester"));
        var job = await service.DequeueAsync();

        Assert.NotNull(job);
        Assert.Equal("InProgress", job!.Status);
        Assert.NotNull(job.StartedAt);
        Assert.Empty(queue.Commands);
    }

    [Fact]
    public async Task CompleteAsync_MarksJobCompletedAndPublishesCommand()
    {
        await using var context = CreateContext();
        var queue = new TestCommandQueue();
        var service = new AddinJobService(context, queue);
        var routingId = await SeedRoutingAsync(context);

        var dto = await service.EnqueueAsync(new AddinJobCreateRequest(routingId, new Dictionary<string, string>(), "tester"));
        await service.DequeueAsync();

        var completed = await service.CompleteAsync(dto.JobId, new AddinJobCompleteRequest("completed", "done"));

        Assert.Equal("Completed", completed.Status);
        Assert.Equal("completed", completed.ResultStatus);

        var command = Assert.Single(queue.Commands.OfType<AddinJobResultCommand>());
        Assert.Equal(dto.JobId, command.JobId);
        Assert.Equal(routingId, command.RoutingId);
        Assert.Equal("completed", command.ResultStatus);
        Assert.Equal("done", command.Message);
    }

    private sealed class TestCommandQueue : ICommandQueue
    {
        private readonly List<object> _commands = new();

        public IReadOnlyList<object> Commands => _commands;

        public Task EnqueueAsync<T>(T command, CancellationToken cancellationToken = default) where T : class
        {
            _commands.Add(command!);
            return Task.CompletedTask;
        }

        public async IAsyncEnumerable<T> DequeueAsync<T>([EnumeratorCancellation] CancellationToken cancellationToken = default) where T : class
        {
            foreach (var command in _commands)
            {
                cancellationToken.ThrowIfCancellationRequested();
                if (command is T typed)
                {
                    yield return typed;
                    await Task.CompletedTask;
                }
            }
        }
    }
}
