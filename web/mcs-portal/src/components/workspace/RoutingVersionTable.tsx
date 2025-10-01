'use client';

import { Button, Space, Table, Tag, Timeline, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RoutingVersion } from '@/types/routing';

const { Text } = Typography;

interface RoutingVersionTableProps {
  versions: RoutingVersion[];
  loading?: boolean;
  onPromote?: (version: RoutingVersion) => void;
}

export default function RoutingVersionTable({ versions, loading = false, onPromote }: RoutingVersionTableProps) {
  const columns: ColumnsType<RoutingVersion> = [
    {
      title: 'Version',
      dataIndex: 'camRevision',
      key: 'camRevision'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => <Tag color={value === 'Approved' ? 'green' : value === 'Rejected' ? 'volcano' : 'gold'}>{value}</Tag>
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner?: string) => owner ?? '—'
    },
    {
      title: 'Steps / Files',
      key: 'stats',
      render: (_, record) => `${record.stepCount} / ${record.fileCount}`
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value?: string) => (value ? new Date(value).toLocaleString() : '—')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.isPrimary ? (
            <Tag color="geekblue">Primary</Tag>
          ) : (
            <Button size="small" onClick={() => onPromote?.(record)}>Primary로 지정</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey={(record) => record.versionId}
      loading={loading}
      columns={columns}
      dataSource={versions}
      expandable={{
        expandedRowRender: (record) => (
          <Timeline
            style={{ margin: '16px 0' }}
            items={record.history.map((entry) => ({
              color: entry.changeType?.toLowerCase().includes('approve') ? 'green' : undefined,
              label: new Date(entry.recordedAt).toLocaleString(),
              children: (
                <Space direction="vertical" size="small">
                  <Text strong>{entry.actor}</Text>
                  <Text type="secondary">{entry.changeType}</Text>
                  {entry.comment ? <Text>{entry.comment}</Text> : null}
                </Space>
              )
            }))}
          />
        )
      }}
      pagination={false}
    />
  );
}
