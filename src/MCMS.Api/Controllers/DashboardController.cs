using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(DashboardSummaryDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary(
        [FromQuery] DashboardRange range = DashboardRange.Daily,
        [FromQuery] bool includeBreakdown = false,
        CancellationToken cancellationToken = default)
    {
        var request = new DashboardSummaryRequest(range, includeBreakdown);
        var result = await _dashboardService.GetSummaryAsync(request, cancellationToken).ConfigureAwait(false);
        return Ok(result);
    }
}
