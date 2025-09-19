using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using Microsoft.AspNetCore.Mvc;

namespace MCMS.Api.Controllers;

[ApiController]
[Route("api/items")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemDto>>> SearchAsync([FromQuery] string? term, CancellationToken cancellationToken)
    {
        var items = await _itemService.SearchItemsAsync(term, cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ItemDto>> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        var item = await _itemService.GetItemAsync(id, cancellationToken);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<ItemDto>> CreateAsync([FromBody] CreateItemRequest request, CancellationToken cancellationToken)
    {
        var result = await _itemService.CreateItemAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetAsync), new { id = result.Id }, result);
    }

    [HttpPost("{itemId:guid}/revisions")]
    public async Task<ActionResult<ItemDto>> CreateRevisionAsync(Guid itemId, [FromBody] CreateItemRevisionRequest request, CancellationToken cancellationToken)
    {
        request = request with { ItemId = itemId };
        var result = await _itemService.CreateRevisionAsync(request, cancellationToken);
        return Ok(result);
    }
}
