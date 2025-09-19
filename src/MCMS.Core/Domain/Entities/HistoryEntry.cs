using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class HistoryEntry : AuditableEntity
{
    public Guid RoutingId { get; set; }
    public Routing? Routing { get; set; }
    public string ChangeType { get; set; } = string.Empty; // Created, Updated, Approved 등
    public string? Field { get; set; }
    public string? PreviousValue { get; set; }
    public string? CurrentValue { get; set; }
    public ApprovalOutcome Outcome { get; set; } = ApprovalOutcome.Pending;
    public DateTimeOffset EffectiveDate { get; set; } = DateTimeOffset.UtcNow;
    public string? Comment { get; set; }
}
