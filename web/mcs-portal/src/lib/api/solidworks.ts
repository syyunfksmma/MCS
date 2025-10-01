import { getApiBaseUrl } from '@/lib/env';
import type { SolidWorksLink } from '@/types/solidworks';

interface ReplaceOptions {
  routingId: string;
  modelPath: string;
  requestedBy: string;
  configuration?: string;
  comment?: string;
}

function normalizeBaseUrl(base: string): string {
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export async function fetchSolidWorksLink(routingId: string): Promise<SolidWorksLink | null> {
  const base = getApiBaseUrl();
  if (!base) {
    return null;
  }

  const baseUrl = normalizeBaseUrl(base);
  const response = await fetch(`${baseUrl}/api/routings/${routingId}/solidworks`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load SolidWorks link: ${response.status}`);
  }

  return response.json() as Promise<SolidWorksLink>;
}

export async function replaceSolidWorksLink({
  routingId,
  modelPath,
  requestedBy,
  configuration,
  comment
}: ReplaceOptions): Promise<SolidWorksLink> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API base URL not configured.');
  }

  const baseUrl = normalizeBaseUrl(base);
  const response = await fetch(`${baseUrl}/api/routings/${routingId}/solidworks/replace`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ modelPath, requestedBy, configuration, comment })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Failed to replace SolidWorks model.');
  }

  return response.json() as Promise<SolidWorksLink>;
}
