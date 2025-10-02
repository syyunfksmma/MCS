using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace MCMS.Tests.Services;

public class SolidWorksLinkServiceTests
{
    private sealed class StubSolidWorksIntegrationService : ISolidWorksIntegrationService
    {
        public readonly List<(Guid ItemRevisionId, string ModelPath, string? Configuration)> LinkCalls = [];

        public Task LinkModelAsync(Guid itemRevisionId, string modelPath, string? configuration, CancellationToken cancellationToken = default)
        {
            LinkCalls.Add((itemRevisionId, modelPath, configuration));
            return Task.CompletedTask;
        }

        public Task UnlinkModelAsync(Guid itemRevisionId, CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }
    }

    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    private static async Task<Guid> SeedRoutingAsync(McmsDbContext context)
    {
        var item = new Item
        {
            ItemCode = "ITEM-SW",
            Name = "SolidWorks Part",
            CreatedBy = "seed"
        };

        var revision = new ItemRevision
        {
            Item = item,
            RevisionCode = "REV-SW",
            CreatedBy = "seed"
        };

        var routing = new Routing
        {
            ItemRevision = revision,
            RoutingCode = "SW-ROUT",
            CreatedBy = "seed"
        };

        context.Items.Add(item);
        context.ItemRevisions.Add(revision);
        context.Routings.Add(routing);
        await context.SaveChangesAsync();
        return routing.Id;
    }

    private static (McmsDbContext Context, StubSolidWorksIntegrationService Integration, SolidWorksLinkService Service) CreateService()
    {
        var context = CreateContext();
        var integration = new StubSolidWorksIntegrationService();
        var history = new HistoryService(context);
        var service = new SolidWorksLinkService(context, integration, history, NullLogger<SolidWorksLinkService>.Instance);
        return (context, integration, service);
    }

    [Fact]
    public async Task ReplaceAsync_CreatesLinkAndRecordsHistory()
    {
        var (context, integration, service) = CreateService();
        try
        {
            var routingId = await SeedRoutingAsync(context);
            var routing = await context.Routings.Include(r => r.ItemRevision).SingleAsync();

            var result = await service.ReplaceAsync(
                routingId,
                new ReplaceSolidWorksRequest("C:/models/fixture.sldasm", "operator", "CONFIG-A", "initial replace")
            );

            Assert.Equal(routingId, result.RoutingId);
            Assert.Equal("C:/models/fixture.sldasm", result.ModelPath);
            Assert.True(result.IsLinked);
            Assert.Equal("operator", result.UpdatedBy);

            Assert.Single(integration.LinkCalls);
            Assert.Equal(routing.ItemRevisionId, integration.LinkCalls[0].ItemRevisionId);
            Assert.Equal("C:/models/fixture.sldasm", integration.LinkCalls[0].ModelPath);
            Assert.Equal("CONFIG-A", integration.LinkCalls[0].Configuration);

            var dbLink = await context.SolidWorksLinks.SingleAsync();
            Assert.Equal("C:/models/fixture.sldasm", dbLink.ModelPath);
            Assert.True(dbLink.IsLinked);
            Assert.Equal("operator", dbLink.UpdatedBy);

            var historyEntries = await context.HistoryEntries.Where(h => h.RoutingId == routingId).ToListAsync();
            Assert.Contains(historyEntries, h => h.ChangeType == "SolidWorksModelReplaced");
        }
        finally
        {
            await context.DisposeAsync();
        }
    }

    [Fact]
    public async Task ReplaceAsync_UpdatesExistingLink()
    {
        var (context, integration, service) = CreateService();
        try
        {
            var routingId = await SeedRoutingAsync(context);
            var routing = await context.Routings.Include(r => r.ItemRevision).SingleAsync();

            context.SolidWorksLinks.Add(new SolidWorksLink
            {
                ItemRevisionId = routing.ItemRevisionId,
                ModelPath = "C:/models/old.sldasm",
                Configuration = "OLD",
                IsLinked = true,
                LastSyncedAt = DateTimeOffset.UtcNow.AddDays(-1),
                CreatedBy = "seed"
            });
            await context.SaveChangesAsync();

            var result = await service.ReplaceAsync(
                routingId,
                new ReplaceSolidWorksRequest("C:/models/new.sldasm", "operator", "NEW", "update")
            );

            Assert.Equal("C:/models/new.sldasm", result.ModelPath);
            Assert.Equal("NEW", result.Configuration);

            var dbLink = await context.SolidWorksLinks.SingleAsync();
            Assert.Equal("C:/models/new.sldasm", dbLink.ModelPath);
            Assert.Equal("NEW", dbLink.Configuration);
            Assert.True(dbLink.IsLinked);
            Assert.Equal("operator", dbLink.UpdatedBy);

            Assert.Single(integration.LinkCalls);
        }
        finally
        {
            await context.DisposeAsync();
        }
    }

    [Fact]
    public async Task GetAsync_ReturnsLinkWhenPresent()
    {
        var (context, _, service) = CreateService();
        try
        {
            var routingId = await SeedRoutingAsync(context);
            var routing = await context.Routings.Include(r => r.ItemRevision).SingleAsync();

            context.SolidWorksLinks.Add(new SolidWorksLink
            {
                ItemRevisionId = routing.ItemRevisionId,
                ModelPath = "C:/models/current.sldasm",
                Configuration = "CONF",
                IsLinked = true,
                LastSyncedAt = DateTimeOffset.UtcNow,
                CreatedBy = "seed"
            });
            await context.SaveChangesAsync();

            var link = await service.GetAsync(routingId);
            Assert.NotNull(link);
            Assert.Equal("C:/models/current.sldasm", link!.ModelPath);
            Assert.Equal("CONF", link.Configuration);
        }
        finally
        {
            await context.DisposeAsync();
        }
    }

    [Fact]
    public async Task GetAsync_ReturnsNullWhenRoutingMissing()
    {
        var (context, _, service) = CreateService();
        try
        {
            var result = await service.GetAsync(Guid.NewGuid());
            Assert.Null(result);
        }
        finally
        {
            await context.DisposeAsync();
        }
    }
}
