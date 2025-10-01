import { useQuery } from '@tanstack/react-query';
import { fetchRoutingVersions } from '@/lib/api/routingVersions';
import { routingVersionKeys } from '@/lib/queryKeys';
import type { RoutingVersion } from '@/types/routing';

export function useRoutingVersions(routingId?: string) {
  return useQuery<RoutingVersion[]>({
    queryKey: routingVersionKeys.list(routingId ?? 'none'),
    queryFn: () => {
      if (!routingId) {
        return Promise.resolve([]);
      }
      return fetchRoutingVersions({ routingId });
    },
    enabled: Boolean(routingId)
  });
}
