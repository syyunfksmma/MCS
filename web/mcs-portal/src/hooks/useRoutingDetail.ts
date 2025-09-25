import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getApiBaseUrl } from '@/lib/env';
import type { ExplorerRouting, RoutingDetailResponse } from '@/types/explorer';

export interface UseRoutingDetailOptions {
  routingId?: string;
  enabled?: boolean;
}

const DEFAULT_OPTIONS: UseRoutingDetailOptions = {
  enabled: true
};

const buildEndpoint = (routingId: string) => {
  const base = getApiBaseUrl();
  return `${base.replace(/\/$/, '')}/api/routings/${routingId}`;
};

export function useRoutingDetail(
  routing: ExplorerRouting | null,
  options: UseRoutingDetailOptions = DEFAULT_OPTIONS
): UseQueryResult<RoutingDetailResponse> {
  const routingId = routing?.id ?? options.routingId;
  const enabled = Boolean(routingId) && (options.enabled ?? true);

  return useQuery<RoutingDetailResponse>({
    queryKey: ['routing-detail', routingId],
    enabled,
    queryFn: async () => {
      if (!routingId) {
        throw new Error('routingId is required to fetch detail.');
      }
      const response = await fetch(buildEndpoint(routingId), {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`Failed to load routing detail (${response.status})`);
      }
      return (await response.json()) as RoutingDetailResponse;
    }
  });
}
