using System;
using System.Linq;`r`nusing System.Text;`r`nusing MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Enums;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MCMS.Tests.Services;

public class AuditLogServiceTests
{
    private static AuditLogService CreateService(out McmsDbContext context)
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        context = new McmsDbContext(options);
        return new AuditLogService(context);
    }

    [Fact]
    public async Task RecordAndSearchAsync_FiltersByCategory()
    {
        var service = CreateService(out var context);
        await using var disposable = context;

        await service.RecordAsync(new AuditLogEntryDto(
            Guid.NewGuid(),
            "Approval",
            "ApprovalRequested",
            AuditSeverity.Info,
            "Requested",
            null,
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTimeOffset.UtcNow,
            "tester",
            null,
            null,
            null));

        await service.RecordAsync(new AuditLogEntryDto(
            Guid.NewGuid(),
            "Security",
            "AdminLoginFailure",
            AuditSeverity.Warning,
            "Login failed",
            null,
            null,
            null,
            DateTimeOffset.UtcNow,
            "ops.bot",
            null,
            null,
            null));

        var result = await service.SearchAsync(new AuditLogQueryRequest(
            From: null,
            To: null,
            Category: "Security",
            Action: null,
            CreatedBy: null,
            RoutingId: null,
            Page: 1,
            PageSize: 10));

        Assert.Single(result.Items);
        Assert.Equal("Security", result.Items.First().Category);
    }

    [Fact]
    public async Task ExportCsvAsync_ReturnsCsvContent()
    {
        var service = CreateService(out var context);
        await using var disposable = context;

        await service.RecordAsync(new AuditLogEntryDto(
            Guid.NewGuid(),
            "Approval",
            "RoutingApproved",
            AuditSeverity.Info,
            "Approved",
            "QA supervisor approved",
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTimeOffset.UtcNow,
            "qa.lead",
            null,
            null,
            null));

        var csvBytes = await service.ExportCsvAsync(new AuditLogQueryRequest(null, null, null, null, null, null, 1, 25));
        var csv = Encoding.UTF8.GetString(csvBytes);

        Assert.Contains("Timestamp,Category,Action", csv);
        Assert.Contains("RoutingApproved", csv);
    }

    [Fact]
    public async Task GetStatisticsAsync_ComputesAlerts()
    {
        var service = CreateService(out var context);
        await using var disposable = context;

        var routingId = Guid.NewGuid();
        var requestedAt = DateTimeOffset.UtcNow.AddHours(-6);
        var approvedAt = DateTimeOffset.UtcNow.AddHours(-2);

        await service.RecordAsync(new AuditLogEntryDto(
            Guid.NewGuid(),
            "Approval",
            "ApprovalRequested",
            AuditSeverity.Info,
            "Routing requested",
            null,
            routingId,
            Guid.NewGuid(),
            requestedAt,
            "qa.lead",
            null,
            null,
            null));

        await service.RecordAsync(new AuditLogEntryDto(
            Guid.NewGuid(),
            "Approval",
            "RoutingRejected",
            AuditSeverity.Warning,
            "Routing rejected",
            "Fixture clash",
            routingId,
            Guid.NewGuid(),
            approvedAt,
            "qa.lead",
            null,
            null,
            null));

        await service.RecordAsync(new AuditLogEntryDto(
            Guid.NewGuid(),
            "Security",
            "AdminLoginFailure",
            AuditSeverity.Critical,
            "Login failure",
            "MFA timeout",
            null,
            null,
            DateTimeOffset.UtcNow.AddHours(-1),
            "ops.bot",
            null,
            null,
            null));

        var now = DateTimeOffset.UtcNow;
        var report = await service.GetStatisticsAsync(new AuditLogStatisticsRequest(now.AddHours(-24), now));

        Assert.Equal(3, report.TotalEvents);
        Assert.Equal(2, report.ApprovalEvents);
        Assert.Equal(1, report.RejectionEvents);
        Assert.True(report.Alerts.Count >= 1);
    }
}

