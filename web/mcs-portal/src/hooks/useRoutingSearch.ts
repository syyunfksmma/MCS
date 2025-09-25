import { useMutation } from '@tanstack/react-query';
import { getApiBaseUrl } from '@/lib/env';
import type { RoutingSearchResult } from '@/types/search';

export interface RoutingSearchRequest {
  term: string;
  pageSize?: number;
  slaTargetMs?: number;
}

const buildEndpoint = () => {
  const base = getApiBaseUrl();
  return `${base.replace(/\/$/, '')}/api/search`;
};

export function useRoutingSearch() {
  return useMutation<RoutingSearchResult, Error, RoutingSearchRequest>({
    mutationFn: async (payload) => {
      const response = await fetch(buildEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `검색 호출 실패 (${response.status})`);
      }

      return (await response.json()) as RoutingSearchResult;
    }
  });
}
