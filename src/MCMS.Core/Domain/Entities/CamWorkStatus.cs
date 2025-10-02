namespace MCMS.Core.Domain.Entities;

public class CamWorkStatus : AuditableEntity
{
    public string WoNo { get; set; } = string.Empty;
    public string ProcSeq { get; set; } = string.Empty;
    public string? ItemCd { get; set; }
    public bool Is3DModeled { get; set; }
    public bool IsPgCompleted { get; set; }
    public DateTimeOffset? Last3DModeledAt { get; set; }
    public DateTimeOffset? LastPgCompletedAt { get; set; }
}
