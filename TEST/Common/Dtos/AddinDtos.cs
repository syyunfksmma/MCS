using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace CAM_API.Common.Dtos;

internal sealed class AddinKeyDto
{
    [JsonProperty("keyId")]
    public Guid KeyId { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; } = string.Empty;

    [JsonProperty("expiresAt")]
    public DateTimeOffset ExpiresAt { get; set; }
}

internal sealed class AddinJobDto
{
    [JsonProperty("jobId")]
    public Guid JobId { get; set; }

    [JsonProperty("routingId")]
    public Guid RoutingId { get; set; }

    [JsonProperty("status")]
    public string Status { get; set; } = string.Empty;

    [JsonProperty("createdAt")]
    public DateTimeOffset CreatedAt { get; set; }

    [JsonProperty("startedAt")]
    public DateTimeOffset? StartedAt { get; set; }

    [JsonProperty("completedAt")]
    public DateTimeOffset? CompletedAt { get; set; }

    [JsonProperty("parameters")]
    public Dictionary<string, string> Parameters { get; set; } = new();

    [JsonProperty("resultStatus")]
    public string? ResultStatus { get; set; }

    [JsonProperty("message")]
    public string? Message { get; set; }
}

internal sealed class AddinJobCreateRequest
{
    [JsonProperty("routingId")]
    public Guid RoutingId { get; set; }

    [JsonProperty("parameters")]
    public Dictionary<string, string> Parameters { get; set; } = new();

    [JsonProperty("createdBy")]
    public string CreatedBy { get; set; } = Environment.UserName;
}

internal sealed class AddinJobCompleteRequest
{
    [JsonProperty("resultStatus")]
    public string ResultStatus { get; set; } = "completed";

    [JsonProperty("message")]
    public string? Message { get; set; }
}

internal sealed class RenewAddinKeyRequest
{
    [JsonProperty("requestedBy")]
    public string? RequestedBy { get; set; }

    [JsonProperty("validDays")]
    public int? ValidDays { get; set; }
}
