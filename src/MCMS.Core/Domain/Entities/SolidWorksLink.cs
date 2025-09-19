namespace MCMS.Core.Domain.Entities;

public class SolidWorksLink : AuditableEntity
{
    public Guid ItemRevisionId { get; set; }
    public ItemRevision? ItemRevision { get; set; }
    public string ModelPath { get; set; } = string.Empty;
    public string? Configuration { get; set; }
    public bool IsLinked { get; set; }
    public DateTimeOffset? LastSyncedAt { get; set; }
}
