using System;
using System.Collections.Generic;
using MCMS.Core.Contracts.Dtos;

namespace MCMS.Core.Contracts.Responses;

public record AuditLogSearchResponse(
    IReadOnlyCollection<AuditLogEntryDto> Items,
    int TotalCount,
    int Page,
    int PageSize);

public record AuditAlertDto(
    string Id,
    string Title,
    string Severity,
    string Message,
    DateTimeOffset CreatedAt);

public record AuditLogStatisticsDto(
    DateTimeOffset From,
    DateTimeOffset To,
    int TotalEvents,
    int ApprovalEvents,
    int RejectionEvents,
    int CriticalEvents,
    double PendingApprovalAverageHours,
    IReadOnlyDictionary<string, int> EventsByCategory,
    IReadOnlyDictionary<string, int> EventsByActor,
    IReadOnlyList<AuditAlertDto> Alerts);

