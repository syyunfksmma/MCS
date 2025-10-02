namespace MCMS.Core.Contracts.Dtos;

public record CamWorkStatusDto(
    string WoNo,
    string ProcSeq,
    string? ItemCd,
    bool Is3DModeled,
    bool IsPgCompleted,
    DateTimeOffset? Last3DModeledAt,
    DateTimeOffset? LastPgCompletedAt,
    DateTimeOffset CreatedAt,
    string CreatedBy,
    DateTimeOffset? UpdatedAt,
    string? UpdatedBy);
