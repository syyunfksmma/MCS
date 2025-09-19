namespace MCMS.CmdContracts.Commands;

public record DeployMachinePackageCommand(string MachineId, string FixtureId, string PackagePath, string RequestedBy);
