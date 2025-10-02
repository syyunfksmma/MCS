namespace MCMS.Core.Contracts.Dtos;

public record ErpWorkOrderDto(
    string WoNo,
    string ProcSeq,
    string ItemCd,
    decimal OrderQty,
    string JobCd,
    string MachNm,
    string OperStatusNm,
    string StartYn,
    bool Is3DModeled,
    bool IsPgCompleted
);
