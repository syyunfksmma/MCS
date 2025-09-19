using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Domain.Entities;

public class RoutingFile : AuditableEntity
{
    public Guid RoutingId { get; set; }
    public Routing? Routing { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty; // W: 공유 기준 경로
    public ManagedFileType FileType { get; set; }
    public long FileSizeBytes { get; set; }
    public string Checksum { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}
