using System.Linq;
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
    public async Task<ActionResult<SolidWorksLinkDto>> ReplaceAsync(Guid routingId, CancellationToken cancellationToken)
    {
        if (Request.HasFormContentType)
        {
            var form = await Request.ReadFormAsync(cancellationToken);
            var file = form.Files.GetFile("file");
            if (file is null || file.Length == 0)
            {
                return BadRequest(new { message = "file is required." });
            }

            var requestedBy = form["requestedBy"].FirstOrDefault()
                ?? User?.Identity?.Name
                ?? "system";

            await using var uploadStream = file.OpenReadStream();
            var command = new SolidWorksReplaceCommand
            {
                FileStream = uploadStream,
                FileName = file.FileName,
                RequestedBy = requestedBy,
                Configuration = ValueOrNull(form["configuration"].FirstOrDefault()),
                Comment = ValueOrNull(form["comment"].FirstOrDefault())
            };

            return await ExecuteReplaceAsync(routingId, command, cancellationToken);
        }

        var dto = await Request.ReadFromJsonAsync<ReplaceSolidWorksRequest>(cancellationToken: cancellationToken);
        if (dto is null)
        {
            return BadRequest(new { message = "Request body is required." });
        }

        var jsonCommand = new SolidWorksReplaceCommand
        {
            ModelPath = dto.ModelPath,
            RequestedBy = dto.RequestedBy,
            Configuration = dto.Configuration,
            Comment = dto.Comment
        };

        return await ExecuteReplaceAsync(routingId, jsonCommand, cancellationToken);
    }

    private async Task<ActionResult<SolidWorksLinkDto>> ExecuteReplaceAsync(Guid routingId, SolidWorksReplaceCommand command, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _linkService.ReplaceAsync(routingId, command, cancellationToken);
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

    private static string? ValueOrNull(string? value) => string.IsNullOrWhiteSpace(value) ? null : value;
}

