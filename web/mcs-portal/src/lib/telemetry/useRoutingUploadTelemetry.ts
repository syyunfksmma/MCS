import { useCallback, useRef } from 'react';

import { logRoutingEvent } from '@/lib/telemetry/routing';

const createUploadId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `routing-upload-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

type UploadStartArgs = {
  fileCount: number;
  totalSize: number;
  userId?: string;
  uploadId?: string;
};

type UploadChunkArgs = {
  chunkIndex: number;
  chunkSize: number;
  elapsedMs?: number;
};

type UploadFailArgs = {
  errorCode: string;
  retryCount: number;
  lastChunkIndex: number;
};

type UploadCompleteArgs = {
  totalChunks: number;
  totalDurationMs: number;
};

export function useRoutingUploadTelemetry() {
  const sessionIdRef = useRef<string | null>(null);

  const ensureSession = useCallback((explicitId?: string) => {
    if (explicitId) {
      sessionIdRef.current = explicitId;
      return explicitId;
    }

    if (!sessionIdRef.current) {
      sessionIdRef.current = createUploadId();
    }

    return sessionIdRef.current;
  }, []);

  const reset = useCallback(() => {
    sessionIdRef.current = null;
  }, []);

  const beginUpload = useCallback(({ fileCount, totalSize, userId, uploadId }: UploadStartArgs) => {
    const sessionId = ensureSession(uploadId);

    logRoutingEvent({
      name: 'routing.wave1.upload.start',
      properties: {
        uploadId: sessionId,
        fileCount,
        totalSize,
        ...(userId ? { userId } : {})
      }
    });

    return sessionId;
  }, [ensureSession]);

  const logChunk = useCallback(({ chunkIndex, chunkSize, elapsedMs }: UploadChunkArgs) => {
    const sessionId = ensureSession();

    logRoutingEvent({
      name: 'routing.wave1.upload.chunk',
      properties: {
        uploadId: sessionId,
        chunkIndex,
        chunkSize
      },
      measurements: elapsedMs != null ? { elapsedMs } : undefined
    });
  }, [ensureSession]);

  const logFailure = useCallback(({ errorCode, retryCount, lastChunkIndex }: UploadFailArgs) => {
    const sessionId = ensureSession();

    logRoutingEvent({
      name: 'routing.wave1.upload.fail',
      properties: {
        uploadId: sessionId,
        errorCode,
        retryCount,
        lastChunkIndex
      }
    });
  }, [ensureSession]);

  const logComplete = useCallback(({ totalChunks, totalDurationMs }: UploadCompleteArgs) => {
    const sessionId = ensureSession();

    logRoutingEvent({
      name: 'routing.wave1.upload.complete',
      properties: {
        uploadId: sessionId,
        totalChunks
      },
      measurements: {
        totalDurationMs
      }
    });

    reset();
  }, [ensureSession, reset]);

  return {
    beginUpload,
    logChunk,
    logFailure,
    logComplete,
    reset
  };
}
