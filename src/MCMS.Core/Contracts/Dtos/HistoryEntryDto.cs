using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record HistoryEntryDto(
    Guid Id,
    Guid RoutingId,
    string ChangeType,
    string? Field,
    string? PreviousValue,
    string? CurrentValue,
    ApprovalOutcome Outcome,
    DateTimeOffset CreatedAt,
    string CreatedBy,
    string? Comment);
