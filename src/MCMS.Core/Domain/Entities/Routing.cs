using System;
using System.Collections.ObjectModel;
using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class Routing : AuditableEntity
{
    public Guid ItemRevisionId { get; set; }
    public ItemRevision? ItemRevision { get; set; }
    public string RoutingCode { get; set; } = string.Empty;
    public RoutingStatus Status { get; set; } = RoutingStatus.Draft;
    public string? CamRevision { get; set; } = "1.0.0";
    public bool IsPrimary { get; set; }
    public bool IsLegacyHidden { get; set; }
    public DateTimeOffset? LegacyHiddenAt { get; set; }
    public string? LegacyHiddenBy { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.None;
    public DateTimeOffset? ApprovalRequestedAt { get; set; }
    public string? ApprovalRequestedBy { get; set; }
    public ICollection<RoutingStep> Steps { get; init; } = new Collection<RoutingStep>();
    public ICollection<RoutingFile> Files { get; init; } = new Collection<RoutingFile>();
    public ICollection<HistoryEntry> HistoryEntries { get; init; } = new Collection<HistoryEntry>();
}
