using System.Diagnostics;
using System.Text.Json;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/cam/status")]
public class CamStatusController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;
    private readonly ICamWorkStatusService _camWorkStatusService;

    public CamStatusController(
        ICamWorkStatusService camWorkStatusService,
        IAuditLogService auditLogService)
    {
        _camWorkStatusService = camWorkStatusService;
        _auditLogService = auditLogService;
    }

    [HttpPatch]
    public async Task<ActionResult<CamWorkStatusDto>> UpdateStatusAsync(
        [FromBody] UpdateCamStatusRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var actor = ResolveActor();

        var status = await _camWorkStatusService
            .UpsertAsync(
                request.WoNo.Trim(),
                request.ProcSeq.Trim(),
                request.ItemCd?.Trim(),
                request.Is3DModeled,
                request.IsPgCompleted,
                actor,
                cancellationToken)
            .ConfigureAwait(false);

        var dto = new CamWorkStatusDto(
            WoNo: status.WoNo,
            ProcSeq: status.ProcSeq,
            ItemCd: status.ItemCd,
            Is3DModeled: status.Is3DModeled,
            IsPgCompleted: status.IsPgCompleted,
            Last3DModeledAt: status.Last3DModeledAt,
            LastPgCompletedAt: status.LastPgCompletedAt,
            CreatedAt: status.CreatedAt,
            CreatedBy: status.CreatedBy,
            UpdatedAt: status.UpdatedAt,
            UpdatedBy: status.UpdatedBy);

        var metadata = JsonSerializer.Serialize(new
        {
            request.WoNo,
            request.ProcSeq,
            request.Is3DModeled,
            request.IsPgCompleted
        });

        var auditEntry = new AuditLogEntryDto(
            Id: Guid.NewGuid(),
            Category: "CAM",
            Action: "UpdateCamWorkStatus",
            Severity: AuditSeverity.Info,
            Summary: $"Updated CAM status for {request.WoNo}/{request.ProcSeq}.",
            Details: null,
            RoutingId: null,
            HistoryEntryId: null,
            EventAt: DateTimeOffset.UtcNow,
            CreatedBy: actor,
            MetadataJson: metadata,
            TraceId: Activity.Current?.Id,
            RequestId: HttpContext.TraceIdentifier);

        await _auditLogService.RecordAsync(auditEntry, cancellationToken).ConfigureAwait(false);

        return Ok(dto);
    }

    private string ResolveActor()
    {
        var userName = User?.Identity?.Name;
        return string.IsNullOrWhiteSpace(userName) ? "system" : userName;
    }
}
