import { getApiBaseUrl } from '@/lib/env';

import type { ExplorerFile } from '@/types/explorer';

export interface RoutingFileDownloadResult {
  downloadUrl: string;
  fileName: string;
  checksum?: string;
  expiresAt?: string;
  revoke?: () => void;
}

interface FileDownloadOptions {
  routingId: string;
  file: Pick<ExplorerFile, 'id' | 'name'>;
  signal?: AbortSignal;
}

function createMockFileDownload(routingId: string, file: Pick<ExplorerFile, 'id' | 'name'>): RoutingFileDownloadResult {
  const content = `Mock file ${file.name} for routing ${routingId} generated at ${new Date().toISOString()}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const downloadUrl = URL.createObjectURL(blob);
  return {
    downloadUrl,
    fileName: file.name,
    checksum: `mock-file-${file.id}`,
    revoke: () => URL.revokeObjectURL(downloadUrl)
  };
}

export async function getRoutingFileDownload({ routingId, file, signal }: FileDownloadOptions): Promise<RoutingFileDownloadResult> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return createMockFileDownload(routingId, file);
  }

  const url = `${baseUrl.replace(/\/$/, '')}/api/routings/${routingId}/files/${file.id}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    signal
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Failed to request routing file download (${response.status}): ${reason || 'no body'}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const payload = await response.json();
    const downloadUrl = String(payload.downloadUrl ?? '');
    if (!downloadUrl) {
      throw new Error('Routing file response did not include downloadUrl.');
    }
    return {
      downloadUrl,
      fileName: payload.fileName ?? file.name,
      checksum: payload.checksum ?? undefined,
      expiresAt: payload.expiresAt ?? undefined
    };
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  return {
    downloadUrl,
    fileName: file.name,
    revoke: () => URL.revokeObjectURL(downloadUrl)
  };
}
