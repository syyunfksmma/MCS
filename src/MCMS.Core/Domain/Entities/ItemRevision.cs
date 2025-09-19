using System.Collections.ObjectModel;
using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class ItemRevision : AuditableEntity
{
    public Guid ItemId { get; set; }
    public Item? Item { get; set; }
    public string RevisionCode { get; set; } = string.Empty;
    public RevisionStatus Status { get; set; } = RevisionStatus.Draft;
    public DateTimeOffset? ValidFrom { get; set; }
    public DateTimeOffset? ValidTo { get; set; }
    public string? SolidWorksConfiguration { get; set; }
    public ICollection<Routing> Routings { get; init; } = new Collection<Routing>();
}
