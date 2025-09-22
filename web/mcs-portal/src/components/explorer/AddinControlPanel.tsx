'use client';

import { Badge, Button, Empty, Input, Modal, Segmented, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import type { AddinJob, AddinJobStatus, ExplorerRouting } from '@/types/explorer';

const { Text } = Typography;

export type SignalRConnectionState = 'connected' | 'reconnecting' | 'disconnected';

type StatusFilter = AddinJobStatus | 'all';

const STATUS_LABEL: Record<AddinJobStatus, string> = {
  queued: '대기',
  running: '진행 중',
  succeeded: '성공',
  failed: '실패',
  cancelled: '취소'
};

const STATUS_TAG: Record<AddinJobStatus, 'default' | 'processing' | 'success' | 'warning' | 'error'> = {
  queued: 'default',
  running: 'processing',
  succeeded: 'success',
  failed: 'error',
  cancelled: 'warning'
};

export interface AddinControlPanelProps {
  jobs: AddinJob[];
  selectedRouting: ExplorerRouting | null;
  onQueueJob: () => void;
  onRetryJob: (jobId: string) => void;
  onCancelJob: (jobId: string) => void;
  connectionState: SignalRConnectionState;
  onReconnect: () => void;
}

export default function AddinControlPanel({
  jobs,
  selectedRouting,
  onQueueJob,
  onRetryJob,
  onCancelJob,
  connectionState,
  onReconnect
}: AddinControlPanelProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filteredJobs = useMemo(() => {
    const lower = search.toLowerCase();
    return jobs.filter(job => {
      const statusMatch = statusFilter === 'all' ? true : job.status === statusFilter;
      const textMatch = lower
        ? [job.routingCode, job.itemName, job.revisionCode, job.requestedBy, job.lastMessage ?? '']
            .join(' ')
            .toLowerCase()
            .includes(lower)
        : true;
      return statusMatch && textMatch;
    });
  }, [jobs, search, statusFilter]);

  const columns = useMemo<ColumnsType<AddinJob>>(
    () => [
      {
        title: 'Routing',
        dataIndex: 'routingCode',
        key: 'routingCode',
        render: (_, record) => (
          <div className="flex flex-col">
            <Text strong>{record.routingCode}</Text>
            <Text type="secondary" className="text-xs">
              {record.itemName} · Rev {record.revisionCode}
            </Text>
          </div>
        )
      },
      {
        title: '상태',
        dataIndex: 'status',
        key: 'status',
        render: (status: AddinJobStatus) => <Tag color={STATUS_TAG[status]}>{STATUS_LABEL[status]}</Tag>
      },
      {
        title: '요청자',
        dataIndex: 'requestedBy',
        key: 'requestedBy'
      },
      {
        title: '생성',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: value => new Date(value).toLocaleString()
      },
      {
        title: '메시지',
        dataIndex: 'lastMessage',
        key: 'lastMessage',
        render: value => value ?? '—'
      },
      {
        title: '액션',
        key: 'actions',
        render: (_, record) => {
          const retryVisible = record.status === 'failed' || record.status === 'cancelled';
          const cancelVisible = record.status === 'queued' || record.status === 'running';
          if (!retryVisible && !cancelVisible) {
            return <Text type="secondary">-</Text>;
          }
          return (
            <Space>
              {retryVisible && (
                <Button
                  size="small"
                  onClick={() => {
                    Modal.confirm({
                      title: '재시도 확인',
                      content: `${record.routingCode} 작업을 재시도하시겠습니까?`,
                      okText: '재시도',
                      cancelText: '취소',
                      onOk: () => onRetryJob(record.id)
                    });
                  }}
                >
                  재시도
                </Button>
              )}
              {cancelVisible && (
                <Button
                  danger
                  size="small"
                  onClick={() => {
                    Modal.confirm({
                      title: '취소 확인',
                      content: `${record.routingCode} 작업을 취소하시겠습니까?`,
                      okText: '취소',
                      cancelText: '닫기',
                      onOk: () => onCancelJob(record.id)
                    });
                  }}
                >
                  취소
                </Button>
              )}
            </Space>
          );
        }
      }
    ],
    [onCancelJob, onRetryJob]
  );

  const connectionBadge = (() => {
    switch (connectionState) {
      case 'connected':
        return <Badge status="success" text="SignalR 연결됨" />;
      case 'reconnecting':
        return <Badge status="warning" text="재연결 중" />;
      case 'disconnected':
      default:
        return <Badge status="error" text="연결 끊김" />;
    }
  })();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {connectionBadge}
        <Space wrap>
          <Input.Search
            placeholder="Routing/요청자 검색"
            value={search}
            allowClear
            onChange={event => setSearch(event.target.value)}
            style={{ width: 200 }}
          />
          <Segmented
            value={statusFilter}
            onChange={value => setStatusFilter(value as StatusFilter)}
            options={[
              { label: '전체', value: 'all' },
              { label: STATUS_LABEL.queued, value: 'queued' },
              { label: STATUS_LABEL.running, value: 'running' },
              { label: STATUS_LABEL.succeeded, value: 'succeeded' },
              { label: STATUS_LABEL.failed, value: 'failed' },
              { label: STATUS_LABEL.cancelled, value: 'cancelled' }
            ]}
          />
          <Tooltip title={connectionState === 'connected' ? '정상 연결 상태입니다.' : 'SignalR 재연결을 시도합니다.'}>
            <Button onClick={onReconnect} loading={connectionState === 'reconnecting'}>
              재연결 시도
            </Button>
          </Tooltip>
          <Button type="primary" onClick={onQueueJob} disabled={!selectedRouting}>
            Add-in 작업 추가
          </Button>
        </Space>
      </div>
      {filteredJobs.length ? (
        <Table<AddinJob>
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={filteredJobs}
          pagination={{ pageSize: 5, showSizeChanger: false }}
        />
      ) : (
        <Empty description="표시할 Add-in 작업이 없습니다" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}