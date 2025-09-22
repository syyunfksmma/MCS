'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Drawer,
  Empty,
  message,
  Space,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FileTextOutlined, ReloadOutlined, StockOutlined } from '@ant-design/icons';
import {
  ApprovalHistoryEntry,
  AuditLogEntry,
  AuditLogQueryOptions,
  AuditLogSearchResult,
  fetchApprovalHistory,
  fetchAuditLogs,
  exportAuditLogsCsv,
  resolveAuditActionMarker
} from '@/lib/admin';

const { Text, Title } = Typography;

type TimeRangePreset = '24h' | '7d' | '30d';

const severityColorMap: Record<string, string> = {
  Info: 'blue',
  Warning: 'orange',
  Critical: 'red'
};

const timeRangeOptions = [
  { label: 'Last 24 hours', value: '24h' as TimeRangePreset },
  { label: 'Last 7 days', value: '7d' as TimeRangePreset },
  { label: 'Last 30 days', value: '30d' as TimeRangePreset }
];

const CATEGORY_PRESETS = ['Approval', 'Security', 'Integration'];
const ACTION_PRESETS = ['ApprovalRequested', 'RoutingApproved', 'RoutingRejected', 'AdminLoginFailure', 'GrafanaEmbedViewed'];

interface TimelineDrawerState {
  open: boolean;
  loading: boolean;
  entries: ApprovalHistoryEntry[];
  log?: AuditLogEntry;
}

