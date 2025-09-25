using System;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/audit-logs")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogsController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet]
    public async Task<ActionResult<AuditLogSearchResponse>> SearchAsync([FromQuery] AuditLogQueryParameters parameters, CancellationToken cancellationToken)
    {
        var request = parameters.ToRequest();
        var response = await _auditLogService.SearchAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportAsync([FromQuery] AuditLogQueryParameters parameters, CancellationToken cancellationToken)
    {
        var request = parameters with { Page = 1, PageSize = 5000 };
        var csv = await _auditLogService.ExportCsvAsync(request.ToRequest(), cancellationToken);
        var fileName = $"audit-logs-{DateTime.UtcNow:yyyyMMddHHmmss}.csv";
        return File(csv, "text/csv", fileName);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<AuditLogStatisticsDto>> GetStatisticsAsync([FromQuery] AuditLogStatisticsParameters parameters, CancellationToken cancellationToken)
    {
        var request = parameters.ToRequest();
        var response = await _auditLogService.GetStatisticsAsync(request, cancellationToken);
        return Ok(response);
    }

    public record AuditLogQueryParameters(
        DateTimeOffset? From,
        DateTimeOffset? To,
        string? Category,
        string? Action,
        string? CreatedBy,
        Guid? RoutingId,
        int Page = 1,
        int PageSize = 50)
    {
        public AuditLogQueryRequest ToRequest() => new(
            From,
            To,
            Category,
            Action,
            CreatedBy,
            RoutingId,
            Page,
            PageSize);
    }

    public record AuditLogStatisticsParameters(
        DateTimeOffset? From,
        DateTimeOffset? To,
        string? Category,
        string? CreatedBy,
        Guid? RoutingId)
    {
        public AuditLogStatisticsRequest ToRequest()
        {
            var to = To ?? DateTimeOffset.UtcNow;
            var from = From ?? to.AddDays(-7);
            return new AuditLogStatisticsRequest(from, to, Category, CreatedBy, RoutingId);
        }
    }
}
