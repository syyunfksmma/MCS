namespace MCMS.CmdContracts.Commands;

public record AddinJobResultCommand(Guid JobId, Guid RoutingId, string ResultStatus, string? Message);
