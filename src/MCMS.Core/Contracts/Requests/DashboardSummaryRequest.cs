namespace MCMS.Core.Contracts.Requests;

public enum DashboardRange
{
    Daily,
    Weekly,
    Monthly
}

public record DashboardSummaryRequest(DashboardRange Range = DashboardRange.Daily, bool IncludeBreakdown = false);
