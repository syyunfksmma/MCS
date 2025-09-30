import { DashboardSummary, DashboardRange } from '@/types/dashboard';

const RANGE_MAP: Record<DashboardRange, string> = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly'
};

export async function fetchDashboardSummary(
  range: DashboardRange,
  includeBreakdown = true
): Promise<DashboardSummary> {
  const params = new URLSearchParams({
    range: RANGE_MAP[range],
    includeBreakdown: String(includeBreakdown)
  });

  const response = await fetch(/api/dashboard/summary?, {
    method: 'GET',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('대시보드 데이터를 가져오지 못했습니다.');
  }

  return response.json();
}
