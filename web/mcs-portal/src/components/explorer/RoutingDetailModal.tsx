'use client';\r\n\r\nimport { useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  Tabs,
  Descriptions,
  Empty,
  List,
  Typography,
  Space,
  Spin,
  Alert,
  Progress,
  Timeline
} from 'antd';
import type { ExplorerRouting } from '@/types/explorer';
import { useRoutingDetail } from '@/hooks/useRoutingDetail';

interface RoutingDetailModalProps {
  open: boolean;
  routingId: string | null;
  fallbackRouting?: ExplorerRouting | null;
  onClose: () => void;
  onTabChange?: (tabKey: string) => void;
  fetchStartedAt?: number | null;
  onMeasured?: (ms: number, source: 'api' | 'mock') => void;
  onError?: (error: Error) => void;
}

const { Paragraph, Text } = Typography;

export default function RoutingDetailModal({
  open,
  routingId,
  fallbackRouting,
  onClose,
  onTabChange,
  fetchStartedAt,
  onMeasured,
  onError
}: RoutingDetailModalProps) {
  const { data, isLoading, isError, error } = useRoutingDetail(routingId, { fallbackRouting });
  const measurementGuardRef = useRef<string | null>(null);

  const effectiveRouting = data?.routing ?? fallbackRouting ?? null;
  const uploads = data?.uploads ?? [];
  const history = data?.history ?? [];

  useEffect(() => {
    if (!open) {
      measurementGuardRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (isError && error instanceof Error && onError) {
      onError(error);
    }
  }, [isError, error, onError]);

  useEffect(() => {
    if (!open || !data || !effectiveRouting || !onMeasured) {
      return;
    }
    if (measurementGuardRef.current === effectiveRouting.id) {
      return;
    }
    const measured =
      data.slaMs ??
      (typeof performance !== 'undefined' && fetchStartedAt !== null && fetchStartedAt !== undefined
        ? Math.round(performance.now() - fetchStartedAt)
        : undefined);
    if (measured !== undefined) {
      onMeasured(measured, data.source === 'api' ? 'api' : 'mock');
      measurementGuardRef.current = effectiveRouting.id;
    }
  }, [open, data, effectiveRouting, fetchStartedAt, onMeasured]);

  const overviewContent = effectiveRouting ? (
    <Descriptions column={1} size="small" bordered>
      <Descriptions.Item label="Routing Code">{effectiveRouting.code}</Descriptions.Item>
      <Descriptions.Item label="Status">{effectiveRouting.status}</Descriptions.Item>
      <Descriptions.Item label="CAM Revision">{effectiveRouting.camRevision}</Descriptions.Item>
      <Descriptions.Item label="Owner">{effectiveRouting.owner ?? 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Shared Drive">{effectiveRouting.sharedDrivePath ?? 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Shared Drive Ready">
        {effectiveRouting.sharedDriveReady ? 'Yes' : 'No'}
      </Descriptions.Item>
      <Descriptions.Item label="Created At">
        {effectiveRouting.createdAt ? new Date(effectiveRouting.createdAt).toLocaleString() : 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Notes">{effectiveRouting.notes ?? 'N/A'}</Descriptions.Item>
    </Descriptions>
  ) : (
    <Empty description="Routing 정보가 선택되지 않았습니다." />
  );

  const uploadsContent = effectiveRouting ? (
    uploads.length ? (
      <List
        dataSource={uploads}
        bordered
        renderItem={item => {
          const percent = Math.round(Math.min(Math.max(item.progress * 100, 0), 100));
          const status = item.state === 'failed' ? 'exception' : item.state === 'completed' ? 'success' : 'active';
          return (
            <List.Item key={item.fileId}>
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.fileName}</span>
                  <Text type="secondary">{item.state}</Text>
                </div>
                <Progress percent={percent} status={status} showInfo />
                {item.checksum ? (
                  <Text type="secondary">Checksum: {item.checksum}</Text>
                ) : null}
                {item.updatedAt ? (
                  <Text type="secondary">Updated: {new Date(item.updatedAt).toLocaleString()}</Text>
                ) : null}
              </div>
            </List.Item>
          );
        }}
      />
    ) : (
      <Empty description="첨부된 파일이 없습니다." />
    )
  ) : (
    <Empty description="Routing 정보가 선택되지 않았습니다." />
  );

  const historyContent = history.length ? (
    <Timeline
      items={history.map(event => ({
        color: event.action.toLowerCase().includes('fail') ? 'red' : 'blue',
        children: (
          <Space direction="vertical" size={2} className="w-full">
            <Text strong>{event.action}</Text>
            <Text type="secondary">
              {new Date(event.timestamp).toLocaleString()} · {event.actor}
            </Text>
            {event.description ? <Paragraph className="mb-0">{event.description}</Paragraph> : null}
          </Space>
        )
      }))}
    />
  ) : (
    <Space direction="vertical" size="middle" className="w-full">
      <Empty description="히스토리 타임라인은 백엔드 계약 확정 후 연결됩니다." />
      <Paragraph type="secondary" className="mb-0">
        Telemetry channel: <code>routing-detail.history</code> — Flow I/QA에서 재사용할 수 있도록 stub을 유지합니다.
      </Paragraph>
    </Space>
  );

  const tabItems = useMemo(
    () => [
      { key: 'overview', label: 'Overview', children: overviewContent },
      { key: 'files', label: 'File Assets', children: uploadsContent },
      { key: 'history', label: 'History', children: historyContent }
    ],
    [overviewContent, uploadsContent, historyContent]
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      destroyOnClose
      maskClosable={false}
      width={760}
      title={effectiveRouting ? `${effectiveRouting.code} Detail` : 'Routing Detail'}
      footer={null}
    >
      {isError && error instanceof Error ? (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="Routing detail 로드에 실패했습니다."
          description={error.message}
        />
      ) : null}
      {data?.slaMs ? (
        <Paragraph type="secondary" className="mb-4">
          Last fetch SLA: {data.slaMs} ms ({data.source}).
        </Paragraph>
      ) : null}
      {isLoading && !data ? (
        <div className="flex justify-center py-10">
          <Spin tip="Loading routing detail" />
        </div>
      ) : (
        <Tabs
          defaultActiveKey="overview"
          items={tabItems}
          onChange={key => onTabChange?.(key)}
        />
      )}
    </Modal>
  );
}

