using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MCMS.Tests.Services;

public class DashboardServiceTests
{
    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    [Fact]
    public async Task GetSummaryAsync_WhenNoData_ReturnsZeros()
    {
        await using var context = CreateContext();
        var sut = new DashboardService(context);

        var result = await sut.GetSummaryAsync(new DashboardSummaryRequest());

        Assert.Equal(0, result.Totals.Unassigned);
        Assert.Equal(0, result.Totals.InProgress);
        Assert.Equal(0, result.Totals.Completed);
        Assert.Equal(1500, result.Sla.TargetMs);
        Assert.Equal(0, result.Sla.P95Ms);
        Assert.Null(result.Breakdown);
    }

    [Fact]
    public async Task GetSummaryAsync_WithData_ComputesTotalsAndBreakdown()
    {
        await using var context = CreateContext();

        var item = new Item
        {
            ItemCode = "PRD-001",
            Name = "테스트 품목",
            CreatedBy = "planner"
        };

        var revision = new ItemRevision
        {
            Item = item,
            RevisionCode = "REV-A",
            CreatedBy = "planner"
        };

        var routingDraft = new Routing
        {
            ItemRevision = revision,
            RoutingCode = "RO-100",
            Status = RoutingStatus.Draft,
            CreatedBy = "alice"
        };

        var routingPending = new Routing
        {
            ItemRevision = revision,
            RoutingCode = "RO-200",
            Status = RoutingStatus.PendingApproval,
            CreatedBy = "bob",
            UpdatedAt = DateTimeOffset.UtcNow,
            UpdatedBy = "bob"
        };

        var routingApproved = new Routing
        {
            ItemRevision = revision,
            RoutingCode = "RO-300",
            Status = RoutingStatus.Approved,
            CreatedBy = "alice",
            UpdatedAt = DateTimeOffset.UtcNow,
            UpdatedBy = "lead"
        };

        var step1 = new RoutingStep
        {
            Routing = routingPending,
            Sequence = 1,
            Machine = "MILL-01",
            CreatedBy = "bob"
        };

        var step2 = new RoutingStep
        {
            Routing = routingApproved,
            Sequence = 1,
            Machine = "MILL-01",
            CreatedBy = "alice"
        };

        var step3 = new RoutingStep
        {
            Routing = routingApproved,
            Sequence = 2,
            Machine = "LATHE-02",
            CreatedBy = "alice"
        };

        var job1 = new AddinJob
        {
            RoutingId = routingApproved.Id,
            StartedAt = DateTimeOffset.UtcNow.AddSeconds(-2),
            CompletedAt = DateTimeOffset.UtcNow,
            Status = AddinJobStatus.Completed
        };

        var job2 = new AddinJob
        {
            RoutingId = routingPending.Id,
            StartedAt = DateTimeOffset.UtcNow.AddSeconds(-3),
            CompletedAt = DateTimeOffset.UtcNow.AddSeconds(-1),
            Status = AddinJobStatus.Completed
        };

        context.Items.Add(item);
        context.ItemRevisions.Add(revision);
        context.Routings.AddRange(routingDraft, routingPending, routingApproved);
        context.RoutingSteps.AddRange(step1, step2, step3);
        context.AddinJobs.AddRange(job1, job2);
        await context.SaveChangesAsync();

        var sut = new DashboardService(context);

        var result = await sut.GetSummaryAsync(new DashboardSummaryRequest(DashboardRange.Daily, true));

        Assert.Equal(1, result.Totals.Unassigned);
        Assert.Equal(1, result.Totals.InProgress);
        Assert.Equal(1, result.Totals.Completed);
        Assert.NotNull(result.Breakdown);
        Assert.Contains(result.Breakdown!.ByOwner, x => x.Key == "alice" && x.Count == 2);
        Assert.Contains(result.Breakdown!.ByMachine, x => x.Key == "MILL-01" && x.Count == 2);
        Assert.Equal(DashboardRange.Daily, result.Period.Range);
        Assert.True(result.Sla.P95Ms >= 0);
    }
}





