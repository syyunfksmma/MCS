using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/explorer")]
public class ExplorerController : ControllerBase
{
    private readonly IExplorerService _explorerService;

    public ExplorerController(IExplorerService explorerService)
    {
        _explorerService = explorerService;
    }

    [HttpGet]
    public async Task<ActionResult<ExplorerResponseDto>> GetAsync(CancellationToken cancellationToken)
    {
        var response = await _explorerService.GetExplorerAsync(cancellationToken);
        return Ok(response);
    }
}
