using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class AddinJob : AuditableEntity
{
    public Guid RoutingId { get; set; }
    public AddinJobStatus Status { get; set; } = AddinJobStatus.Pending;
    public string ParametersJson { get; set; } = "{}";
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public string? ResultStatus { get; set; }
    public string? Message { get; set; }
}
