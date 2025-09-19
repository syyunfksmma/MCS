using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;

using System.Linq;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/addin/jobs")]
public class AddinJobsController : ControllerBase
{
    private readonly IAddinJobService _addinJobService;
    private readonly IAddinKeyService _addinKeyService;

    public AddinJobsController(IAddinJobService addinJobService, IAddinKeyService addinKeyService)
    {
        _addinJobService = addinJobService;
        _addinKeyService = addinKeyService;
    }

    [HttpPost]
    public async Task<ActionResult<AddinJobDto>> EnqueueAsync([FromBody] AddinJobCreateRequest request, CancellationToken cancellationToken)
    {
        var job = await _addinJobService.EnqueueAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetAsync), new { jobId = job.JobId }, job);
    }

    [HttpGet("{jobId:guid}")]
    public async Task<ActionResult<AddinJobDto>> GetAsync(Guid jobId, CancellationToken cancellationToken)
    {
        var job = await _addinJobService.GetAsync(jobId, cancellationToken);
        return job is null ? NotFound() : Ok(job);
    }

    [HttpGet("next")]
    public async Task<ActionResult<AddinJobDto>> DequeueAsync(CancellationToken cancellationToken)
    {
        if (!await IsKeyValidAsync(cancellationToken))
        {
            return Unauthorized();
        }

        var job = await _addinJobService.DequeueAsync(cancellationToken);
        return job is null ? NoContent() : Ok(job);
    }

    [HttpPost("{jobId:guid}/complete")]
    public async Task<ActionResult<AddinJobDto>> CompleteAsync(Guid jobId, [FromBody] AddinJobCompleteRequest request, CancellationToken cancellationToken)
    {
        if (!await IsKeyValidAsync(cancellationToken))
        {
            return Unauthorized();
        }

        var job = await _addinJobService.CompleteAsync(jobId, request, cancellationToken);
        return Ok(job);
    }

    private async Task<bool> IsKeyValidAsync(CancellationToken cancellationToken)
    {
        if (!Request.Headers.TryGetValue("X-Addin-Key", out var values))
        {
            return false;
        }

        var candidate = values.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(candidate))
        {
            return false;
        }

        return await _addinKeyService.ValidateAsync(candidate, cancellationToken);
    }
}
