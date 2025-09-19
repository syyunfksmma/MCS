using FluentValidation;
using MCMS.Core.Contracts.Requests;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MCMS.Tests.Services;

public class ItemServiceTests
{
    private static McmsDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<McmsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new McmsDbContext(options);
    }

    [Fact]
    public async Task CreateItemAsync_WithValidRequest_PersistsItem()
    {
        await using var context = CreateContext();
        var sut = new ItemService(context);
        var request = new CreateItemRequest("ITEM-001", "테스트 품목", null, "tester");

        var result = await sut.CreateItemAsync(request);

        var stored = await context.Items.Include(i => i.Revisions).FirstOrDefaultAsync();
        Assert.NotNull(stored);
        Assert.Equal("ITEM-001", result.ItemCode);
        Assert.Equal("테스트 품목", result.Name);
        Assert.Empty(result.Revisions);
    }

    [Fact]
    public async Task CreateItemAsync_WithMissingCode_ThrowsValidation()
    {
        await using var context = CreateContext();
        var sut = new ItemService(context);
        var request = new CreateItemRequest(string.Empty, "테스트", null, "tester");

        await Assert.ThrowsAsync<ValidationException>(() => sut.CreateItemAsync(request));
    }

    [Fact]
    public async Task CreateRevisionAsync_AddsRevisionToItem()
    {
        await using var context = CreateContext();
        var sut = new ItemService(context);
        var item = await sut.CreateItemAsync(new CreateItemRequest("ITEM-100", "테스트 품목", null, "tester"));

        var updated = await sut.CreateRevisionAsync(new CreateItemRevisionRequest(item.Id, "Rev01", DateTimeOffset.UtcNow, "tester"));

        Assert.Single(updated.Revisions);
        var revision = updated.Revisions.First();
        Assert.Equal("Rev01", revision.RevisionCode);
        Assert.Equal("Draft", revision.Status.ToString());
    }
}