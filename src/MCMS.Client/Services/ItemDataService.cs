using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using MCMS.Core.Contracts.Dtos;

namespace MCMS.Client.Services;

public class ItemDataService : IItemDataService
{
    private readonly IMcmsApiClient _apiClient;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web);

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
}
