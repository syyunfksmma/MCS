using MCMS.Core.Domain.Enums;

namespace MCMS.Core.Contracts.Dtos;

public record AuditLogEntryDto(
    Guid Id,
    string Category,
    string Action,
    AuditSeverity Severity,
    string Summary,
    string? Details,
    Guid? RoutingId,
    Guid? HistoryEntryId,
    DateTimeOffset EventAt,
    string CreatedBy,
    string? MetadataJson,
    string? TraceId,
    string? RequestId);
