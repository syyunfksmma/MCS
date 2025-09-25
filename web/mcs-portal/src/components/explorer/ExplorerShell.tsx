'use client';

import {
  Card,
  Tabs,
  Empty,
  Typography,
  Spin,
  Alert,
  Timeline,
  Input,
  List,
  Space,
  Button,
  message
} from 'antd';
import { useCallback, useMemo, useState } from 'react';
import TreePanel from '@/components/TreePanel';
import WorkspaceUploadPanel from '@/components/workspace/WorkspaceUploadPanel';
import AddinBadge from './AddinBadge';
import { useExplorerData } from '@/hooks/useExplorerData';
import { useRoutingSearch } from '@/hooks/useRoutingSearch';
import type { ExplorerRouting, ExplorerResponse } from '@/types/explorer';
import type { RoutingSearchItem, RoutingSearchResult } from '@/types/search';

interface ExplorerShellProps {
  initialData: ExplorerResponse;
}

const { Paragraph, Text } = Typography;

export default function ExplorerShell({ initialData }: ExplorerShellProps) {
  const { data, isFetching, isError, error } = useExplorerData(initialData);
  const resolved = data ?? initialData;
  const { items, generatedAt, source } = resolved;

  const [selectedRouting, setSelectedRouting] =
    useState<ExplorerRouting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<RoutingSearchResult | null>(
    null
  );
  const [lastSearchError, setLastSearchError] = useState<string | null>(null);
  const searchMutation = useRoutingSearch();

  const findRoutingById = useCallback(
    (routingId: string) =>
      items
        .flatMap((item) => item.revisions)
        .flatMap((revision) => revision.routings)
        .find((routing) => routing.id === routingId) ?? null,
    [items]
  );

  const summaryItems = useMemo(() => {
    const base = [
      {
        label: '데이터 생성 시각',
        value: new Date(generatedAt).toLocaleString()
      },
      { label: '아이템 수', value: items.length.toString() },
      { label: '데이터 출처', value: source === 'mock' ? 'Mock' : 'API' },
      {
        label: '상태',
        value: isError ? '에러' : isFetching ? '로딩 중' : '정상'
      }
    ];

    if (searchResult) {
      base.push({
        label: '최근 검색 SLA(ms)',
        value: `${searchResult.slaMs ?? '서버 미보고'} / ${searchResult.observedClientMs}`
      });
    }

    return base;
  }, [generatedAt, items.length, source, isError, isFetching, searchResult]);

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
          {selectedRouting.files.map((file) => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <Empty description="파일 목록 준비 중" />
      )
    }
  ];

  const handleSearch = useCallback(
    (rawValue?: string) => {
      const nextTerm = (rawValue ?? searchTerm).trim();
      if (!nextTerm) {
        message.info('검색어를 입력하세요.');
        return;
      }

      setSearchTerm(nextTerm);
      setLastSearchError(null);

      searchMutation.mutate(
        { term: nextTerm, pageSize: 25, slaTargetMs: 3500 },
        {
          onSuccess: (result) => {
            setSearchResult(result);
            message.success(`검색 완료 (${result.total}건)`, 1.2);
          },
          onError: (err) => {
            const description =
              err instanceof Error ? err.message : '알 수 없는 오류';
            setLastSearchError(description);
            message.error(`검색 실패: ${description}`);
          }
        }
      );
    },
    [searchTerm, searchMutation]
  );

  const handleSelectSearchRouting = useCallback(
    (routingId: string) => {
      const next = findRoutingById(routingId);
      if (!next) {
        message.warning('탐색 트리에 없는 라우팅입니다.');
        return;
      }
      setSelectedRouting(next);
    },
    [findRoutingById]
  );

  const addinBadgeStatus = selectedRouting ? 'queued' : 'idle';
  const addinBadgeMessage = selectedRouting
    ? `${selectedRouting.code} Add-in 처리 대기(Mock)`
    : '라우팅을 선택하면 Add-in 큐 상태가 표시됩니다.';

  const searchItems: RoutingSearchItem[] = searchResult?.items ?? [];

  return (
    <div className="flex gap-6">
      <TreePanel
        items={items}
        onSelect={(routingId) => {
          if (!routingId) {
            setSelectedRouting(null);
            return;
          }
          const next = findRoutingById(routingId);
          setSelectedRouting(next);
        }}
      />
      <div className="flex-1 flex flex-col gap-4">
        <Card title="Explorer Summary" bordered>
          <div className="grid grid-cols-2 gap-3">
            {summaryItems.map((item) => (
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
        <Card title="Routing Search" bordered>
          <Space direction="vertical" size="middle" className="w-full">
            <Input.Search
              placeholder="Routing 코드 / 품목 / 소유자 검색"
              value={searchTerm}
              enterButton="검색"
              loading={searchMutation.isPending}
              onChange={(event) => setSearchTerm(event.target.value)}
              onSearch={handleSearch}
              allowClear
            />
            {lastSearchError ? (
              <Alert type="error" message={lastSearchError} showIcon />
            ) : null}
            {searchResult ? (
              <div className="w-full">
                <Paragraph type="secondary" className="mb-2 text-sm">
                  서버 SLA: {searchResult.slaMs ?? '미보고'} ms / 클라이언트
                  관측: {searchResult.observedClientMs} ms · 총{' '}
                  {searchResult.total}건
                </Paragraph>
                <List
                  dataSource={searchItems}
                  bordered
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          key="open"
                          type="link"
                          onClick={() =>
                            handleSelectSearchRouting(item.routingId)
                          }
                        >
                          열기
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={`${item.routingCode} · ${item.productCode}`}
                        description={`Revision ${item.revisionCode} · 상태 ${item.status}`}
                      />
                      <Text type="secondary">
                        {item.groupName}
                        {item.updatedAt
                          ? ` · ${new Date(item.updatedAt).toLocaleString()}`
                          : ''}
                      </Text>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Paragraph type="secondary" className="mb-0 text-sm">
                검색 결과가 여기 표시됩니다. SLA는 Sprint5.1 로그에 누적
                기록됩니다.
              </Paragraph>
            )}
          </Space>
        </Card>
        <Card title="Workspace Uploads" bordered>
          <WorkspaceUploadPanel routing={selectedRouting} />
        </Card>
        <Card title="Add-in 상태" bordered>
          <div className="flex items-center gap-4">
            <AddinBadge status={addinBadgeStatus} message={addinBadgeMessage} />
            <Text type="secondary">SignalR 연동 시 실시간 업데이트 예정</Text>
          </div>
          <Timeline className="mt-4">
            <Timeline.Item color="blue">
              Mock: Add-in 큐 등록 (10:00)
            </Timeline.Item>
            <Timeline.Item color="green">Mock: 실행 완료 (10:02)</Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </div>
  );
}
