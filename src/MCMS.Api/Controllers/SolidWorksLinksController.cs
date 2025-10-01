using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/routings/{routingId:guid}/solidworks")]
public class SolidWorksLinksController : ControllerBase
{
    private readonly ISolidWorksLinkService _linkService;

    public SolidWorksLinksController(ISolidWorksLinkService linkService)
    {
        _linkService = linkService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(SolidWorksLinkDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SolidWorksLinkDto>> GetAsync(Guid routingId, CancellationToken cancellationToken)
    {
        var link = await _linkService.GetAsync(routingId, cancellationToken);
        if (link is null)
        {
            return NotFound();
        }

        return Ok(link);
    }

    [HttpPost("replace")]
    [ProducesResponseType(typeof(SolidWorksLinkDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SolidWorksLinkDto>> ReplaceAsync(Guid routingId, [FromBody] ReplaceSolidWorksRequest request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return BadRequest(new { message = "Request body is required." });
        }

        try
        {
            var result = await _linkService.ReplaceAsync(routingId, request, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}