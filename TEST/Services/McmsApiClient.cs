using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CAM_API.Common;
using CAM_API.Common.Dtos;
using Newtonsoft.Json;

namespace CAM_API.Services;

internal sealed class McmsApiClient : IDisposable
{
    private readonly JsonSerializerSettings _serializerSettings = new JsonSerializerSettings
    {
        NullValueHandling = NullValueHandling.Ignore
    };

    private readonly object _clientLock = new();
    private HttpClient? _client;
    private AddinSettings _settings;

    public McmsApiClient(AddinSettings settings)
    {
        _settings = settings;
    }

    public void UpdateSettings(AddinSettings settings)
    {
        _settings = settings;
        lock (_clientLock)
        {
            _client?.Dispose();
            _client = null;
        }
    }

    public async Task<AddinKeyDto?> GetCurrentKeyAsync()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "api/addin/keys/current");
        var response = await SendAsync(request).ConfigureAwait(false);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        response.EnsureSuccessStatusCode();
        return await DeserializeAsync<AddinKeyDto>(response).ConfigureAwait(false);
    }

    public async Task<AddinKeyDto?> RenewKeyAsync(RenewAddinKeyRequest request)
    {
        using var message = new HttpRequestMessage(HttpMethod.Post, "api/addin/keys/renew")
        {
            Content = CreateJsonContent(request)
        };
        var response = await SendAsync(message).ConfigureAwait(false);
        response.EnsureSuccessStatusCode();
        return await DeserializeAsync<AddinKeyDto>(response).ConfigureAwait(false);
    }

    public async Task<AddinJobDto?> GetNextJobAsync()
    {
        using var message = new HttpRequestMessage(HttpMethod.Get, "api/addin/jobs/next");
        AttachApiKey(message);
        var response = await SendAsync(message).ConfigureAwait(false);
        if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
        {
            return null;
        }
        if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
        {
            throw new InvalidOperationException("Add-in API key가 유효하지 않습니다.");
        }
        response.EnsureSuccessStatusCode();
        return await DeserializeAsync<AddinJobDto>(response).ConfigureAwait(false);
    }

    public async Task<AddinJobDto?> CompleteJobAsync(Guid jobId, AddinJobCompleteRequest request)
    {
        using var message = new HttpRequestMessage(HttpMethod.Post, $"api/addin/jobs/{jobId}/complete")
        {
            Content = CreateJsonContent(request)
        };
        AttachApiKey(message);
        var response = await SendAsync(message).ConfigureAwait(false);
        if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
        {
            throw new InvalidOperationException("Add-in API key가 유효하지 않습니다.");
        }
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
        response.EnsureSuccessStatusCode();
        return await DeserializeAsync<AddinJobDto>(response).ConfigureAwait(false);
    }

    private HttpClient GetOrCreateClient()
    {
        lock (_clientLock)
        {
            if (_client != null)
            {
                return _client;
            }

            if (string.IsNullOrWhiteSpace(_settings.BaseUrl))
            {
                throw new InvalidOperationException("MCMS API BaseUrl 설정이 필요합니다.");
            }

            HttpClientHandler handler = new HttpClientHandler();
            if (_settings.IgnoreSslErrors)
            {
                handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
            }

            var client = new HttpClient(handler, disposeHandler: true)
            {
                BaseAddress = new Uri(_settings.BaseUrl, UriKind.Absolute)
            };
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _client = client;
            return client;
        }
    }

    private async Task<HttpResponseMessage> SendAsync(HttpRequestMessage message)
    {
        var client = GetOrCreateClient();
        return await client.SendAsync(message).ConfigureAwait(false);
    }

    private HttpContent CreateJsonContent(object payload)
    {
        var json = JsonConvert.SerializeObject(payload, _serializerSettings);
        return new StringContent(json, System.Text.Encoding.UTF8, "application/json");
    }

    private void AttachApiKey(HttpRequestMessage message)
    {
        if (!string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            message.Headers.Remove("X-Addin-Key");
            message.Headers.Add("X-Addin-Key", _settings.ApiKey);
        }
    }

    private async Task<T?> DeserializeAsync<T>(HttpResponseMessage response)
    {
        var payload = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
        if (string.IsNullOrWhiteSpace(payload))
        {
            return default;
        }

        return JsonConvert.DeserializeObject<T>(payload);
    }

    public void Dispose()
    {
        lock (_clientLock)
        {
            _client?.Dispose();
            _client = null;
        }
    }
}
