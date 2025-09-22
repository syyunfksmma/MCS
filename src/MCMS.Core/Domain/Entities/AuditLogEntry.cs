using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class AuditLogEntry : AuditableEntity
{
    public string Category { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public AuditSeverity Severity { get; set; } = AuditSeverity.Info;
    public string Summary { get; set; } = string.Empty;
    public string? Details { get; set; }
    public Guid? RoutingId { get; set; }
    public Routing? Routing { get; set; }
    public Guid? HistoryEntryId { get; set; }
    public HistoryEntry? HistoryEntry { get; set; }
    public string? MetadataJson { get; set; }
    public string? TraceId { get; set; }
    public string? RequestId { get; set; }
    public DateTimeOffset EventAt { get; set; } = DateTimeOffset.UtcNow;
}
