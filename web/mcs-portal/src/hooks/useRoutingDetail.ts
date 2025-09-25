'use client';\r\n\r\nimport { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getApiBaseUrl } from '@/lib/env';
import type { ExplorerRouting, RoutingDetailResponse } from '@/types/explorer';

interface UseRoutingDetailOptions {
  fallbackRouting?: ExplorerRouting | null;
  enabled?: boolean;
}

function buildMockDetail(routing: ExplorerRouting): RoutingDetailResponse {
  return {
    routing,
    history: [
      {
        id: `${routing.id}-history-mock`,
        timestamp: new Date().toISOString(),
        actor: routing.owner ?? 'workspace.mock',
        action: 'detail-opened',
        description: 'Mock detail response because API base URL is not configured.'
      }
    ],
    uploads: routing.files.map(file => ({
      fileId: file.id,
      fileName: file.name,
      progress: 1,
      state: 'completed',
      checksum: undefined,
      sizeBytes: undefined,
      updatedAt: new Date().toISOString()
    })),
    generatedAt: new Date().toISOString(),
    source: 'mock',
    slaMs: undefined
  };
}

async function fetchRoutingDetail(routingId: string): Promise<RoutingDetailResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('API base URL is not configured.');
  }

  const startedAt = typeof performance !== 'undefined' ? performance.now() : undefined;
  const response = await fetch(`${baseUrl}/api/routings/${routingId}/detail`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Routing detail request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as RoutingDetailResponse;
  const elapsed =
    startedAt !== undefined && typeof performance !== 'undefined' ? performance.now() - startedAt : undefined;

  return {
    ...payload,
    source: payload.source ?? 'api',
    slaMs: payload.slaMs ?? (elapsed !== undefined ? Math.round(elapsed) : undefined)
  };
}

export function useRoutingDetail(
  routingId: string | null,
  options?: UseRoutingDetailOptions
): UseQueryResult<RoutingDetailResponse> {
  return useQuery({
    queryKey: ['routing-detail', routingId],
    enabled: Boolean(routingId) && (options?.enabled ?? true),
    queryFn: async () => {
      if (!routingId) {
        throw new Error('Routing id is required');
      }

      try {
        return await fetchRoutingDetail(routingId);
      } catch (error) {
        if (options?.fallbackRouting) {
          return buildMockDetail(options.fallbackRouting);
        }
        throw error;
      }
    }
  });
}

