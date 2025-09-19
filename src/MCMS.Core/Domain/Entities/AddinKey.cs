using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class AddinKey : AuditableEntity
{
    public string Value { get; set; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; set; } = DateTimeOffset.UtcNow.AddDays(30);
    public bool IsRevoked { get; set; }
    public DateTimeOffset? RevokedAt { get; set; }
}
