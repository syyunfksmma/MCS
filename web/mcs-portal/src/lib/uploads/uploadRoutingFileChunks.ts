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
  signal?: AbortSignal;
  onProgress?: (progress: ChunkUploadProgress) => void;
}

const DEFAULT_CHUNK_SIZE = 256 * 1024;

class MissingPartsError extends Error {
  constructor(message: string, readonly missingParts: number[]) {
    super(message);
    this.name = 'MissingPartsError';
  }
}

const resolveApiUrl = (path: string) => {
  const base = getApiBaseUrl();
  if (!base) return path;
  return `${base.replace(/\/$/, '')}${path}`;
};

type StartSessionResponse = {
  sessionId: string;
  totalChunks: number;
};

async function startChunkSession(
  options: UploadRoutingFileChunksOptions,
  totalChunks: number
): Promise<StartSessionResponse> {
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
  chunk: Uint8Array,
  signal?: AbortSignal
) {
  const endpoint = resolveApiUrl(
    `/api/routings/${routingId}/files/chunks/${sessionId}`
  );

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

  if (response.ok) {
    return (await response.json()) as RoutingMeta;
  }

  if (response.status === 409) {
    try {
      const payload = await response.json();
      if (Array.isArray(payload?.missingParts)) {
        throw new MissingPartsError(
          payload?.message ?? 'Upload session is missing chunks.',
          payload.missingParts as number[]
        );
      }
      throw new Error(payload?.message ?? 'Upload session conflict.');
    } catch (error) {
      if (error instanceof MissingPartsError) {
        throw error;
      }
      throw new Error(`Upload session conflict (${response.status}).`);
    }
  }

  const message = await response.text();
  throw new Error(
    `Failed to complete chunk upload (${response.status}): ${message || 'no body'}`
  );
}

async function readChunk(
  file: File,
  chunkIndex: number,
  chunkSize: number,
  signal?: AbortSignal
): Promise<Uint8Array> {
  if (signal?.aborted) {
    throw new DOMException('Upload aborted', 'AbortError');
  }

  const start = chunkIndex * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const blob = file.slice(start, end);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

async function reuploadMissingParts(
  options: UploadRoutingFileChunksOptions,
  sessionId: string,
  chunkSize: number,
  missingParts: number[]
) {
  const totalChunks = Math.max(1, Math.ceil(options.file.size / chunkSize));
  for (const index of missingParts) {
    const chunk = await readChunk(options.file, index, chunkSize, options.signal);
    await putChunk(options.routingId, sessionId, index, chunk, options.signal);
    options.onProgress?.({
      chunkIndex: index + 1,
      totalChunks,
      loadedBytes: options.file.size,
      totalBytes: options.file.size
    });
  }
}

export async function uploadRoutingFileChunks(
  options: UploadRoutingFileChunksOptions
): Promise<RoutingMeta> {
  const chunkSize = options.chunkSizeBytes ?? DEFAULT_CHUNK_SIZE;
  const totalChunks = Math.max(1, Math.ceil(options.file.size / chunkSize));

  const { sessionId } = await startChunkSession(options, totalChunks);

  const hasher = createStreamingSha256();
  let bytesUploaded = 0;

  for (let index = 0; index < totalChunks; index += 1) {
    const chunk = await readChunk(options.file, index, chunkSize, options.signal);
    hasher.update(chunk);
    await putChunk(options.routingId, sessionId, index, chunk, options.signal);
    bytesUploaded += chunk.length;
    options.onProgress?.({
      chunkIndex: index + 1,
      totalChunks,
      loadedBytes: Math.min(bytesUploaded, options.file.size),
      totalBytes: options.file.size
    });
  }

  const checksum = await hasher.digest();

  try {
    return await completeSession(
      options.routingId,
      sessionId,
      checksum,
      options.isPrimary ?? false,
      options.signal
    );
  } catch (error) {
    if (error instanceof MissingPartsError) {
      await reuploadMissingParts(options, sessionId, chunkSize, error.missingParts);
      return await completeSession(
        options.routingId,
        sessionId,
        checksum,
        options.isPrimary ?? false,
        options.signal
      );
    }

    throw error;
  }
}
