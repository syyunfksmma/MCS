export type DashboardRange = 'daily' | 'weekly' | 'monthly';

export interface DashboardTotals {
  unassigned: number;
  inProgress: number;
  completed: number;
}

export interface DashboardSlaMetrics {
  targetMs: number;
  p95Ms: number;
  p99Ms: number;
}

export interface DashboardBreakdownItem {
  key: string;
  count: number;
}

export interface DashboardBreakdown {
  byOwner: DashboardBreakdownItem[];
  byMachine: DashboardBreakdownItem[];
}

export interface DashboardPeriod {
  range: DashboardRange;
  start: string;
  end: string;
}

export interface DashboardSummary {
  totals: DashboardTotals;
  sla: DashboardSlaMetrics;
  breakdown?: DashboardBreakdown | null;
  period: DashboardPeriod;
}
