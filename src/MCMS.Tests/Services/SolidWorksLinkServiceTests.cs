using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Infrastructure.FileStorage;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
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

        public Task UnlinkModelAsync(Guid itemRevisionId, CancellationToken cancellationToken = default) => Task.CompletedTask;
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

    private static (McmsDbContext Context, StubSolidWorksIntegrationService Integration, FileStorageService Storage, string RootPath, SolidWorksLinkService Service) CreateService()
    {
        var context = CreateContext();
        var integration = new StubSolidWorksIntegrationService();
        var history = new HistoryService(context);
        var root = Path.Combine(Path.GetTempPath(), $"mcms-tests-{Guid.NewGuid():N}");
        Directory.CreateDirectory(root);
        var storage = new FileStorageService(Options.Create(new FileStorageOptions
        {
            RootPath = root,
            EnableMetaCaching = false
        }), NullLogger<FileStorageService>.Instance);
        var service = new SolidWorksLinkService(context, integration, history, storage, NullLogger<SolidWorksLinkService>.Instance);
        return (context, integration, storage, root, service);
    }

    [Fact]
    public async Task ReplaceAsync_CreatesLinkAndRecordsHistory_FromPath()
    {
        var (context, integration, storage, root, service) = CreateService();
        try
        {
            var routingId = await SeedRoutingAsync(context);
            var routing = await context.Routings.Include(r => r.ItemRevision)!.ThenInclude(ir => ir!.Item).SingleAsync();

            var result = await service.ReplaceAsync(
                routingId,
                new SolidWorksReplaceCommand
                {
                    ModelPath = "C:/models/fixture.sldasm",
                    RequestedBy = "operator",
                    Configuration = "CONFIG-A",
                    Comment = "initial replace"
                }
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
        }
        finally
        {
            await storage.DisposeAsync();
            await context.DisposeAsync();
            Directory.Delete(root, recursive: true);
        }
    }

    [Fact]
    public async Task ReplaceAsync_UpdatesExistingLinkWithUploadAndBackups()
    {
        var (context, integration, storage, root, service) = CreateService();
        try
        {
            var routingId = await SeedRoutingAsync(context);
            var routing = await context.Routings.Include(r => r.ItemRevision)!.ThenInclude(ir => ir!.Item).SingleAsync();

            context.SolidWorksLinks.Add(new SolidWorksLink
            {
                ItemRevisionId = routing.ItemRevisionId,
                ModelPath = "3DM/ITEM-SW/ITEM-SW.3dm",
                Configuration = "OLD",
                IsLinked = true,
                LastSyncedAt = DateTimeOffset.UtcNow.AddDays(-1),
                CreatedBy = "seed"
            });
            await context.SaveChangesAsync();

            var originalPath = Path.Combine(root, "3DM", "ITEM-SW", "ITEM-SW.3dm");
            Directory.CreateDirectory(Path.GetDirectoryName(originalPath)!);
            await File.WriteAllTextAsync(originalPath, "old content");

            var payload = new MemoryStream(Encoding.UTF8.GetBytes("SolidWorksBinaryData"), writable: false);
            await service.ReplaceAsync(
                routingId,
                new SolidWorksReplaceCommand
                {
                    FileStream = payload,
                    FileName = "updated-model.3dm",
                    RequestedBy = "operator",
                    Configuration = "NEW",
                    Comment = "file upload"
                }
            );

            var dbLink = await context.SolidWorksLinks.SingleAsync();
            Assert.Equal("3DM/ITEM-SW/updated-model.3dm", dbLink.ModelPath);
            Assert.Equal("NEW", dbLink.Configuration);
            Assert.True(dbLink.IsLinked);
            Assert.Equal("operator", dbLink.UpdatedBy);

            Assert.Single(integration.LinkCalls);
            Assert.Equal("3DM/ITEM-SW/updated-model.3dm", integration.LinkCalls[0].ModelPath);

            var archiveDirectory = Directory.GetDirectories(Path.Combine(root, "3DM", "archive"))
                .SingleOrDefault();
            Assert.NotNull(archiveDirectory);
            var archivedFile = Directory.GetFiles(archiveDirectory!).Single();
            Assert.EndsWith("ITEM-SW.3dm", archivedFile.Replace('\\', '/'));
            Assert.Equal("old content", await File.ReadAllTextAsync(archivedFile));
        }
        finally
        {
            await storage.DisposeAsync();
            await context.DisposeAsync();
            Directory.Delete(root, recursive: true);
        }
    }

    [Fact]
    public async Task GetAsync_ReturnsLinkWhenPresent()
    {
        var (context, _, storage, root, service) = CreateService();
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
            await storage.DisposeAsync();
            await context.DisposeAsync();
            Directory.Delete(root, recursive: true);
        }
    }

    [Fact]
    public async Task GetAsync_ReturnsNullWhenRoutingMissing()
    {
        var (context, _, storage, root, service) = CreateService();
        try
        {
            var result = await service.GetAsync(Guid.NewGuid());
            Assert.Null(result);
        }
        finally
        {
            await storage.DisposeAsync();
            await context.DisposeAsync();
            Directory.Delete(root, recursive: true);
        }
    }
}

