using MCMS.Core.Contracts.Dtos;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    [HttpGet("me/permissions")]
    [ProducesResponseType(typeof(UserPermissionsDto), StatusCodes.Status200OK)]
    public ActionResult<UserPermissionsDto> GetCurrentPermissions()
    {
        var principal = User ?? new ClaimsPrincipal();
        var identity = principal.Identity;
        var isAuthenticated = identity?.IsAuthenticated == true;

        bool HasPermission(string permission) => principal.HasClaim("permission", permission) || principal.HasClaim("permissions", permission);
        bool InRole(string role) => principal.IsInRole(role) || principal.HasClaim(ClaimTypes.Role, role);

        var canOpenExplorer = !isAuthenticated || HasPermission("explorer:open") || InRole("ExplorerUser") || InRole("ManufacturingAdmin");
        var canReplaceSolidWorks = HasPermission("solidworks:replace") || InRole("ManufacturingEngineer") || InRole("ManufacturingAdmin");
        var canManageVersions = HasPermission("routing:versions") || InRole("ManufacturingAdmin");

        var dto = new UserPermissionsDto(canOpenExplorer, canReplaceSolidWorks, canManageVersions);
        return Ok(dto);
    }
}