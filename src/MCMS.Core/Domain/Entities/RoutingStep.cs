namespace MCMS.Core.Domain.Entities;

public class RoutingStep : AuditableEntity
{
    public Guid RoutingId { get; set; }
    public Routing? Routing { get; set; }
    public int Sequence { get; set; }
    public string Machine { get; set; } = string.Empty;
    public string ProcessDescription { get; set; } = string.Empty;
    public string? ToolInformation { get; set; }
    public string? Notes { get; set; }
}
