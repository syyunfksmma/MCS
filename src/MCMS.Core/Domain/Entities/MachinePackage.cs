namespace MCMS.Core.Domain.Entities;

public class MachinePackage : AuditableEntity
{
    public Guid ItemRevisionId { get; set; }
    public ItemRevision? ItemRevision { get; set; }
    public string MachineId { get; set; } = string.Empty;
    public string FixtureId { get; set; } = string.Empty;
    public string MachineProjectPath { get; set; } = string.Empty;
    public string FixturePath { get; set; } = string.Empty;
}
