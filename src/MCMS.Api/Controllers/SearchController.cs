using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly IRoutingSearchService _routingSearchService;
    private readonly ILogger<SearchController> _logger;

    public SearchController(IRoutingSearchService routingSearchService, ILogger<SearchController> logger)
    {
        _routingSearchService = routingSearchService;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(RoutingSearchResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RoutingSearchResponseDto>> SearchAsync([FromBody] RoutingSearchRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var response = await _routingSearchService.SearchAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid search request");
            return BadRequest(new { message = ex.Message });
        }
    }
}
