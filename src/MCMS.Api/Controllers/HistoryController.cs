using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/history")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;

    public HistoryController(IHistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpGet("routing/{routingId:guid}")]
    public async Task<ActionResult<IEnumerable<HistoryEntryDto>>> GetRoutingHistoryAsync(Guid routingId, CancellationToken cancellationToken)
    {
        var entries = await _historyService.GetHistoryForRoutingAsync(routingId, cancellationToken);
        return Ok(entries);
    }
}
