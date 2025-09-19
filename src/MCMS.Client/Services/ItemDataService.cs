using System;
using System.Collections.Concurrent;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using MCMS.Core.Contracts.Dtos;

namespace MCMS.Client.Services;

public class ItemDataService : IItemDataService
{
    private readonly IMcmsApiClient _apiClient;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web);
    private readonly ConcurrentDictionary<Guid, CacheEntry> _historyCache = new();
    private readonly TimeSpan _historyTtl = TimeSpan.FromSeconds(30);

    public ItemDataService(IMcmsApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public async Task<IReadOnlyList<ItemDto>> GetItemsAsync(CancellationToken cancellationToken = default)
    {
        var response = await _apiClient.GetAsync("api/items", cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var detail = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new HttpRequestException($"Items API 호출 실패: {(int)response.StatusCode} {response.ReasonPhrase}. {detail}");
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var items = await JsonSerializer.DeserializeAsync<List<ItemDto>>(stream, _serializerOptions, cancellationToken);
        return items ?? new List<ItemDto>();
    }

    public async Task<IReadOnlyList<HistoryEntryDto>> GetRoutingHistoryAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        if (_historyCache.TryGetValue(routingId, out var cached))
        {
            var age = DateTimeOffset.UtcNow - cached.FetchedAt;
            if (age <= _historyTtl)
            {
                return cached.Items;
            }
        }

        var response = await _apiClient.GetAsync($"api/history/routing/{routingId}", cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var detail = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new HttpRequestException($"History API 호출 실패: {(int)response.StatusCode} {response.ReasonPhrase}. {detail}");
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var history = await JsonSerializer.DeserializeAsync<List<HistoryEntryDto>>(stream, _serializerOptions, cancellationToken)
            ?? new List<HistoryEntryDto>();

        var snapshot = history.AsReadOnly();
        _historyCache[routingId] = new CacheEntry(snapshot, DateTimeOffset.UtcNow);
        return snapshot;
    }

    private sealed record CacheEntry(IReadOnlyList<HistoryEntryDto> Items, DateTimeOffset FetchedAt);
}
