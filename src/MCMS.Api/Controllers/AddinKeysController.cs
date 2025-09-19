using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/addin/keys")]
public class AddinKeysController : ControllerBase
{
    private readonly IAddinKeyService _addinKeyService;

    public AddinKeysController(IAddinKeyService addinKeyService)
    {
        _addinKeyService = addinKeyService;
    }

    [HttpGet("current")]
    public async Task<ActionResult<AddinKeyDto>> GetCurrentAsync(CancellationToken cancellationToken)
    {
        var key = await _addinKeyService.GetCurrentAsync(cancellationToken);
        return key is null ? NotFound() : Ok(key);
    }

    [HttpPost("renew")]
    public async Task<ActionResult<AddinKeyDto>> RenewAsync([FromBody] RenewAddinKeyRequest request, CancellationToken cancellationToken)
    {
        var key = await _addinKeyService.RenewAsync(request, cancellationToken);
        return Ok(key);
    }
}
