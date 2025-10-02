using System.ComponentModel.DataAnnotations;

namespace MCMS.Core.Contracts.Dtos;

public class UpdateCamStatusRequest
{
    [Required]
    [MaxLength(32)]
    public string WoNo { get; init; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string ProcSeq { get; init; } = string.Empty;

    [MaxLength(64)]
    public string? ItemCd { get; init; }

    public bool Is3DModeled { get; init; }

    public bool IsPgCompleted { get; init; }
}
