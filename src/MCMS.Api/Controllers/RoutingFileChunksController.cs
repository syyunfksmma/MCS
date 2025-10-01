using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/routings/{routingId:guid}/files/chunks")]
public class RoutingFileChunksController : ControllerBase
{
    private const string ChunkIndexHeader = "X-Chunk-Index";
    private readonly IRoutingChunkUploadService _chunkUploadService;
    private readonly ILogger<RoutingFileChunksController> _logger;

    public RoutingFileChunksController(
        IRoutingChunkUploadService chunkUploadService,
        ILogger<RoutingFileChunksController> logger)
    {
        _chunkUploadService = chunkUploadService;
        _logger = logger;
    }

    [HttpPost("start")]
    [ProducesResponseType(typeof(ChunkUploadSessionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ChunkUploadSessionDto>> StartAsync(
        Guid routingId,
        [FromBody] StartChunkUploadRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var session = await _chunkUploadService.StartSessionAsync(routingId, request, cancellationToken);
            return Ok(session);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid start upload request");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{sessionId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UploadChunkAsync(
        Guid routingId,
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        if (!TryReadChunkIndex(out var chunkIndex, out var problem))
        {
            return BadRequest(problem);
        }

        try
        {
            await _chunkUploadService.AcceptChunkAsync(routingId, sessionId, chunkIndex, Request.Body, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentOutOfRangeException ex)
        {
            _logger.LogWarning(ex, "Chunk index out of range");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Unable to accept chunk for session {SessionId}", sessionId);
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("{sessionId:guid}")]
    [ProducesResponseType(typeof(ChunkUploadStatusDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ChunkUploadStatusDto>> GetStatusAsync(
        Guid routingId,
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        try
        {
            var status = await _chunkUploadService.GetStatusAsync(routingId, sessionId, cancellationToken);
            return Ok(status);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{sessionId:guid}/complete")]
    [ProducesResponseType(typeof(RoutingMetaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RoutingMetaDto>> CompleteAsync(
        Guid routingId,
        Guid sessionId,
        [FromBody] CompleteChunkUploadRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var meta = await _chunkUploadService.CompleteSessionAsync(routingId, sessionId, request, cancellationToken);
            return Ok(meta);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Unable to complete session {SessionId}", sessionId);
            return Conflict(new { message = ex.Message });
        }
        catch (MissingChunksException ex)
        {
            _logger.LogWarning("Session {SessionId} missing chunks: {Missing}", sessionId, string.Join(",", ex.MissingChunks));
            return Conflict(new { message = ex.Message, missingParts = ex.MissingChunks });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid completion request");
            return BadRequest(new { message = ex.Message });
        }
    }

    private bool TryReadChunkIndex(out int chunkIndex, out object problem)
    {
        chunkIndex = default;
        problem = new { message = $"{ChunkIndexHeader} header is required." };

        if (!Request.Headers.TryGetValue(ChunkIndexHeader, out StringValues values))
        {
            return false;
        }

        var rawValue = values.ToString();
        if (!int.TryParse(rawValue, out chunkIndex))
        {
            problem = new { message = $"{ChunkIndexHeader} header must be an integer." };
            return false;
        }

        return true;
    }
}
