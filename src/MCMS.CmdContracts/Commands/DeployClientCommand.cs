namespace MCMS.CmdContracts.Commands;

public record DeployClientCommand(string PackagePath, IEnumerable<string> TargetMachines, string RequestedBy);
