'use client';

import { useMemo, useState } from 'react';
import { Button, Checkbox, Space, Switch, Table, Tag, Timeline, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RoutingVersion } from '@/types/routing';

const { Text } = Typography;

interface RoutingVersionTableProps {
  versions: RoutingVersion[];
  loading?: boolean;
  canManage?: boolean;
  onPromote?: (version: RoutingVersion) => void;
  onToggleLegacy?: (version: RoutingVersion, hidden: boolean) => void;
}

export default function RoutingVersionTable({
  versions,
  loading = false,
  canManage = true,
  onPromote,
  onToggleLegacy
}: RoutingVersionTableProps) {
  const [showLegacy, setShowLegacy] = useState(false);

  const filteredVersions = useMemo(() => {
    if (showLegacy) {
      return versions;
    }
    return versions.filter((version) => !version.isLegacyHidden);
  }, [showLegacy, versions]);

  const columns: ColumnsType<RoutingVersion> = [
    {
      title: 'Version',
      dataIndex: 'camRevision',
      key: 'camRevision',
      render: (value: string, record) => (
        <Space size="small">
          <Text strong>{value}</Text>
          {record.isPrimary ? <Tag color="geekblue">Primary</Tag> : null}
          {record.isLegacyHidden ? <Tag color="default">Legacy hidden</Tag> : null}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <Tag color={value === 'Approved' ? 'green' : value === 'Rejected' ? 'volcano' : 'gold'}>{value}</Tag>
      )
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner?: string | null) => owner ?? '—'
    },
    {
      title: 'Steps / Files',
      key: 'stats',
      render: (_, record) => `${record.stepCount} / ${record.fileCount}`
    },
    {
      title: 'Legacy',
      key: 'legacy',
      render: (_, record) => (
        <Space size="small">
          <Switch
            size="small"
            checked={record.isLegacyHidden}
            disabled={!canManage || !onToggleLegacy}
            onChange={(checked) => onToggleLegacy?.(record, checked)}
          />
          <Text type={record.isLegacyHidden ? 'secondary' : undefined}>
            {record.isLegacyHidden ? 'Hidden' : 'Visible'}
          </Text>
        </Space>
      )
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value?: string | null) => (value ? new Date(value).toLocaleString() : '—')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.isPrimary ? null : (
            <Tooltip title={canManage ? 'Set as primary version' : '권한이 없습니다.'}>
              <Button size="small" onClick={() => onPromote?.(record)} disabled={!canManage || !onToggleLegacy}>
                Primary로 지정
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size="middle" className="w-full">
      <div className="flex items-center justify-between">
        <Checkbox checked={showLegacy} onChange={(event) => setShowLegacy(event.target.checked)}>
          Show legacy versions
        </Checkbox>
        <Text type="secondary">총 {filteredVersions.length}개 버전</Text>
      </div>
      <Table
        rowKey={(record) => record.versionId}
        loading={loading}
        columns={columns}
        dataSource={filteredVersions}
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
    </Space>
  );
}
