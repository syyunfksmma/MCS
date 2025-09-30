'use client';

import { Card, Col, Empty, List, Row, Segmented, Skeleton, Statistic, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummary } from '@/lib/api/dashboard';
import type { DashboardBreakdownItem, DashboardRange, DashboardSummary } from '@/types/dashboard';

const { Title, Text } = Typography;

const ranges: DashboardRange[] = ['daily', 'weekly', 'monthly'];

export default function DashboardPage() {
  const [range, setRange] = useState<DashboardRange>('daily');

  const { data, isLoading, isError } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary', range],
    queryFn: () => fetchDashboardSummary(range, true),
    staleTime: 15_000
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ marginBottom: 0 }}>
            생산 현황 대시보드
          </Title>
          <Text type="secondary">최근 작업 KPI와 SLA 지표를 한눈에 확인하세요.</Text>
        </Col>
        <Col>
          <Segmented
            options={ranges.map((value) => ({ label: value.toUpperCase(), value }))}
            value={range}
            onChange={(value) => setRange(value as DashboardRange)}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        {isLoading ? (
          <Col span={24}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Col>
        ) : isError || !data ? (
          <Col span={24}>
            <Card>
              <Empty description="대시보드 데이터를 불러오지 못했습니다." />
            </Card>
          </Col>
        ) : (
          <>
            <Col xs={24} md={8}>
              <Card bordered={false} title="미할당">
                <Statistic value={data.totals.unassigned} suffix="건" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} title="진행 중">
                <Statistic value={data.totals.inProgress} suffix="건" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} title="완료">
                <Statistic value={data.totals.completed} suffix="건" />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="SLA 측정" bordered={false}>
                <List size="small">
                  <List.Item>
                    <Text strong>목표</Text>
                    <Tag color="blue">{data.sla.targetMs} ms</Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>P95</Text>
                    <Tag color={data.sla.p95Ms > data.sla.targetMs ? 'volcano' : 'green'}>
                      {data.sla.p95Ms} ms
                    </Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>P99</Text>
                    <Tag color={data.sla.p99Ms > data.sla.targetMs ? 'volcano' : 'green'}>
                      {data.sla.p99Ms} ms
                    </Tag>
                  </List.Item>
                </List>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="기간" bordered={false}>
                <List size="small">
                  <List.Item>
                    <Text strong>범위</Text>
                    <Tag>{data.period.range.toUpperCase()}</Tag>
                  </List.Item>
                  <List.Item>
                    <Text strong>시작</Text>
                    <Text>{new Date(data.period.start).toLocaleString()}</Text>
                  </List.Item>
                  <List.Item>
                    <Text strong>종료</Text>
                    <Text>{new Date(data.period.end).toLocaleString()}</Text>
                  </List.Item>
                </List>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="담당자별 작업" bordered={false}>
                {renderBreakdownList(data.breakdown?.byOwner)}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="설비별 작업" bordered={false}>
                {renderBreakdownList(data.breakdown?.byMachine)}
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}

function renderBreakdownList(items?: DashboardBreakdownItem[] | null) {
  if (!items || items.length === 0) {
    return <Empty description="데이터 없음" />;
  }

  return (
    <List
      size="small"
      dataSource={items}
      renderItem={(item) => (
        <List.Item>
          <Text>{item.key}</Text>
          <Tag>{item.count}</Tag>
        </List.Item>
      )}
    />
  );
}
