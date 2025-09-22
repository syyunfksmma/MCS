'use client';

import { Card, Tabs, Empty, Typography, Spin, Alert, Timeline } from 'antd';
import { useMemo, useState } from 'react';
import TreePanel from '@/components/TreePanel';
import { ExplorerRouting, ExplorerResponse } from '@/types/explorer';
import { useExplorerData } from '@/hooks/useExplorerData';
import AddinBadge from './AddinBadge';

interface ExplorerShellProps {
  initialData: ExplorerResponse;
}

const { Paragraph, Text } = Typography;

export default function ExplorerShell({ initialData }: ExplorerShellProps) {
  const { data, isFetching, isError, error } = useExplorerData(initialData);
  const resolved = data ?? initialData;
  const { items, generatedAt, source } = resolved;
  const [selectedRouting, setSelectedRouting] = useState<ExplorerRouting | null>(null);

  const summaryItems = useMemo(
    () => [
      { label: '데이터 생성 시각', value: new Date(generatedAt).toLocaleString() },
      { label: '아이템 수', value: items.length.toString() },
      { label: '데이터 출처', value: source === 'mock' ? 'Mock' : 'API' },
      { label: '상태', value: isError ? '에러' : isFetching ? '로딩 중' : '정상' }
    ],
    [generatedAt, items.length, source, isError, isFetching]
  );

  const tabs = [
    {
      key: 'summary',
      label: '요약',
      children: selectedRouting ? (
        <div className="flex flex-col gap-2">
          <Paragraph>
            <Text strong>Routing Code:</Text> {selectedRouting.code}
          </Paragraph>
          <Paragraph>
            <Text strong>Status:</Text> {selectedRouting.status}
          </Paragraph>
          <Paragraph>
            <Text strong>CAM Revision:</Text> {selectedRouting.camRevision}
          </Paragraph>
        </div>
      ) : (
        <Empty description="라우팅을 선택하세요" />
      )
    },
    {
      key: 'history',
      label: '히스토리',
      children: <Empty description="히스토리 로딩 예정" />
    },
    {
      key: 'files',
      label: '파일',
      children: selectedRouting ? (
        <ul className="list-disc pl-5">
          {selectedRouting.files.map(file => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <Empty description="파일 목록 준비 중" />
      )
    }
  ];

  const addinBadgeStatus = selectedRouting ? 'queued' : 'idle';
  const addinBadgeMessage = selectedRouting
    ? `${selectedRouting.code} Add-in 처리 대기(Mock)`
    : '라우팅을 선택하면 Add-in 큐 상태가 표시됩니다.';

  return (
    <div className="flex gap-6">
      <TreePanel
        items={items}
        onSelect={routingId => {
          if (!routingId) {
            setSelectedRouting(null);
            return;
          }
          const next = items
            .flatMap(item => item.revisions)
            .flatMap(rev => rev.routings)
            .find(routing => routing.id === routingId) || null;
          setSelectedRouting(next);
        }}
      />
      <div className="flex-1 flex flex-col gap-4">
        <Card title="Explorer Summary" bordered>
          <div className="grid grid-cols-2 gap-3">
            {summaryItems.map(item => (
              <div key={item.label}>
                <Text strong>{item.label}:</Text> {item.value}
              </div>
            ))}
          </div>
          {isError && (
            <Alert
              className="mt-4"
              type="error"
              message="Explorer 데이터를 불러오지 못했습니다."
              description={(error as Error | undefined)?.message}
              showIcon
            />
          )}
        </Card>
        <Card bordered>
          {isFetching && !isError ? (
            <div className="flex justify-center py-10">
              <Spin tip="Explorer 데이터를 로딩 중" />
            </div>
          ) : (
            <Tabs defaultActiveKey="summary" items={tabs} />
          )}
        </Card>
        <Card title="Add-in 상태" bordered>
          <div className="flex items-center gap-4">
            <AddinBadge status={addinBadgeStatus} message={addinBadgeMessage} />
            <Text type="secondary">SignalR 연동 시 실시간 업데이트 예정</Text>
          </div>
          <Timeline className="mt-4">
            <Timeline.Item color="blue">Mock: Add-in 큐 등록 (10:00)</Timeline.Item>
            <Timeline.Item color="green">Mock: 실행 완료 (10:02)</Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </div>
  );
}
