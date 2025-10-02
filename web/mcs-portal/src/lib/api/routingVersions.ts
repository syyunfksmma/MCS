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
  legacyHidden?: boolean;
  camRevision?: string;
  is3DModeled?: boolean;
  isPgCompleted?: boolean;
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
  legacyHidden,
  camRevision,
  is3DModeled,
  isPgCompleted
}: UpdateRoutingVersionOptions): Promise<RoutingVersion> {
  const baseUrl = ensureBaseUrl();
  const payload: Record<string, unknown> = {
    requestedBy,
    comment
  };

  if (typeof makePrimary === "boolean") {
    payload.isPrimary = makePrimary;
  }

  if (typeof legacyHidden === "boolean") {
    payload.legacyHidden = legacyHidden;
  }

  if (typeof camRevision === "string" && camRevision.trim().length > 0) {
    payload.camRevision = camRevision.trim();
  }

  if (typeof is3DModeled === "boolean") {
    payload.is3DModeled = is3DModeled;
  }

  if (typeof isPgCompleted === "boolean") {
    payload.isPgCompleted = isPgCompleted;
  }


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


