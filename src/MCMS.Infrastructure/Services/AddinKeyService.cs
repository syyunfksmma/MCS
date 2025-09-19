using System.Security.Cryptography;
using FluentValidation;
using System.Text;
using MCMS.Core.Abstractions;
using MCMS.Core.Contracts.Dtos;
using MCMS.Core.Contracts.Requests;
using MCMS.Core.Domain.Entities;
using MCMS.Core.Validation;
using MCMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Services;

public class AddinKeyService : IAddinKeyService
{
    private readonly McmsDbContext _dbContext;
    private readonly RenewAddinKeyRequestValidator _validator = new();

    public AddinKeyService(McmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AddinKeyDto?> GetCurrentAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = await _dbContext.AddinKeys
            .AsNoTracking()
            .Where(x => !x.IsRevoked && x.ExpiresAt > now)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        return entity is null ? null : Map(entity);
    }

    public async Task<AddinKeyDto> RenewAsync(RenewAddinKeyRequest request, CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var now = DateTimeOffset.UtcNow;
        var value = GenerateKey();
        var expiresAt = request.ValidDays.HasValue ? now.AddDays(request.ValidDays.Value) : now.AddDays(30);

        var activeKeys = await _dbContext.AddinKeys
            .Where(x => !x.IsRevoked && x.ExpiresAt > now)
            .ToListAsync(cancellationToken);

        foreach (var key in activeKeys)
        {
            key.IsRevoked = true;
            key.RevokedAt = now;
        }

        var entity = new AddinKey
        {
            Value = value,
            ExpiresAt = expiresAt,
            CreatedBy = request.RequestedBy ?? "system"
        };

        _dbContext.AddinKeys.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Map(entity);
    }

    public async Task<bool> ValidateAsync(string value, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var now = DateTimeOffset.UtcNow;
        return await _dbContext.AddinKeys
            .AsNoTracking()
            .AnyAsync(x => !x.IsRevoked && x.ExpiresAt > now && x.Value == value, cancellationToken);
    }

    private static AddinKeyDto Map(AddinKey entity) => new(entity.Id, entity.Value, entity.ExpiresAt);

    private static string GenerateKey()
    {
        Span<byte> buffer = stackalloc byte[32];
        RandomNumberGenerator.Fill(buffer);
        return Convert.ToBase64String(buffer);
    }
}
