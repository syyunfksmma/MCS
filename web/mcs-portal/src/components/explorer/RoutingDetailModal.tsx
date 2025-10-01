'use client';

import { useMemo } from 'react';
import {
  Modal,
  Tabs,
  Empty,
  Descriptions,
  Timeline,
  Alert,
  Spin,
  Button
} from 'antd';
import type { ExplorerRouting, RoutingDetailResponse } from '@/types/explorer';

interface RoutingDetailModalProps {
  open: boolean;
  routing: ExplorerRouting | null;
  detail?: RoutingDetailResponse | null;
  loading?: boolean;
  error?: Error | null;
  activeTab: string;
  onClose: () => void;
  onRetry?: () => void;
  onTabChange?: (tabKey: string) => void;
}

const DEFAULT_TAB = 'summary';

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export default function RoutingDetailModal({
  open,
  routing,
  detail,
  loading = false,
  error = null,
  activeTab,
  onClose,
  onRetry,
  onTabChange
}: RoutingDetailModalProps) {
  const resolvedRouting = detail?.routing ?? routing;

  const tabs = useMemo(() => {
    if (!resolvedRouting) {
      return [
        { key: DEFAULT_TAB, label: 'Summary', children: <Empty description="Select a routing to view details" /> }
      ];
    }

    const historyItems = detail?.history ?? [];
    const fileItems = resolvedRouting.files ?? [];
    const uploads = detail?.uploads ?? [];
    const versionItems = versions ?? [];

    const summaryTab = {
      key: 'summary',
      label: 'Summary',
      children: (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Routing Code">{resolvedRouting.code}</Descriptions.Item>
          <Descriptions.Item label="Status">{resolvedRouting.status}</Descriptions.Item>
          <Descriptions.Item label="CAM Revision">{resolvedRouting.camRevision}</Descriptions.Item>
          <Descriptions.Item label="Owner">{resolvedRouting.owner ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Shared Drive Ready">{resolvedRouting.sharedDriveReady ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Notes">{resolvedRouting.notes ?? '—'}</Descriptions.Item>
        </Descriptions>
      )
    };

    const historyTab = {
      key: 'history',
      label: 'History',
      children: historyItems.length ? (
        <Timeline>
          {historyItems.map((event) => (
            <Timeline.Item key={event.id} color="blue">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{formatTimestamp(event.timestamp)}</span>
                <span className="text-sm">{event.action}</span>
                <span className="text-xs text-gray-500">{event.actor}</span>
                {event.description ? (
                  <span className="text-xs text-gray-500">{event.description}</span>
                ) : null}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty description="No history yet" />
      )
    };

    const filesTab = {
      key: 'files',
      label: 'Files',
      children: fileItems.length ? (
        <ul className="list-disc pl-5">
          {fileItems.map((file) => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <Empty description="No files uploaded" />
      )
    };

    const tabsList = [summaryTab, historyTab, filesTab];

    tabsList.push({
      key: 'versions',
      label: 'Versions',
      children: (
        <RoutingVersionTable
          versions={versionItems}
          loading={versionsLoading}
          onPromote={(version) => onPromoteVersion?.(version.versionId)}
        />
      )
    });

    if (uploads.length) {
      tabsList.push({
        key: 'uploads',
        label: 'Uploads',
        children: (
          <ul className="list-disc pl-5 text-sm">
            {uploads.map((upload) => (
              <li key={upload.fileId}>
                {upload.fileName} - {upload.state} - {Math.round(upload.progress)}%
              </li>
            ))}
          </ul>
        )
      });
    }

    return tabsList;
  }, [detail, onPromoteVersion, resolvedRouting, versions, versionsLoading]);
  }, [detail, resolvedRouting]);

  const handleTabChange = onTabChange ?? (() => undefined);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      title={resolvedRouting ? `Routing: ${resolvedRouting.code}` : 'Routing Detail'}
      destroyOnClose={false}
    >
      {error ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load routing detail"
          description={error.message}
          action={
            onRetry ? (
              <Button type="primary" size="small" onClick={onRetry}>
                Retry
              </Button>
            ) : null
          }
          className="mb-4"
        />
      ) : null}
      {loading ? (
        <div className="flex justify-center py-6">
          <Spin tip="Loading routing detail..." />
        </div>
      ) : null}
      <Tabs
        activeKey={tabs.some((tab) => tab.key === activeTab) ? activeTab : DEFAULT_TAB}
        items={tabs}
        onChange={handleTabChange}
      />
    </Modal>
  );
}
