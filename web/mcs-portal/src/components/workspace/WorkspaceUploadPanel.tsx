'use client';

import { InboxOutlined } from '@ant-design/icons';
import { Button, Empty, List, message, Progress, Typography, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ExplorerRouting } from '@/types/explorer';

const { Paragraph, Text } = Typography;

type UploadStatus = 'queued' | 'uploading' | 'success' | 'error';

interface UploadEntry {
  id: string;
  name: string;
  size: number;
  status: UploadStatus;
  progress: number;
  routingCode: string;
  startedAt: Date;
  completedAt?: Date;
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

export default function WorkspaceUploadPanel({ routing }: WorkspaceUploadPanelProps) {
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- timersRef stores interval ids for manual cleanup
      Object.values(timersRef.current).forEach(timer => window.clearInterval(timer));
    };
  }, []);

  const clearCompleted = () => {
    setEntries(prev => prev.filter(entry => entry.status !== 'success'));
  };

  const uploadProps: UploadProps = useMemo(() => ({
    name: 'workspace-upload',
    multiple: true,
    showUploadList: false,
    disabled: !routing,
    beforeUpload: _file => {
      void _file;
      if (!routing) {
        message.warning('Select a routing before uploading files.');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: options => {
      if (!routing) {
        options.onError?.(new Error('Routing not selected'));
        return;
      }
      const file = options.file as RcFile;
      const id = file.uid;
      const targetRoutingCode = routing.code;

      setEntries(prev => [
        ...prev,
        {
          id,
          name: file.name,
          size: file.size,
          status: 'uploading',
          progress: 0,
          routingCode: targetRoutingCode,
          startedAt: new Date()
        }
      ]);

      let percent = 0;
      const timer = window.setInterval(() => {
        percent = Math.min(100, percent + 10 + Math.random() * 25);
        const rounded = Math.min(99, Math.round(percent));
        setEntries(prev =>
          prev.map(entry =>
            entry.id === id
              ? {
                  ...entry,
                  status: percent >= 100 ? 'success' : 'uploading',
                  progress: percent >= 100 ? 100 : rounded,
                  completedAt: percent >= 100 ? new Date() : entry.completedAt
                }
              : entry
          )
        );
        options.onProgress?.({ percent: percent >= 100 ? 100 : rounded });
        if (percent >= 100) {
          window.clearInterval(timer);
          delete timersRef.current[id];
          options.onSuccess?.({});
        }
      }, 350);

      timersRef.current[id] = timer;
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
          Supported: NC, Esprit, meta.json placeholders (mock upload).
        </p>
      </Upload.Dragger>
      {entries.length ? (
        <>
          <div className="flex items-center justify-between">
            <Text type="secondary">Active uploads: {entries.filter(entry => entry.status === 'uploading').length}</Text>
            <Button size="small" onClick={clearCompleted} disabled={!entries.some(entry => entry.status === 'success')}>
              Clear completed
            </Button>
          </div>
          <List
            dataSource={entries}
            renderItem={entry => (
              <List.Item>
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Text strong ellipsis className="block">
                      {entry.name}
                    </Text>
                    <Paragraph type="secondary" className="mb-0 text-xs">
                      {formatSize(entry.size)} · Routing {entry.routingCode} · {entry.status === 'success' ? 'Uploaded' : 'Uploading'}
                    </Paragraph>
                  </div>
                  <div className="w-40">
                    <Progress
                      percent={Math.round(entry.progress)}
                      status={entry.status === 'success' ? 'success' : 'active'}
                      size="small"
                    />
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






