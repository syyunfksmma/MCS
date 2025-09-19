using Microsoft.Extensions.Logging.Abstractions;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Integrations;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Queue;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MCMS.Tests.Services;

public class RoutingApprovalServiceTests
{
    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    private static async Task<(RoutingApprovalService Sut, Guid RoutingId)> CreateSutAsync(McmsDbContext context)
    {
        var historyService = new HistoryService(context);
        var commandQueue = new InMemoryCommandQueue();
        var routingService = new RoutingService(context, historyService, commandQueue, new EspritAutomationServiceStub(NullLogger<EspritAutomationServiceStub>.Instance));

        var item = new Item
        {
            ItemCode = "ITEM-001",
            Name = "테스트 품목",
            CreatedBy = "tester"
        };

        var revision = new ItemRevision
        {
            Item = item,
            RevisionCode = "REV-A",
            CreatedBy = "tester"
        };

        context.Items.Add(item);
        context.ItemRevisions.Add(revision);
        await context.SaveChangesAsync();

        var createRequest = new CreateRoutingRequest(
            revision.Id,
            "ROUT-001",
            true,
            new[] { new RoutingStepWriteModel(1, "MILL-01", "가공", null, null) },
            new[] { new RoutingFileWriteModel("setup.nc", "routings/setup.nc", 10, "abc123", "nc", true) },
            "tester");

        var routing = await routingService.CreateRoutingAsync(createRequest);

        var sut = new RoutingApprovalService(context, historyService, routingService, commandQueue);
        return (sut, routing.Id);
    }

    [Fact]
    public async Task RequestApprovalAsync_SetsPendingStatus()
    {
        await using var context = CreateContext();
        var (sut, routingId) = await CreateSutAsync(context);

        var result = await sut.RequestApprovalAsync(new RequestRoutingApprovalRequest(routingId, "approver", "검토 요청"));

        Assert.Equal(ApprovalStatus.Pending, result.ApprovalStatus);
        Assert.Equal(RoutingStatus.PendingApproval, result.Status);
        Assert.NotNull(result.ApprovalRequestedAt);
        Assert.Equal("approver", result.ApprovalRequestedBy);
    }

    [Fact]
    public async Task RequestApprovalAsync_ForUnknownRouting_ThrowsKeyNotFound()
    {
        await using var context = CreateContext();
        var historyService = new HistoryService(context);
        var commandQueue = new InMemoryCommandQueue();
        var routingService = new RoutingService(context, historyService, commandQueue, new EspritAutomationServiceStub(NullLogger<EspritAutomationServiceStub>.Instance));
        var sut = new RoutingApprovalService(context, historyService, routingService, commandQueue);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => sut.RequestApprovalAsync(new RequestRoutingApprovalRequest(Guid.NewGuid(), "approver", null)));
    }

    [Fact]
    public async Task RequestApprovalAsync_WhenAlreadyPending_ThrowsInvalidOperation()
    {
        await using var context = CreateContext();
        var (sut, routingId) = await CreateSutAsync(context);
        await sut.RequestApprovalAsync(new RequestRoutingApprovalRequest(routingId, "approver", null));

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => sut.RequestApprovalAsync(new RequestRoutingApprovalRequest(routingId, "approver", null)));
    }

    [Fact]
    public async Task ApproveAsync_UpdatesStatusAndOutcome()
    {
        await using var context = CreateContext();
        var (sut, routingId) = await CreateSutAsync(context);
        await sut.RequestApprovalAsync(new RequestRoutingApprovalRequest(routingId, "approver", null));
        var approvedAt = DateTimeOffset.UtcNow;

        var result = await sut.ApproveAsync(new ApproveRoutingRequest(routingId, "approver", "ok", approvedAt));

        Assert.Equal(ApprovalStatus.Approved, result.ApprovalStatus);
        Assert.Equal(RoutingStatus.Approved, result.Status);
    }

    [Fact]
    public async Task RejectAsync_UpdatesStatus()
    {
        await using var context = CreateContext();
        var (sut, routingId) = await CreateSutAsync(context);
        await sut.RequestApprovalAsync(new RequestRoutingApprovalRequest(routingId, "approver", null));
        var rejectedAt = DateTimeOffset.UtcNow;

        var result = await sut.RejectAsync(new RejectRoutingRequest(routingId, "approver", "보완 필요", rejectedAt));

        Assert.Equal(ApprovalStatus.Rejected, result.ApprovalStatus);
        Assert.Equal(RoutingStatus.Rejected, result.Status);
    }
}



