import { getApiBaseUrl } from '@/lib/env';
import type { RoutingVersion } from '@/types/routing';

interface FetchOptions {
  routingId: string;
}

export interface UpdateRoutingVersionOptions {
  routingId: string;
  versionId: string;
  requestedBy: string;
  comment?: string;
  makePrimary?: boolean;
  currentIsPrimary?: boolean;
  legacyHidden?: boolean;
}

function normalizeBaseUrl(base: string): string {
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function ensureBaseUrl(): string {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API base URL is not configured.');
  }
  return normalizeBaseUrl(base);
}

export async function fetchRoutingVersions({ routingId }: FetchOptions): Promise<RoutingVersion[]> {
  const baseUrl = ensureBaseUrl();
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

export async function updateRoutingVersion({
  routingId,
  versionId,
  requestedBy,
  comment,
  makePrimary,
  currentIsPrimary,
  legacyHidden
}: UpdateRoutingVersionOptions): Promise<RoutingVersion> {
  const baseUrl = ensureBaseUrl();
  const payload = {
    isPrimary: makePrimary ?? currentIsPrimary ?? false,
    requestedBy,
    comment,
    legacyHidden
  };

  const response = await fetch(`${baseUrl}/api/routings/${routingId}/versions/${versionId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Failed to update routing version.');
  }

  return response.json() as Promise<RoutingVersion>;
}
