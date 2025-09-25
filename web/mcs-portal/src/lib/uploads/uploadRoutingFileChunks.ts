'use client';

import { getApiBaseUrl } from '@/lib/env';
import type { RoutingMeta } from '@/types/routing';

export interface ChunkUploadProgress {
  chunkIndex: number;
  totalChunks: number;
  loadedBytes: number;
  totalBytes: number;
}

export interface UploadRoutingFileChunksOptions {
  routingId: string;
  file: File;
  fileType: string;
  uploadedBy: string;
  isPrimary?: boolean;
  chunkSizeBytes?: number;
  signal?: AbortSignal;
  onProgress?: (progress: ChunkUploadProgress) => void;
}

const DEFAULT_CHUNK_SIZE = 256 * 1024;

function resolveApiUrl(path: string): string {
  const base = getApiBaseUrl();
  if (!base) return path;
  return `${base.replace(/\/$/, '')}${path}`;
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

async function computeSha256(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return bufferToHex(digest);
}

async function startChunkSession(options: UploadRoutingFileChunksOptions, totalChunks: number) {
  const endpoint = resolveApiUrl(`/api/routings/${options.routingId}/files/chunks/start`);
  const payload = {
    fileName: options.file.name,
    fileType: options.fileType,
    totalSizeBytes: options.file.size,
    chunkSizeBytes: options.chunkSizeBytes ?? DEFAULT_CHUNK_SIZE,
    uploadedBy: options.uploadedBy
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload),
    signal: options.signal
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Chunk upload session start failed (${response.status}): ${message || 'no body'}`);
  }

  const json = await response.json();
  return {
    sessionId: json.sessionId as string,
    totalChunks
  };
}

async function putChunk(
  routingId: string,
  sessionId: string,
  chunkIndex: number,
  chunk: ArrayBuffer,
  signal?: AbortSignal
) {
  const endpoint = resolveApiUrl(`/api/routings/${routingId}/files/chunks/${sessionId}`);
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Chunk-Index': String(chunkIndex)
    },
    credentials: 'include',
    body: chunk,
    signal
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Chunk ${chunkIndex} upload failed (${response.status}): ${message || 'no body'}`);
  }
}

async function completeSession(
  routingId: string,
  sessionId: string,
  checksum: string,
  isPrimary: boolean,
  signal?: AbortSignal
): Promise<RoutingMeta> {
  const endpoint = resolveApiUrl(`/api/routings/${routingId}/files/chunks/${sessionId}/complete`);
  const payload = {
    checksum,
    isPrimary
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Chunk upload completion failed (${response.status}): ${message || 'no body'}`);
  }

  return (await response.json()) as RoutingMeta;
}

export async function uploadRoutingFileChunks(
  options: UploadRoutingFileChunksOptions
): Promise<RoutingMeta> {
  const chunkSize = options.chunkSizeBytes ?? DEFAULT_CHUNK_SIZE;
  const totalChunks = Math.max(1, Math.ceil(options.file.size / chunkSize));
  const totalBuffer = await options.file.arrayBuffer();
  const checksum = await computeSha256(totalBuffer);

  const { sessionId } = await startChunkSession(options, totalChunks);
  options.onProgress?.({
    chunkIndex: 0,
    totalChunks,
    loadedBytes: 0,
    totalBytes: options.file.size
  });

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, totalBuffer.byteLength);
    const chunk = totalBuffer.slice(start, end);

    await putChunk(options.routingId, sessionId, chunkIndex, chunk, options.signal);

    options.onProgress?.({
      chunkIndex: chunkIndex + 1,
      totalChunks,
      loadedBytes: end,
      totalBytes: options.file.size
    });
  }

  const meta = await completeSession(
    options.routingId,
    sessionId,
    checksum,
    options.isPrimary ?? false,
    options.signal
  );

  return meta;
}
