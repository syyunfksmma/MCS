'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Statistic,
  Typography,
  message
} from 'antd';
import AccessibleSelect from '../common/AccessibleSelect';
import {
  AlertOutlined,
  AreaChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { AuditLogStatistics, fetchAuditStatistics } from '@/lib/admin';

const { Text, Title } = Typography;

const timeRangeOptions = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' }
];

function resolveRange(range: string): { from: string; to: string } {
  const now = new Date();
  switch (range) {
    case '24h':
      return {
        from: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        to: now.toISOString()
      };
    case '7d':
      return {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        to: now.toISOString()
      };
    case '30d':
    default:
      return {
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: now.toISOString()
      };
  }
}

function severityToType(
  severity: string
): 'success' | 'info' | 'warning' | 'error' {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'info';
  }
}

export default function AdminAuditSummaryPanel() {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState<AuditLogStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryOptions = useMemo(() => resolveRange(timeRange), [timeRange]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditStatistics(queryOptions);
      setStats(data);
    } catch (err) {
      console.error('[AdminAuditSummaryPanel] failed to fetch statistics', err);
      setError('통계 info를 불러오지 못했습니다.');
      message.error('Failed to load audit statistics.');
    } finally {
      setLoading(false);
    }
  }, [queryOptions]);

  useEffect(() => {
    loadStats().catch(() => undefined);
  }, [loadStats]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Title level={3} className="mb-0">
          Audit Insights & Message Center
        </Title>
        <Text type="secondary">
          Surface approval SLAs and alert trends for operations.
        </Text>
      </div>
      <Space align="center" wrap className="gap-3">
        <AccessibleSelect
          id="audit-range-select"
          style={{ width: 160 }}
          value={timeRange}
          options={timeRangeOptions}
          onChange={(value) => setTimeRange(value)}
          labelText="감사 기간 범위 선택"
          optionTextOverride={timeRangeOptions.map((option) => option.label)}
        />
        <Button icon={<ReloadOutlined />} onClick={() => loadStats()}>
          새로고침
        </Button>
        {stats && (
          <Badge
            status={stats.source === 'api' ? 'processing' : 'default'}
            text={stats.source === 'api' ? 'API' : 'Mock data'}
          />
        )}
      </Space>
      <Card bordered loading={loading}>
        {stats ? (
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="전체 이벤트"
                value={stats.totalEvents}
                prefix={<AreaChartOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic title="승인 이벤트" value={stats.approvalEvents} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="반려 이벤트"
                value={stats.rejectionEvents}
                valueStyle={{
                  color: stats.rejectionEvents > 0 ? '#fa8c16' : undefined
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="평균 승인시간(시간)"
                precision={1}
                value={stats.pendingApprovalAverageHours}
                valueStyle={{
                  color:
                    stats.pendingApprovalAverageHours >= 12
                      ? '#f5222d'
                      : undefined
                }}
              />
            </Col>
          </Row>
        ) : error ? (
          <Empty description={error} />
        ) : (
          <Empty description="No statistics to display." />
        )}
      </Card>
      <Card
        title={
          <Space>
            <AlertOutlined /> <span>Alert Center</span>
          </Space>
        }
        bordered
        loading={loading}
      >
        {stats ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {stats.alerts.map((alert) => (
              <Alert
                key={alert.id}
                type={severityToType(alert.severity)}
                message={alert.title}
                description={
                  <Space direction="vertical" size={0}>
                    <Text>{alert.message}</Text>
                    <Text type="secondary">
                      {new Date(alert.createdAt).toLocaleString()}
                    </Text>
                  </Space>
                }
                showIcon
              />
            ))}
          </Space>
        ) : (
          <Empty description="No alerts to display." />
        )}
      </Card>
    </div>
  );
}
