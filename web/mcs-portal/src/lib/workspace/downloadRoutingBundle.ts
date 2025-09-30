import { getApiBaseUrl } from '@/lib/env';

export interface RoutingDownloadResult {
  downloadUrl: string;
  fileName: string;
  checksum?: string;
  expiresAt?: string;
  revoke?: () => void;
}

interface DownloadBundleOptions {
  routingId: string;
  signal?: AbortSignal;
}

function createMockBundle(routingId: string): RoutingDownloadResult {
  const fileName = `routing-${routingId}-bundle-mock.zip`;
  const content = `Mock routing bundle for ${routingId} generated at ${new Date().toISOString()}`;
  const blob = new Blob([content], { type: 'application/zip' });
  const downloadUrl = URL.createObjectURL(blob);
  return {
    downloadUrl,
    fileName,
    checksum: `mock-sha256-${routingId}`,
    revoke: () => URL.revokeObjectURL(downloadUrl)
  };
}

export async function downloadRoutingBundle({ routingId, signal }: DownloadBundleOptions): Promise<RoutingDownloadResult> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return createMockBundle(routingId);
  }

  const url = `${baseUrl.replace(/\/$/, '')}/api/routings/${routingId}/bundle`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    signal
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Failed to request routing bundle (${response.status}): ${reason || 'no body'}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const payload = await response.json();
    const downloadUrl = String(payload.downloadUrl ?? '');
    if (!downloadUrl) {
      throw new Error('Routing bundle response did not include downloadUrl.');
    }
    return {
      downloadUrl,
      fileName: payload.fileName ?? `routing-${routingId}.zip`,
      checksum: payload.checksum ?? undefined,
      expiresAt: payload.expiresAt ?? undefined
    };
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  return {
    downloadUrl,
    fileName: `routing-${routingId}.zip`,
    revoke: () => URL.revokeObjectURL(downloadUrl)
  };
}
