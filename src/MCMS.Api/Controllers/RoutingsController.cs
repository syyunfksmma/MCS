using System;
using System.Collections.Generic;
using System.Threading;
using MCMS.Api.Notifications;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/routings")]
public class RoutingsController : ControllerBase
{
    private readonly IRoutingService _routingService;
    private readonly IRoutingApprovalService _routingApprovalService;
    private readonly IRoutingEventPublisher _routingEvents;

    public RoutingsController(
        IRoutingService routingService,
        IRoutingApprovalService routingApprovalService,
        IRoutingEventPublisher routingEvents)
    {
        _routingService = routingService;
        _routingApprovalService = routingApprovalService;
        _routingEvents = routingEvents;
    }

    [HttpGet("by-revision/{revisionId:guid}")]
    public async Task<ActionResult<IEnumerable<RoutingSummaryDto>>> GetByRevisionAsync(Guid revisionId, CancellationToken cancellationToken)
    {
        var routings = await _routingService.GetRoutingsForRevisionAsync(revisionId, cancellationToken);
        return Ok(routings);
    }

    [HttpGet("{routingId:guid}")]
    public async Task<ActionResult<RoutingDto>> GetAsync(Guid routingId, CancellationToken cancellationToken)
    {
        var routing = await _routingService.GetRoutingAsync(routingId, cancellationToken);
        return routing is null ? NotFound() : Ok(routing);
    }

    [HttpPost]
    public async Task<ActionResult<RoutingDto>> CreateAsync([FromBody] CreateRoutingRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var routing = await _routingService.CreateRoutingAsync(request, cancellationToken);
            await _routingEvents.PublishRoutingUpdatedAsync(routing, cancellationToken);
            return CreatedAtAction(nameof(GetAsync), new { routingId = routing.Id }, routing);
        }
        catch (RoutingConflictException ex)
        {
            await _routingEvents.PublishRoutingUpdatedAsync(ex.ExistingRouting, cancellationToken);
            var payload = new
            {
                message = ex.Message,
                routing = ex.ExistingRouting,
                idempotent = ex.FromIdempotencyKey
            };
            return Conflict(payload);
        }
    }

    [HttpPut("{routingId:guid}")]
    public async Task<ActionResult<RoutingDto>> UpdateAsync(Guid routingId, [FromBody] UpdateRoutingRequest request, CancellationToken cancellationToken)
    {
        request = request with { RoutingId = routingId };
        var routing = await _routingService.UpdateRoutingAsync(request, cancellationToken);
        await _routingEvents.PublishRoutingUpdatedAsync(routing, cancellationToken);
        return Ok(routing);
    }

    [HttpPost("{routingId:guid}/review")]
    public async Task<ActionResult<RoutingDto>> ReviewAsync(Guid routingId, [FromBody] ReviewRoutingRequest request, CancellationToken cancellationToken)
    {
        request = request with { RoutingId = routingId };
        var routing = await _routingService.ReviewRoutingAsync(request, cancellationToken);
        await _routingEvents.PublishRoutingUpdatedAsync(routing, cancellationToken);
        return Ok(routing);
    }

    [HttpPost("{routingId:guid}/request-approval")]
    public async Task<ActionResult<RoutingDto>> RequestApprovalAsync(Guid routingId, [FromBody] RequestRoutingApprovalRequest request, CancellationToken cancellationToken)
    {
        request = request with { RoutingId = routingId };
        try
        {
            var routing = await _routingApprovalService.RequestApprovalAsync(request, cancellationToken);
            await _routingEvents.PublishRoutingUpdatedAsync(routing, cancellationToken);
            return Ok(routing);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("{routingId:guid}/approve")]
    public async Task<ActionResult<RoutingDto>> ApproveAsync(Guid routingId, [FromBody] ApproveRoutingRequest request, CancellationToken cancellationToken)
    {
        request = request with { RoutingId = routingId };
        try
        {
            var routing = await _routingApprovalService.ApproveAsync(request, cancellationToken);
            await _routingEvents.PublishRoutingUpdatedAsync(routing, cancellationToken);
            return Ok(routing);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("{routingId:guid}/reject")]
    public async Task<ActionResult<RoutingDto>> RejectAsync(Guid routingId, [FromBody] RejectRoutingRequest request, CancellationToken cancellationToken)
    {
        request = request with { RoutingId = routingId };
        try
        {
            var routing = await _routingApprovalService.RejectAsync(request, cancellationToken);
            await _routingEvents.PublishRoutingUpdatedAsync(routing, cancellationToken);
            return Ok(routing);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("{routingId:guid}/approval-history")]
    public async Task<ActionResult<IEnumerable<HistoryEntryDto>>> GetApprovalHistoryAsync(Guid routingId, CancellationToken cancellationToken)
    {
        var routing = await _routingService.GetRoutingAsync(routingId, cancellationToken);
        if (routing is null)
        {
            return NotFound();
        }

        var history = await _routingApprovalService.GetApprovalHistoryAsync(routingId, cancellationToken);
        return Ok(history);
    }
}
