using System.Net.Http;
using System.Net.Http.Json;

namespace MCMS.Client.Services;

public interface IMcmsApiClient
{
    Task<HttpResponseMessage> GetAsync(string path, CancellationToken cancellationToken = default);
    Task<HttpResponseMessage> PostAsync<T>(string path, T payload, CancellationToken cancellationToken = default);
    Task<HttpResponseMessage> PutAsync<T>(string path, T payload, CancellationToken cancellationToken = default);
}

public class McmsApiClient : IMcmsApiClient
{
    private readonly HttpClient _httpClient;

    public McmsApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<HttpResponseMessage> GetAsync(string path, CancellationToken cancellationToken = default)
        => _httpClient.GetAsync(path, cancellationToken);

    public Task<HttpResponseMessage> PostAsync<T>(string path, T payload, CancellationToken cancellationToken = default)
        => _httpClient.PostAsJsonAsync(path, payload, cancellationToken);

    public Task<HttpResponseMessage> PutAsync<T>(string path, T payload, CancellationToken cancellationToken = default)
        => _httpClient.PutAsJsonAsync(path, payload, cancellationToken);
}

public interface ICmdHostClient
{
    Task<HttpResponseMessage> PostAsync<T>(string path, T payload, CancellationToken cancellationToken = default);
}

public class CmdHostClient : ICmdHostClient
{
    private readonly HttpClient _httpClient;

    public CmdHostClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public Task<HttpResponseMessage> PostAsync<T>(string path, T payload, CancellationToken cancellationToken = default)
        => _httpClient.PostAsJsonAsync(path, payload, cancellationToken);
}