function resolveRange(range: TimeRangePreset): { from: string; to: string } {
  const now = new Date();
  switch (range) {
    case '24h':
      return { from: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), to: now.toISOString() };
    case '7d':
      return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), to: now.toISOString() };
    case '30d':
    default:
      return { from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), to: now.toISOString() };
  }
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminAuditLogPanel() {
  const [timeRange, setTimeRange] = useState<TimeRangePreset>('7d');
  const [category, setCategory] = useState<string | undefined>();
  const [action, setAction] = useState<string | undefined>();
  const [actor, setActor] = useState('');
  const [routingId, setRoutingId] = useState('');
  const [queryOptions, setQueryOptions] = useState<AuditLogQueryOptions>({ page: 1, pageSize: 25 });
  const [result, setResult] = useState<AuditLogSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineState, setTimelineState] = useState<TimelineDrawerState>({ open: false, loading: false, entries: [] });

  const effectiveOptions = useMemo(() => {
    const range = resolveRange(timeRange);
    return {
      ...queryOptions,
      ...range,
      category,
      action,
      createdBy: actor.trim() || undefined,
      routingId: routingId.trim() || undefined
    } as AuditLogQueryOptions;
  }, [queryOptions, timeRange, category, action, actor, routingId]);

  const loadData = useCallback(async (options: AuditLogQueryOptions) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLogs(options);
      setResult(data);
    } catch (err) {
      console.error('[AdminAuditLogPanel] failed to fetch audit logs', err);
      setError('Unable to load audit logs.');
      message.error('Failed to fetch audit logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(effectiveOptions).catch(() => undefined);
  }, [loadData, effectiveOptions]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>(CATEGORY_PRESETS);
    result?.items.forEach(item => set.add(item.category));
    return Array.from(set);
  }, [result]);

  const availableActions = useMemo(() => {
    const set = new Set<string>(ACTION_PRESETS);
    result?.items.forEach(item => set.add(item.action));
    return Array.from(set);
  }, [result]);

  const onTableChange = useCallback((pagination: { current?: number; pageSize?: number }) => {
    setQueryOptions(prev => ({
      ...prev,
      page: pagination.current ?? prev.page ?? 1,
      pageSize: pagination.pageSize ?? prev.pageSize
    }));
  }, []);

  const handleRefresh = useCallback(() => {
    loadData(effectiveOptions).catch(() => undefined);
  }, [loadData, effectiveOptions]);

  const handleExport = useCallback(async () => {
    try {
      const csv = await exportAuditLogsCsv(effectiveOptions);
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      downloadCsv(csv, 'audit-logs-' + ts + '.csv');
      message.success('Exported audit logs as CSV.');
    } catch (err) {
      console.error('[AdminAuditLogPanel] export failed', err);
      message.error('Failed to export audit logs.');
    }
  }, [effectiveOptions]);

  const openTimeline = useCallback(async (log: AuditLogEntry) => {
    if (!log.routingId) {
      message.info('No approval timeline is linked to this routing.');
      return;
    }
    setTimelineState({ open: true, loading: true, entries: [], log });
    try {
      const entries = await fetchApprovalHistory(log.routingId);
      setTimelineState({ open: true, loading: false, entries, log });
    } catch (err) {
      console.error('[AdminAuditLogPanel] timeline fetch failed', err);
      message.error('Failed to load approval timeline.');
      setTimelineState({ open: true, loading: false, entries: [], log });
    }
  }, []);

  const closeTimeline = useCallback(() => {
    setTimelineState({ open: false, loading: false, entries: [] });
  }, []);

  const columns: ColumnsType<AuditLogEntry> = useMemo(() => [
    {
      title: 'Timestamp',
      dataIndex: 'eventAt',
      key: 'eventAt',
      width: 200,
      render: value => new Date(value).toLocaleString()
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <span className="text-xs text-gray-500">{resolveAuditActionMarker(record.action)}</span>
          <Tag color="geekblue">{record.category}</Tag>
        </Space>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 200
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.summary}</Text>
          {record.details && <Text type="secondary" className="text-xs">{record.details}</Text>}
        </Space>
      )
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (value: string) => <Tag color={severityColorMap[value] ?? 'default'}>{value}</Tag>
    },
    {
      title: 'Actor',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 160
    },
    {
      title: 'Links',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="View approval timeline">
            <Button
              size="small"
              icon={<StockOutlined />}
              disabled={!record.routingId}
              onClick={() => openTimeline(record)}
            />
          </Tooltip>
          {record.traceId && <Tag color="default">Trace: {record.traceId}</Tag>}
        </Space>
      )
    }
  ], [openTimeline]);

  const tablePagination = useMemo(
    () => ({
      current: result?.page ?? queryOptions.page ?? 1,
      pageSize: result?.pageSize ?? queryOptions.pageSize ?? 25,
      total: result?.totalCount ?? 0,
      showSizeChanger: true,
      pageSizeOptions: [10, 25, 50, 100]
    }),
    [result, queryOptions]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Title level={3} className="mb-0">
          Audit Log
        </Title>
        <Text type="secondary">Review audit events alongside linked approval timelines.</Text>
      </div>
      <div className="flex flex-wrap items-end gap-3" role="group" aria-label="Audit log filters">
        <label className="flex flex-col text-xs gap-1 text-neutral-600">
          <span className="font-semibold">Time range</span>
          <select
            className="rounded border border-neutral-300 px-2 py-1 text-sm"
            value={timeRange}
            onChange={event => {
              setTimeRange(event.target.value as TimeRangePreset);
              setQueryOptions(prev => ({ ...prev, page: 1 }));
            }}
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs gap-1 text-neutral-600">
          <span className="font-semibold">Category</span>
          <select
            className="rounded border border-neutral-300 px-2 py-1 text-sm"
            value={category ?? ''}
            onChange={event => {
              const value = event.target.value || undefined;
              setCategory(value);
              setQueryOptions(prev => ({ ...prev, page: 1 }));
            }}
          >
            <option value="">All categories</option>
            {availableCategories.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs gap-1 text-neutral-600">
          <span className="font-semibold">Action</span>
          <select
            className="rounded border border-neutral-300 px-2 py-1 text-sm"
            value={action ?? ''}
            onChange={event => {
              const value = event.target.value || undefined;
              setAction(value);
              setQueryOptions(prev => ({ ...prev, page: 1 }));
            }}
          >
            <option value="">All actions</option>
            {availableActions.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-xs gap-1 text-neutral-600">
          <span className="font-semibold">Actor</span>
          <input
            type="text"
            className="rounded border border-neutral-300 px-2 py-1 text-sm"
            placeholder="qa.lead"
            value={actor}
            onChange={event => setActor(event.target.value)}
          />
        </label>
        <label className="flex flex-col text-xs gap-1 text-neutral-600">
          <span className="font-semibold">Routing ID</span>
          <input
            type="text"
            className="rounded border border-neutral-300 px-2 py-1 text-sm"
            value={routingId}
            onChange={event => setRoutingId(event.target.value)}
          />
        </label>
        <div className="flex items-center gap-2 pt-2">
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} htmlType="button">
            Refresh
          </Button>
          <Button icon={<FileTextOutlined />} onClick={handleExport} htmlType="button">
            Export CSV
          </Button>
          {result && (
            <Badge status={result.source === 'api' ? 'processing' : 'default'} text={result.source === 'api' ? 'API data' : 'Mock data'} />
          )}
        </div>
      </div>
      <Table<AuditLogEntry>
        rowKey="id"
        columns={columns}
        dataSource={result?.items}
        loading={loading}
        pagination={tablePagination}
        onChange={pagination => onTableChange({ current: pagination.current, pageSize: pagination.pageSize })}
        bordered
        locale={{ emptyText: error ? <Empty description={error} /> : <Empty description="No audit entries to display." /> }}
      />
      <Drawer
        title={timelineState.log ? 'Approval Timeline · ' + timelineState.log.summary : 'Approval Timeline'}
        width={520}
        onClose={closeTimeline}
        open={timelineState.open}
      >
        {timelineState.loading ? (
          <Text>Loading timeline...</Text>
        ) : timelineState.entries.length ? (
          <Timeline>
            {timelineState.entries.map(entry => (
              <Timeline.Item
                key={entry.id ?? `${entry.changeType}-${entry.createdAt}`}
                color={
                  entry.changeType === 'RoutingRejected'
                    ? 'red'
                    : entry.changeType === 'RoutingApproved'
                      ? 'green'
                      : 'blue'
                }
              >
                <Space direction="vertical" size={0}>
                  <Text strong>{entry.changeType}</Text>
                  <Text type="secondary">{new Date(entry.createdAt).toLocaleString()}</Text>
                  <Text>Actor: {entry.createdBy}</Text>
                  {entry.comment && <Text type="secondary">{entry.comment}</Text>}
                </Space>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Empty description="No linked approval timeline." />
        )}
      </Drawer>
    </div>
  );
}
