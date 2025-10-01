import { getApiBaseUrl } from '@/lib/env';
import type { RoutingVersion } from '@/types/routing';

interface FetchOptions {
  routingId: string;
}

interface SetPrimaryOptions {
  routingId: string;
  versionId: string;
  requestedBy: string;
  comment?: string;
}

function resolveBaseUrl(): string {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API base URL is not configured.');
  }
  return base.replace(/\/$/, '');
}

export async function fetchRoutingVersions({ routingId }: FetchOptions): Promise<RoutingVersion[]> {
  const baseUrl = resolveBaseUrl();
  const response = await fetch(`${baseUrl}/api/routings/${routingId}/versions`, {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load routing versions: ${response.status}`);
  }

  return response.json() as Promise<RoutingVersion[]>;
}

export async function setPrimaryRoutingVersion({ routingId, versionId, requestedBy, comment }: SetPrimaryOptions) {
  const baseUrl = resolveBaseUrl();
  const response = await fetch(`${baseUrl}/api/routings/${routingId}/versions/${versionId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ isPrimary: true, requestedBy, comment })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Failed to promote version.');
  }

  return response.json() as Promise<RoutingVersion>;
}
