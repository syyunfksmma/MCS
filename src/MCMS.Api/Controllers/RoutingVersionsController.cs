using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/routings/{routingId:guid}/versions")]
public class RoutingVersionsController : ControllerBase
{
    private readonly IRoutingVersionService _routingVersionService;

    public RoutingVersionsController(IRoutingVersionService routingVersionService)
    {
        _routingVersionService = routingVersionService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<RoutingVersionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<RoutingVersionDto>>> GetAsync(Guid routingId, CancellationToken cancellationToken)
    {
        try
        {
            var versions = await _routingVersionService.GetVersionsAsync(routingId, cancellationToken);
            return Ok(versions);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPatch("{versionId:guid}")]
    [ProducesResponseType(typeof(RoutingVersionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RoutingVersionDto>> UpdateAsync(Guid routingId, Guid versionId, [FromBody] SetRoutingVersionRequest request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return BadRequest(new { message = "Request body is required." });
        }

        if (string.IsNullOrWhiteSpace(request.RequestedBy))
        {
            return BadRequest(new { message = "requestedBy is required." });
        }

        try
        {
            var version = await _routingVersionService.UpdateVersionAsync(routingId, versionId, request, cancellationToken);
            return Ok(version);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}


