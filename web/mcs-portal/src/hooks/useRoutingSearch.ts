'use client';

import { useMutation } from '@tanstack/react-query';
import { getApiBaseUrl } from '@/lib/env';
import { searchKeys } from '@/lib/queryKeys';
import type {
  RoutingSearchFilters,
  RoutingSearchResponse,
  RoutingSearchResult
} from '@/types/search';

export interface RoutingSearchRequest {
  term: string;
  filters?: RoutingSearchFilters;
  page?: number;
  pageSize?: number;
  slaTargetMs?: number;
}

interface SearchMutationVariables extends RoutingSearchRequest {
  uploadedBy?: string;
}

const DEFAULT_SLA_TARGET = 1500;

function resolveApiUrl(path: string): string {
  const base = getApiBaseUrl();
  if (!base) return path;
  return `${base.replace(/\/$/, '')}${path}`;
}

async function executeSearch(payload: RoutingSearchRequest): Promise<RoutingSearchResult> {
  const body: RoutingSearchRequest = {
    ...payload,
    slaTargetMs: payload.slaTargetMs ?? DEFAULT_SLA_TARGET
  };

  const endpoint = resolveApiUrl('/api/search');
  const startedAt = performance.now();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  const clientDuration = Math.round(performance.now() - startedAt);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Routing search failed (${response.status}): ${errorText || 'no body'}`);
  }

  const data = (await response.json()) as RoutingSearchResponse;

  console.info(
    '[routing-search]',
    JSON.stringify({
      term: payload.term,
      total: data.total,
      serverMs: data.slaMs ?? null,
      clientMs: clientDuration
    })
  );

  return {
    ...data,
    observedClientMs: clientDuration
  };
}

export function useRoutingSearch() {
  return useMutation<RoutingSearchResult, Error, SearchMutationVariables>({
    mutationKey: searchKeys.execute(),
    mutationFn: executeSearch
  });
}
