using FluentValidation;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Domain.Enums;
using MCMS.Core.Validation;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class ItemService : IItemService
{
    private readonly McmsDbContext _dbContext;
    private readonly CreateItemRequestValidator _createValidator = new();
    private readonly CreateItemRevisionRequestValidator _revisionValidator = new();

    public ItemService(McmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ItemDto> CreateItemAsync(CreateItemRequest request, CancellationToken cancellationToken = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, cancellationToken);

        var entity = new Item
        {
            ItemCode = request.ItemCode,
            Name = request.Name,
            Description = request.Description,
            CreatedBy = request.CreatedBy
        };

        _dbContext.Items.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetItemAsync(entity.Id, cancellationToken)
            ?? throw new InvalidOperationException("??? ??? ???? ?????.");
    }

    public async Task<ItemDto?> GetItemAsync(Guid itemId, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Items
            .AsNoTracking()
            .Include(x => x.Revisions)
                .ThenInclude(r => r.Routings)
            .FirstOrDefaultAsync(x => x.Id == itemId, cancellationToken);

        return entity is null ? null : Map(entity);
    }

    public async Task<IEnumerable<ItemDto>> SearchItemsAsync(string? term, CancellationToken cancellationToken = default)
    {
        term ??= string.Empty;
        term = term.Trim();

        var query = _dbContext.Items
            .AsNoTracking()
            .Include(x => x.Revisions)
                .ThenInclude(r => r.Routings)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(term))
        {
            query = query.Where(x => EF.Functions.Like(x.ItemCode, $"%{term}%") || EF.Functions.Like(x.Name, $"%{term}%"));
        }

        var items = await query.OrderBy(x => x.ItemCode).ToListAsync(cancellationToken);
        return items.Select(Map).ToList();
    }

    public async Task<ItemDto> CreateRevisionAsync(CreateItemRevisionRequest request, CancellationToken cancellationToken = default)
    {
        await _revisionValidator.ValidateAndThrowAsync(request, cancellationToken);

        var item = await _dbContext.Items.FirstOrDefaultAsync(x => x.Id == request.ItemId, cancellationToken)
            ?? throw new KeyNotFoundException("??? ?? ? ????.");

        var revision = new ItemRevision
        {
            ItemId = item.Id,
            RevisionCode = request.RevisionCode,
            Status = RevisionStatus.Draft,
            ValidFrom = request.ValidFrom,
            CreatedBy = request.RequestedBy
        };

        _dbContext.ItemRevisions.Add(revision);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetItemAsync(item.Id, cancellationToken)
            ?? throw new InvalidOperationException("Revision ?? ? ??? ???? ?????.");
    }

    private static ItemDto Map(Item entity)
    {
        var revisions = entity.Revisions
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ItemRevisionDto(
                r.Id,
                r.RevisionCode,
                r.Status,
                r.ValidFrom,
                r.ValidTo,
                r.SolidWorksConfiguration,
                r.Routings
                    .OrderByDescending(rt => rt.UpdatedAt ?? rt.CreatedAt)
                    .Select(rt => new RoutingSummaryDto(
                        rt.Id,
                        rt.RoutingCode,
                        rt.Status,
                        rt.CamRevision ?? "1.0.0",
                        rt.IsPrimary,
                        rt.ApprovalStatus,
                        rt.ApprovalRequestedAt,
                        rt.ApprovalRequestedBy,
                        rt.Steps.Count,
                        rt.Files.Count,
                        rt.UpdatedAt ?? rt.CreatedAt,
                        rt.UpdatedBy))
                    .ToList()))
            .ToList();

        return new ItemDto(
            entity.Id,
            entity.ItemCode,
            entity.Name,
            entity.Description,
            entity.CreatedAt,
            entity.CreatedBy,
            revisions);
    }
}
