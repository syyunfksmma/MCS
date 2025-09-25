'use client';

import { useMemo } from 'react';
import { Modal, Tabs, Empty, Descriptions, Timeline } from 'antd';
import type { ExplorerRouting } from '@/types/explorer';

interface RoutingDetailModalProps {
  open: boolean;
  routing: ExplorerRouting | null;
  onClose: () => void;
  onTabChange?: (tabKey: string) => void;
}

export default function RoutingDetailModal({
  open,
  routing,
  onClose,
  onTabChange
}: RoutingDetailModalProps) {
  const tabs = useMemo(() => {
    if (!routing) {
      return [
        {
          key: 'summary',
          label: 'Summary',
          children: <Empty description="라우팅을 선택하세요" />
        }
      ];
    }

    return [
      {
        key: 'summary',
        label: 'Summary',
        children: (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Routing Code">
              {routing.code}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {routing.status}
            </Descriptions.Item>
            <Descriptions.Item label="CAM Revision">
              {routing.camRevision}
            </Descriptions.Item>
            <Descriptions.Item label="Owner">{routing.owner}</Descriptions.Item>
          </Descriptions>
        )
      },
      {
        key: 'history',
        label: 'History',
        children: (
          <Timeline>
            <Timeline.Item color="blue">Mock · 생성됨</Timeline.Item>
            <Timeline.Item color="green">Mock · 승인됨</Timeline.Item>
          </Timeline>
        )
      },
      {
        key: 'files',
        label: 'Files',
        children: routing.files.length ? (
          <ul className="list-disc pl-5">
            {routing.files.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <Empty description="파일이 없습니다" />
        )
      }
    ];
  }, [routing]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      width={720}
      title="Routing Detail"
      destroyOnClose
    >
      <Tabs defaultActiveKey="summary" items={tabs} onChange={onTabChange} />
    </Modal>
  );
}
