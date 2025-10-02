import { getApiBaseUrl } from '@/lib/env';
import type { SolidWorksLink } from '@/types/solidworks';

interface ReplaceOptions {
  routingId: string;
  requestedBy: string;
  modelPath?: string;
  file?: File;
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

export async function replaceSolidWorksLink(options: ReplaceOptions): Promise<SolidWorksLink> {
  const { routingId, requestedBy, modelPath, file, configuration, comment } = options;
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('API base URL not configured.');
  }

  const baseUrl = normalizeBaseUrl(base);
  let response: Response;

  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestedBy', requestedBy);
    if (configuration) {
      formData.append('configuration', configuration);
    }
    if (comment) {
      formData.append('comment', comment);
    }

    response = await fetch(`${baseUrl}/api/routings/${routingId}/solidworks/replace`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
  } else {
    if (!modelPath) {
      throw new Error('modelPath is required when no file is provided.');
    }

    response = await fetch(`${baseUrl}/api/routings/${routingId}/solidworks/replace`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ modelPath, requestedBy, configuration, comment })
    });
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Failed to replace SolidWorks model.');
  }

  return response.json() as Promise<SolidWorksLink>;
}
