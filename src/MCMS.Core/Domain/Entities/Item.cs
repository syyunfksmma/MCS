using System.Collections.ObjectModel;
using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class Item : AuditableEntity
{
    public string ItemCode { get; set; } = string.Empty; // ERP 또는 품목 코드
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<ItemRevision> Revisions { get; init; } = new Collection<ItemRevision>();
}
