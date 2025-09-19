using MCMS.Core.Contracts.Requests;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MCMS.Tests.Services;

public class AddinKeyServiceTests
{
    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    [Fact]
    public async Task RenewAsync_CreatesNewKey()
    {
        await using var context = CreateContext();
        var service = new AddinKeyService(context);

        var dto = await service.RenewAsync(new RenewAddinKeyRequest("tester", 7));

        Assert.NotEqual(Guid.Empty, dto.KeyId);
        Assert.False(string.IsNullOrWhiteSpace(dto.Value));
        Assert.True(dto.ExpiresAt > DateTimeOffset.UtcNow.AddDays(5));
    }

    [Fact]
    public async Task GetCurrentAsync_ReturnsLatestActiveKey()
    {
        await using var context = CreateContext();
        var service = new AddinKeyService(context);

        await service.RenewAsync(new RenewAddinKeyRequest("tester", 30));
        await service.RenewAsync(new RenewAddinKeyRequest("tester", 30));

        var current = await service.GetCurrentAsync();

        Assert.NotNull(current);
        Assert.True(await service.ValidateAsync(current!.Value));
    }

    [Fact]
    public async Task ValidateAsync_ReturnsFalseForExpired()
    {
        await using var context = CreateContext();
        var service = new AddinKeyService(context);

        var dto = await service.RenewAsync(new RenewAddinKeyRequest("tester", 1));
        var entity = await context.AddinKeys.FirstAsync();
        entity.ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(-5);
        await context.SaveChangesAsync();

        Assert.False(await service.ValidateAsync(dto.Value));
    }
}
