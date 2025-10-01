namespace MCMS.Core.Contracts.Dtos;

public record UserPermissionsDto(
    bool CanOpenExplorer,
    bool CanReplaceSolidWorks,
    bool CanManageRoutingVersions);