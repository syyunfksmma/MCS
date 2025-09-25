'use client';

import { InboxOutlined } from '@ant-design/icons';
import { Button, Empty, List, message, Progress, Typography, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { useMemo, useState } from 'react';
import { uploadRoutingFileChunks } from '@/lib/uploads/uploadRoutingFileChunks';
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

const formatSize = (size: number) => {
  if (size >= 1_000_000) {
    return `${(size / 1_000_000).toFixed(1)} MB`;
  }
  if (size >= 1_000) {
    return `${(size / 1_000).toFixed(1)} KB`;
  }
  return `${size} B`;
};

const inferFileType = (fileName: string): string => {
  const lowered = fileName.toLowerCase();
  if (lowered.endsWith('.nc')) return 'nc';
  if (lowered.endsWith('.esprit') || lowered.endsWith('.esp')) return 'esprit';
  if (lowered.endsWith('.json')) return 'meta';
  if (lowered.endsWith('.mprj')) return 'mprj';
  if (lowered.endsWith('.stl')) return 'stl';
  return 'other';
};

export default function WorkspaceUploadPanel({ routing }: WorkspaceUploadPanelProps) {
  const [entries, setEntries] = useState<UploadEntry[]>([]);

  const clearCompleted = () => {
    setEntries(prev => prev.filter(entry => entry.status !== 'success'));
  };

  const uploadProps: UploadProps = useMemo(() => ({
    name: 'workspace-upload',
    multiple: true,
    showUploadList: false,
    disabled: !routing,
    beforeUpload: () => {
      if (!routing) {
        message.warning('Routing을 선택한 뒤 업로드하세요.');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async options => {
      if (!routing) {
        options.onError?.(new Error('Routing not selected'));
        return;
      }

      const file = options.file as RcFile;
      const id = file.uid;
      const controller = new AbortController();
      const uploadedBy = 'workspace.user';

      setEntries(prev => [
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

      const updateProgress = (percent: number) => {
        setEntries(prev =>
          prev.map(entry =>
            entry.id === id
              ? {
                  ...entry,
                  progress: percent,
                  status: percent >= 100 ? 'success' : 'uploading',
                  completedAt: percent >= 100 ? new Date() : entry.completedAt
                }
              : entry
          )
        );
        options.onProgress?.({ percent });
      };

      const abortListener = () => {
        controller.abort();
        setEntries(prev =>
          prev.map(entry =>
            entry.id === id
              ? {
                  ...entry,
                  status: 'cancelled',
                  errorMessage: '사용자 취소'
                }
              : entry
          )
        );
        message.warning(`업로드 취소됨: ${file.name}`);
      };

      if (options.signal) {
        if (options.signal.aborted) {
          abortListener();
          return;
        }
        options.signal.addEventListener('abort', abortListener, { once: true });
      }

      try {
        await uploadRoutingFileChunks({
          routingId: routing.id,
          file,
          fileType: inferFileType(file.name),
          uploadedBy,
          isPrimary: false,
          signal: controller.signal,
          onProgress: progress => {
            const percent = Math.round((progress.loadedBytes / progress.totalBytes) * 100);
            updateProgress(Math.min(100, Math.max(0, percent)));
          }
        });

        updateProgress(100);
        message.success(`업로드 완료: ${file.name}`);
        options.onSuccess?.({}, file);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        const description = err instanceof Error ? err.message : '알 수 없는 오류';
        setEntries(prev =>
          prev.map(entry =>
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
        message.error(`업로드 실패: ${description}`);
        options.onError?.(err as Error);
      } finally {
        options.signal?.removeEventListener('abort', abortListener);
      }
    }
  }), [routing]);

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
        <p className="ant-upload-text">Drag & drop files here or click to browse</p>
        <p className="ant-upload-hint text-xs text-gray-500">
          지원 확장자: NC, Esprit, meta.json 등 · 업로드 시 checksum 검증이 수행됩니다.
        </p>
      </Upload.Dragger>
      {entries.length ? (
        <>
          <div className="flex items-center justify-between">
            <Text type="secondary">
              Active uploads: {entries.filter(entry => entry.status === 'uploading').length}
            </Text>
            <Button size="small" onClick={clearCompleted} disabled={!entries.some(entry => entry.status === 'success')}>
              Clear completed
            </Button>
          </div>
          <List
            dataSource={entries}
            renderItem={entry => (
              <List.Item>
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Text strong ellipsis className="block">
                        {entry.name}
                      </Text>
                      <Paragraph type="secondary" className="mb-0 text-xs">
                        {formatSize(entry.size)} · Routing {entry.routingCode} · {entry.status}
                      </Paragraph>
                      {entry.errorMessage ? (
                        <Text type="danger" className="text-xs">
                          {entry.errorMessage}
                        </Text>
                      ) : null}
                    </div>
                    <div className="w-40">
                      <Progress
                        percent={Math.min(100, Math.max(0, Math.round(entry.progress)))}
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
        <Empty description="No uploads yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
