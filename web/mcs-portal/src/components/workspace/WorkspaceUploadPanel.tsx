'use client';

import { InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Empty,
  List,
  message,
  Progress,
  Typography,
  Upload
} from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';
import {
  uploadRoutingFileChunks,
  type ChunkUploadProgress
} from '@/lib/uploads/uploadRoutingFileChunks';
import { useRoutingUploadTelemetry } from '@/lib/telemetry/useRoutingUploadTelemetry';
import type { ExplorerRouting } from '@/types/explorer';

const { Paragraph, Text } = Typography;

type UploadStatus = 'uploading' | 'success' | 'error' | 'cancelled';

interface UploadEntry {
  id: string;
  name: string;
  size: number;
  status: UploadStatus;
  progress: number;
  routingCode: string;
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

interface WorkspaceUploadPanelProps {
  routing?: ExplorerRouting | null;
}

const ALLOWED_EXTENSIONS = new Set([
  '.nc',
  '.esprit',
  '.esp',
  '.json',
  '.mprj',
  '.stl'
]);

const formatSize = (size: number) => {
  if (size >= 1_000_000) {
    return `${(size / 1_000_000).toFixed(1)} MB`;
  }
  if (size >= 1_000) {
    return `${(size / 1_000).toFixed(1)} KB`;
  }
  return `${size} B`;
};

const getExtension = (fileName: string) => {
  const index = fileName.lastIndexOf('.');
  return index >= 0 ? fileName.slice(index).toLowerCase() : '';
};

const isAllowedFile = (fileName: string) => ALLOWED_EXTENSIONS.has(getExtension(fileName));

const inferFileType = (fileName: string): string => {
  const ext = getExtension(fileName);
  if (ext === '.nc') return 'nc';
  if (ext === '.esprit' || ext === '.esp') return 'esprit';
  if (ext === '.json') return 'meta';
  if (ext === '.mprj') return 'mprj';
  if (ext === '.stl') return 'stl';
  return 'other';
};

export default function WorkspaceUploadPanel({
  routing
}: WorkspaceUploadPanelProps) {
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const { beginUpload, logChunk, logFailure, logComplete, reset } =
    useRoutingUploadTelemetry();

  const clearCompleted = () => {
    setEntries((prev) => prev.filter((entry) => entry.status !== 'success'));
  };

  const uploadProps: UploadProps = useMemo<UploadProps>(
    () => ({
      name: 'workspace-upload',
      multiple: true,
      showUploadList: false,
      disabled: !routing,
      beforeUpload: (file) => {
        if (!routing) {
          message.warning('Select a routing before uploading.');
          return Upload.LIST_IGNORE;
        }
        if (!isAllowedFile(file.name)) {
          message.error('Unsupported file type. Allowed: NC, Esprit, JSON, MPRJ, STL.');
          return Upload.LIST_IGNORE;
        }
        return true;
      },
      customRequest: async (options) => {
        if (!routing) {
          options.onError?.(new Error('Routing not selected'));
          return;
        }

        const file = options.file as RcFile;
        if (!isAllowedFile(file.name)) {
          message.error('Unsupported file type.');
          options.onError?.(new Error('Unsupported file type'));
          return;
        }

        const id = file.uid;
        const controller = new AbortController();
        const uploadedBy = 'workspace.user';
        const uploadStartedAt = Date.now();

        setEntries((prev) => [
          ...prev,
          {
            id,
            name: file.name,
            size: file.size,
            status: 'uploading',
            progress: 0,
            routingCode: routing.code,
            startedAt: new Date()
          }
        ]);

        const abortListener = () => {
          controller.abort();
          setEntries((prev) =>
            prev.map((entry) =>
              entry.id === id
                ? {
                    ...entry,
                    status: 'cancelled',
                    completedAt: new Date()
                  }
                : entry
            )
          );
          options.onError?.(new Error('Upload cancelled'));
        };

        controller.signal.addEventListener('abort', abortListener);

                        beginUpload({
          fileCount: 1,
          totalSize: file.size,
          userId: uploadedBy,
          uploadId: id
        });

        let totalChunks = 0;
        let lastLoadedBytes = 0;
        let lastChunkIndex = 0;
        let lastChunkTimestamp = Date.now();

        const handleProgress = (progress: ChunkUploadProgress) => {
          totalChunks = progress.totalChunks;
          const percent =
            progress.totalBytes === 0
              ? 0
              : Math.round((progress.loadedBytes / progress.totalBytes) * 100);

          setEntries((prev) =>
            prev.map((entry) =>
              entry.id === id
                ? {
                    ...entry,
                    progress: Math.min(100, Math.max(0, percent)),
                    status: percent >= 100 ? 'success' : entry.status,
                    completedAt:
                      percent >= 100 ? new Date() : entry.completedAt
                  }
                : entry
            )
          );

          options.onProgress?.({ percent });

          if (progress.chunkIndex > lastChunkIndex) {
            const chunkSize = Math.max(
              0,
              progress.loadedBytes - lastLoadedBytes
            );
            const elapsedMs = Math.max(0, Date.now() - lastChunkTimestamp);

            logChunk({
              chunkIndex: progress.chunkIndex,
              chunkSize,
              elapsedMs
            });

            lastChunkIndex = progress.chunkIndex;
            lastLoadedBytes = progress.loadedBytes;
            lastChunkTimestamp = Date.now();
          }
        };

        try {
          await uploadRoutingFileChunks({
            routingId: routing.id,
            file,
            fileType: inferFileType(file.name),
            uploadedBy,
            onProgress: handleProgress,
            signal: controller.signal
          });

          handleProgress({
            chunkIndex: Math.max(lastChunkIndex, totalChunks),
            totalChunks: totalChunks || lastChunkIndex || 1,
            loadedBytes: file.size,
            totalBytes: file.size
          });

          logComplete({
            totalChunks: totalChunks || lastChunkIndex || 1,
            totalDurationMs: Date.now() - uploadStartedAt
          });

          message.success(`Upload complete: ${file.name}`);
          options.onSuccess?.({}, undefined);
        } catch (err) {
          if (controller.signal.aborted) {
            return;
          }

          const description =
            err instanceof Error ? err.message : 'Unexpected error';

          setEntries((prev) =>
            prev.map((entry) =>
              entry.id === id
                ? {
                    ...entry,
                    status: 'error',
                    errorMessage: description,
                    completedAt: new Date()
                  }
                : entry
            )
          );

          message.error(`Upload failed: ${description}`);

          logFailure({
            errorCode:
              err instanceof Error && err.name ? err.name : 'UploadError',
            retryCount: 0,
            lastChunkIndex
          });

          options.onError?.(err as Error);
        } finally {
          reset();
          controller.signal.removeEventListener('abort', abortListener);
        }
      }
    }),
    [
      routing,
      beginUpload,
      logChunk,
      logFailure,
      logComplete,
      reset
    ]
  );

  return (
    <div className="flex flex-col gap-4">
      <Paragraph>
        <Text strong>Target routing:</Text>{' '}
        {routing ? routing.code : 'None selected'}
      </Paragraph>
      <Upload.Dragger {...uploadProps} className="bg-white">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Drag & drop files here or click to browse
        </p>
        <p className="ant-upload-hint text-xs text-gray-500">
          Allowed extensions: NC, Esprit, meta.json. Checksum validation runs on upload.
        </p>
      </Upload.Dragger>
      {entries.length ? (
        <>
          <div className="flex items-center justify-between">
            <Text type="secondary">
              Active uploads:{' '}
              {entries.filter((entry) => entry.status === 'uploading').length}
            </Text>
            <Button
              size="small"
              onClick={clearCompleted}
              disabled={!entries.some((entry) => entry.status === 'success')}
            >
              Clear completed
            </Button>
          </div>
          <List
            dataSource={entries}
            renderItem={(entry) => (
              <List.Item>
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Text strong ellipsis className="block">
                        {entry.name}
                      </Text>
                      <Paragraph type="secondary" className="mb-0 text-xs">
                        {formatSize(entry.size)} - Routing {entry.routingCode} - {' '}
                        {entry.status}
                      </Paragraph>
                      {entry.errorMessage ? (
                        <Text type="danger" className="text-xs">
                          {entry.errorMessage}
                        </Text>
                      ) : null}
                    </div>
                    <div className="w-40">
                      <Progress
                        percent={Math.min(
                          100,
                          Math.max(0, Math.round(entry.progress))
                        )}
                        status={
                          entry.status === 'success'
                            ? 'success'
                            : entry.status === 'error'
                              ? 'exception'
                              : 'active'
                        }
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </>
      ) : (
        <Empty
          description="No uploads yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
}



