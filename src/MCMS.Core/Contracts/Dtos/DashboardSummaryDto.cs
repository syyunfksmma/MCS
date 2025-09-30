using System;
using System.Collections.Generic;
using MCMS.Core.Contracts.Requests;

namespace MCMS.Core.Contracts.Dtos;

public record DashboardSummaryDto(
    DashboardTotalsDto Totals,
    DashboardSlaDto Sla,
    DashboardBreakdownDto? Breakdown,
    DashboardPeriodDto Period);

public record DashboardTotalsDto(int Unassigned, int InProgress, int Completed);

public record DashboardSlaDto(int TargetMs, double P95Ms, double P99Ms);

public record DashboardBreakdownDto(
    IReadOnlyCollection<DashboardBreakdownItemDto> ByOwner,
    IReadOnlyCollection<DashboardBreakdownItemDto> ByMachine);

public record DashboardBreakdownItemDto(string Key, int Count);

public record DashboardPeriodDto(DashboardRange Range, DateTimeOffset Start, DateTimeOffset End);
