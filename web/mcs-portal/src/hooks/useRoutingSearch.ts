
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
=======
/**
 * Flow D: /search client hook contract stub.
 * - SLA target kept with each response for Sprint 5.1 metrics.
 * - Replace mock once backend contract is finalized.
 */
'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getApiBaseUrl } from '@/lib/env';

export interface RoutingSearchFilters {
  productCode?: string;
  groupId?: string;
  fileType?: string;
  owner?: string;
  updatedAfter?: string;
  updatedBefore?: string;
}

export interface RoutingSearchParams {
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

}

export interface RoutingSearchItem {
  routingId: string;
  routingCode: string;
  productCode: string;
  revisionCode: string;
  groupName: string;
  status: string;
  updatedAt?: string;
  sharedDrivePath?: string;
}

export interface RoutingSearchResponse {
  items: RoutingSearchItem[];
  total: number;
  generatedAt: string;
  source: 'mock' | 'api';
  slaTargetMs: number;
}

const SLA_TARGET_MS = 1500;

async function fetchRoutingSearch(params: RoutingSearchParams): Promise<RoutingSearchResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('API base URL is not configured.');
  }

  const startedAt = typeof performance !== 'undefined' ? performance.now() : undefined;
  const response = await fetch(`${baseUrl}/api/search`, {
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
=======
    body: JSON.stringify({
      term: params.term,
      filters: params.filters,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 25,
      slaTargetMs: SLA_TARGET_MS
    })
  });

  if (!response.ok) {
    throw new Error(`Routing search failed with status ${response.status}`);
  }

  const payload = (await response.json()) as RoutingSearchResponse;
  const elapsed =
    startedAt !== undefined && typeof performance !== 'undefined' ? Math.round(performance.now() - startedAt) : undefined;

  return {
    ...payload,
    items: payload.items ?? [],
    total: payload.total ?? 0,
    generatedAt: payload.generatedAt ?? new Date().toISOString(),
    slaTargetMs: payload.slaTargetMs ?? SLA_TARGET_MS,
    source: payload.source ?? 'api',
    ...(elapsed !== undefined ? { slaTargetMs: elapsed } : {})
  };
}

export function useRoutingSearch(
  params: RoutingSearchParams,
  options?: { enabled?: boolean }
): UseQueryResult<RoutingSearchResponse> {
  return useQuery({
    queryKey: ['routing-search', params],
    queryFn: () => fetchRoutingSearch(params),
    enabled: options?.enabled ?? Boolean(params.term.trim())
  });
}


