using System.Diagnostics;
using System.Text.Json;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/erp/workorders")]
public class ErpController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;
    private readonly IErpWorkOrderService _erpWorkOrderService;

    public ErpController(
        IErpWorkOrderService erpWorkOrderService,
        IAuditLogService auditLogService)
    {
        _erpWorkOrderService = erpWorkOrderService;
        _auditLogService = auditLogService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ErpWorkOrderDto>>> GetWorkOrdersAsync(CancellationToken cancellationToken)
    {
        var workOrders = await _erpWorkOrderService.GetPendingWorkOrdersAsync(cancellationToken).ConfigureAwait(false);

        var metadata = JsonSerializer.Serialize(new
        {
            Path = HttpContext.Request.Path.Value,
            Count = workOrders.Count,
            HttpContext.TraceIdentifier
        });

        var auditEntry = new AuditLogEntryDto(
            Id: Guid.NewGuid(),
            Category: "ERP",
            Action: "FetchWorkOrders",
            Severity: AuditSeverity.Info,
            Summary: $"Fetched {workOrders.Count} ERP work orders for CAM selection.",
            Details: null,
            RoutingId: null,
            HistoryEntryId: null,
            EventAt: DateTimeOffset.UtcNow,
            CreatedBy: ResolveActor(),
            MetadataJson: metadata,
            TraceId: Activity.Current?.Id,
            RequestId: HttpContext.TraceIdentifier);

        await _auditLogService.RecordAsync(auditEntry, cancellationToken).ConfigureAwait(false);

        return Ok(workOrders);
    }

    private string ResolveActor()
    {
        var userName = User?.Identity?.Name;
        return string.IsNullOrWhiteSpace(userName) ? "system" : userName;
    }
}
