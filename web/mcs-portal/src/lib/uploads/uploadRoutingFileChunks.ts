'use client';

import { getApiBaseUrl } from '@/lib/env';
import type { RoutingMeta } from '@/types/routing';
import { createStreamingSha256 } from './streamingHash';

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
  maxConcurrentUploads?: number;
  signal?: AbortSignal;
  onProgress?: (progress: ChunkUploadProgress) => void;
}

const DEFAULT_CHUNK_SIZE = 256 * 1024;
const DEFAULT_MAX_CONCURRENT_UPLOADS = 3;

function resolveApiUrl(path: string): string {
  const base = getApiBaseUrl();
  if (!base) return path;
  return `${base.replace(/\/$/, '')}${path}`;
}

async function startChunkSession(
  options: UploadRoutingFileChunksOptions,
  totalChunks: number
) {
  const endpoint = resolveApiUrl(
    `/api/routings/${options.routingId}/files/chunks/start`
  );
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
    throw new Error(
      `Chunk upload session start failed (${response.status}): ${message || 'no body'}`
    );
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
  chunk: ArrayBuffer | Uint8Array,
  signal?: AbortSignal
) {
  const endpoint = resolveApiUrl(
    `/api/routings/${routingId}/files/chunks/${sessionId}`
  );
  const payload = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Chunk-Index': String(chunkIndex)
    },
    credentials: 'include',
    body: payload,
    signal
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Chunk ${chunkIndex} upload failed (${response.status}): ${message || 'no body'}`
    );
  }
}

async function completeSession(
  routingId: string,
  sessionId: string,
  checksum: string,
  isPrimary: boolean,
  signal?: AbortSignal
): Promise<RoutingMeta> {
  const endpoint = resolveApiUrl(
    `/api/routings/${routingId}/files/chunks/${sessionId}/complete`
  );
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
    throw new Error(
      `Chunk upload completion failed (${response.status}): ${message || 'no body'}`
    );
  }

  return (await response.json()) as RoutingMeta;
}

async function fallbackArrayBufferUpload(
  options: UploadRoutingFileChunksOptions,
  totalChunks: number
): Promise<RoutingMeta> {
  const chunkSize = options.chunkSizeBytes ?? DEFAULT_CHUNK_SIZE;
  const buffer = new Uint8Array(await options.file.arrayBuffer());
  const hasher = createStreamingSha256();
  hasher.update(buffer);
  const checksum = await hasher.digest();

  const { sessionId } = await startChunkSession(options, totalChunks);
  options.onProgress?.({
    chunkIndex: 0,
    totalChunks,
    loadedBytes: 0,
    totalBytes: options.file.size
  });

  let bytesUploaded = 0;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, buffer.byteLength);
    const view = buffer.subarray(start, end);

    await putChunk(
      options.routingId,
      sessionId,
      chunkIndex,
      view,
      options.signal
    );
    bytesUploaded += view.byteLength;

    options.onProgress?.({
      chunkIndex: chunkIndex + 1,
      totalChunks,
      loadedBytes: bytesUploaded,
      totalBytes: options.file.size
    });
  }

  return completeSession(
    options.routingId,
    sessionId,
    checksum,
    options.isPrimary ?? false,
    options.signal
  );
}

export async function uploadRoutingFileChunks(
  options: UploadRoutingFileChunksOptions
): Promise<RoutingMeta> {
  const chunkSize = options.chunkSizeBytes ?? DEFAULT_CHUNK_SIZE;
  const totalChunks = Math.max(1, Math.ceil(options.file.size / chunkSize));
  const maxConcurrentUploads = Math.max(
    1,
    options.maxConcurrentUploads ?? DEFAULT_MAX_CONCURRENT_UPLOADS
  );

  if (typeof options.file.stream !== 'function') {
    return fallbackArrayBufferUpload(options, totalChunks);
  }

  const { sessionId } = await startChunkSession(options, totalChunks);
  const reader = options.file
    .stream()
    .getReader();
  const inFlight = new Set<Promise<void>>();
  const hasher = createStreamingSha256();

  let chunkIndex = 0;
  let buffer = new Uint8Array(chunkSize);
  let bufferOffset = 0;
  let bytesUploaded = 0;
  let completedChunks = 0;

  const dispatchChunkAsync = async (length: number) => {
    const payload = buffer.subarray(0, length);
    const copy = new Uint8Array(payload);
    const currentIndex = chunkIndex;
    chunkIndex += 1;

    buffer = new Uint8Array(chunkSize);
    bufferOffset = 0;

    const uploadPromise = putChunk(
      options.routingId,
      sessionId,
      currentIndex,
      copy,
      options.signal
    ).then(() => {
      completedChunks += 1;
      bytesUploaded += length;
      options.onProgress?.({
        chunkIndex: completedChunks,
        totalChunks,
        loadedBytes: bytesUploaded,
        totalBytes: options.file.size
      });
    });

    inFlight.add(uploadPromise);
    uploadPromise.finally(() => {
      inFlight.delete(uploadPromise);
    });

    if (inFlight.size >= maxConcurrentUploads) {
      await Promise.race(inFlight);
    }
  };

  options.onProgress?.({
    chunkIndex: 0,
    totalChunks,
    loadedBytes: 0,
    totalBytes: options.file.size
  });

  try {
    while (true) {
      if (options.signal?.aborted) {
        throw new DOMException('Upload aborted', 'AbortError');
      }

      const { value, done } = await reader.read();

      if (value) {
        let consumed = 0;
        while (consumed < value.length) {
          const remainingInChunk = chunkSize - bufferOffset;
          const take = Math.min(remainingInChunk, value.length - consumed);
          const slice = value.subarray(consumed, consumed + take);

          hasher.update(slice);
          buffer.set(slice, bufferOffset);
          bufferOffset += take;
          consumed += take;

          if (bufferOffset === chunkSize) {
            await dispatchChunkAsync(bufferOffset);
          }
        }
      }

      if (done) {
        break;
      }
    }

    if (chunkIndex === 0 && bufferOffset === 0) {
      await dispatchChunkAsync(0);
    } else if (bufferOffset > 0) {
      await dispatchChunkAsync(bufferOffset);
    }

    if (inFlight.size > 0) {
      await Promise.all(Array.from(inFlight));
    }

    const checksum = await hasher.digest();
    return await completeSession(
      options.routingId,
      sessionId,
      checksum,
      options.isPrimary ?? false,
      options.signal
    );
  } finally {
    reader.releaseLock();
  }
}


