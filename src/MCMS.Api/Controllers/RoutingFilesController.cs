using System.Collections.Generic;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/routings/{routingId:guid}/files")]
public class RoutingFilesController : ControllerBase
{
    private readonly IRoutingFileService _routingFileService;

    public RoutingFilesController(IRoutingFileService routingFileService)
    {
        _routingFileService = routingFileService;
    }

    [HttpGet]
    public async Task<ActionResult<RoutingMetaDto>> GetAsync(Guid routingId, CancellationToken cancellationToken)
    {
        try
        {
            var meta = await _routingFileService.GetAsync(routingId, cancellationToken);
            return Ok(meta);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 1_073_741_824)]
    [RequestSizeLimit(1_073_741_824)]
    public async Task<ActionResult<RoutingMetaDto>> UploadAsync(Guid routingId, [FromForm] UploadRoutingFileForm form, CancellationToken cancellationToken)
    {
        if (form.File is null || form.File.Length == 0)
        {
            return BadRequest(new { message = "???? ??? ?????." });
        }

        await using var stream = form.File.OpenReadStream();
        var request = new UploadRoutingFileRequest(
            routingId,
            stream,
            form.File.FileName,
            form.FileType,
            form.IsPrimary,
            form.UploadedBy);

        try
        {
            var meta = await _routingFileService.UploadAsync(request, cancellationToken);
            return Ok(meta);
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

    [HttpDelete("{fileId:guid}")]
    public async Task<ActionResult<RoutingMetaDto>> DeleteAsync(Guid routingId, Guid fileId, [FromQuery] string deletedBy, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(deletedBy))
        {
            return BadRequest(new { message = "?? ???(deletedBy)? ?????." });
        }

        try
        {
            var meta = await _routingFileService.DeleteAsync(routingId, fileId, deletedBy, cancellationToken);
            return Ok(meta);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("{fileId:guid}")]
    public async Task<IActionResult> DownloadAsync(Guid routingId, Guid fileId, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _routingFileService.OpenFileAsync(routingId, fileId, cancellationToken);
            if (!string.IsNullOrWhiteSpace(result.Checksum))
            {
                Response.Headers["X-Checksum-Sha256"] = result.Checksum;
            }

            return File(result.Stream, result.ContentType, result.FileName);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }


    public class UploadRoutingFileForm
    {
        public IFormFile? File { get; init; }
        public string FileType { get; init; } = string.Empty;
        public bool IsPrimary { get; init; }
        public string UploadedBy { get; init; } = string.Empty;
    }
}
