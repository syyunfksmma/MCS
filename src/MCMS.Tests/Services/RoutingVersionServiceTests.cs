using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MCMS.Tests.Services;

public class RoutingVersionServiceTests
{
    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    private static (McmsDbContext Context, HistoryService History, RoutingVersionService Service) CreateService()
    {
        var context = CreateContext();
        var history = new HistoryService(context);
        var service = new RoutingVersionService(context, history);
        return (context, history, service);
    }

    private static async Task<(Guid BaseRoutingId, Guid SecondaryRoutingId)> SeedRoutingsAsync(McmsDbContext context)
    {
        var now = DateTimeOffset.UtcNow;
        var item = new Item
        {
            ItemCode = "ITEM-VERSION",
            Name = "Versioned Component",
            CreatedBy = "seed"
        };

        var revision = new ItemRevision
        {
            Item = item,
            RevisionCode = "REV-A",
            CreatedBy = "seed"
        };

        var routingAHistoryId = Guid.NewGuid();
        var routingBHistoryId = Guid.NewGuid();

        var routingA = new Routing
        {
            ItemRevision = revision,
            RoutingCode = "R-A",
            Status = RoutingStatus.Approved,
            CamRevision = "1.0",
            IsPrimary = true,
            CreatedAt = now.AddHours(-2),
            UpdatedAt = now.AddHours(-1),
            CreatedBy = "seed",
            UpdatedBy = "seed"
        };

        routingA.Steps.Add(new RoutingStep
        {
            Sequence = 1,
            Machine = "Mill-01",
            ProcessDescription = "Drilling",
            CreatedBy = "seed"
        });

        routingA.Files.Add(new RoutingFile
        {
            FileName = "programA.nc",
            RelativePath = "routings/r-a/programA.nc",
            FileType = ManagedFileType.Nc,
            FileSizeBytes = 1024,
            Checksum = "aaa",
            IsPrimary = true,
            CreatedBy = "seed"
        });

        routingA.HistoryEntries.Add(new HistoryEntry
        {
            Id = routingAHistoryId,
            Routing = routingA,
            ChangeType = "RoutingCreated",
            Field = nameof(Routing.Status),
            PreviousValue = null,
            CurrentValue = RoutingStatus.Approved.ToString(),
            Outcome = ApprovalOutcome.Approved,
            CreatedAt = now.AddHours(-2),
            CreatedBy = "seed"
        });

        var routingB = new Routing
        {
            ItemRevision = revision,
            RoutingCode = "R-B",
            Status = RoutingStatus.PendingApproval,
            CamRevision = "1.1",
            IsPrimary = false,
            CreatedAt = now.AddHours(-3),
            UpdatedAt = now,
            CreatedBy = "seed",
            UpdatedBy = "seed"
        };

        routingB.Steps.Add(new RoutingStep
        {
            Sequence = 1,
            Machine = "Lathe-02",
            ProcessDescription = "Turning",
            CreatedBy = "seed"
        });

        routingB.Steps.Add(new RoutingStep
        {
            Sequence = 2,
            Machine = "Lathe-02",
            ProcessDescription = "Deburr",
            CreatedBy = "seed"
        });

        routingB.Files.Add(new RoutingFile
        {
            FileName = "programB.nc",
            RelativePath = "routings/r-b/programB.nc",
            FileType = ManagedFileType.Nc,
            FileSizeBytes = 2048,
            Checksum = "bbb",
            IsPrimary = true,
            CreatedBy = "seed"
        });

        routingB.HistoryEntries.Add(new HistoryEntry
        {
            Id = routingBHistoryId,
            Routing = routingB,
            ChangeType = "RoutingRevisionCreated",
            Field = nameof(Routing.CamRevision),
            PreviousValue = "1.0",
            CurrentValue = "1.1",
            Outcome = ApprovalOutcome.Pending,
            CreatedAt = now.AddMinutes(-30),
            CreatedBy = "seed"
        });

        context.Items.Add(item);
        context.ItemRevisions.Add(revision);
        context.Routings.AddRange(routingA, routingB);
        await context.SaveChangesAsync();
        return (routingA.Id, routingB.Id);
    }

    [Fact]
    public async Task GetVersionsAsync_ReturnsSiblingsWithCountsAndHistory()
    {
        var (context, _, service) = CreateService();
        try
        {
            var (baseId, _) = await SeedRoutingsAsync(context);

            var versions = await service.GetVersionsAsync(baseId);

            Assert.Equal(2, versions.Count);
            var ordered = versions.OrderBy(v => v.CamRevision).ToArray();
            Assert.Equal(1, ordered[0].StepCount);
            Assert.Equal(1, ordered[0].FileCount);
            Assert.Single(ordered[0].History);

            Assert.Equal(2, ordered[1].StepCount);
            Assert.Equal(1, ordered[1].FileCount);
            Assert.Single(ordered[1].History);
            Assert.True(ordered.Any(v => v.IsPrimary));
        }
        finally
        {
            await context.DisposeAsync();
        }
    }

    [Fact]
    public async Task SetPrimaryVersionAsync_PromotesTargetAndWritesHistory()
    {
        var (context, _, service) = CreateService();
        try
        {
            var (baseId, secondaryId) = await SeedRoutingsAsync(context);

            var result = await service.SetPrimaryVersionAsync(
                baseId,
                secondaryId,
                new SetRoutingVersionRequest(true, "approver", "promote secondary")
            );

            Assert.True(result.IsPrimary);
            Assert.Equal(secondaryId, result.RoutingId);

            var routings = await context.Routings.ToListAsync();
            var promoted = routings.Single(r => r.Id == secondaryId);
            var demoted = routings.Single(r => r.Id == baseId);
            Assert.True(promoted.IsPrimary);
            Assert.False(demoted.IsPrimary);

            var historyEntries = await context.HistoryEntries
                .Where(h => h.RoutingId == secondaryId)
                .ToListAsync();
            Assert.Contains(historyEntries, h => h.ChangeType == "RoutingVersionPromoted");
        }
        finally
        {
            await context.DisposeAsync();
        }
    }

    [Fact]
    public async Task SetPrimaryVersionAsync_TogglesLegacyHiddenAndRecordsHistory()
    {
        var (context, _, service) = CreateService();
        try
        {
            var (baseId, _) = await SeedRoutingsAsync(context);

            var updated = await service.SetPrimaryVersionAsync(
                baseId,
                baseId,
                new SetRoutingVersionRequest(false, "auditor", "hide legacy", true)
            );

            Assert.True(updated.IsLegacyHidden);
            Assert.Equal("auditor", updated.LegacyHiddenBy);

            var routing = await context.Routings.SingleAsync(r => r.Id == baseId);
            Assert.True(routing.IsLegacyHidden);
            Assert.Equal("auditor", routing.LegacyHiddenBy);

            var historyEntries = await context.HistoryEntries
                .Where(h => h.RoutingId == baseId && h.ChangeType == "RoutingVersionLegacyVisibilityChanged")
                .ToListAsync();
            Assert.Single(historyEntries);
            Assert.Equal("False", historyEntries[0].PreviousValue);
            Assert.Equal("True", historyEntries[0].CurrentValue);
        }
        finally
        {
            await context.DisposeAsync();
        }
    }
}

