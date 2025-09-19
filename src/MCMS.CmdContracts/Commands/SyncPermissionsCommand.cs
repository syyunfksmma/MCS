namespace MCMS.CmdContracts.Commands;

public record SyncPermissionsCommand(string TargetPath, string GroupName, string RequestedBy);
