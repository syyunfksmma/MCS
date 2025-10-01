'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  Empty,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ExplorerItem,
  ExplorerRevision,
  ExplorerRouting,
  ExplorerSource
} from '@/types/explorer';

const { Title, Text } = Typography;

interface ProductRevisionWorkspaceProps {
  product: ExplorerItem;
  generatedAt: string;
  source: ExplorerSource;
  searchParams: Record<string, string | string[] | undefined>;
}

interface RoutedColumn {
  id: string;
  title: string;
  description?: string | null;
  routings: ExplorerRouting[];
}

const STATUS_COLORS: Record<ExplorerRouting['status'], string> = {
  Draft: 'default',
  PendingApproval: 'orange',
  Approved: 'green',
  Rejected: 'red'
};

// Distribute routings into pseudo-groups so the Teamcenter-style columns have consistent width without altering backend data.
const createColumns = (revision: ExplorerRevision): RoutedColumn[] => {
  const activeGroups = revision.routingGroups.filter(
    (group) => !group.isDeleted
  );
  if (!activeGroups.length) {
    return [];
  }
  return [...activeGroups]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((group) => ({
      id: group.id,
      title: group.name,
      description: group.description,
      routings: group.routings
    }));
};

export default function ProductRevisionWorkspace({
  product,
  generatedAt,
  source,
  searchParams
}: ProductRevisionWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const revisions = product.revisions;
  const [selectedRevisionId, setSelectedRevisionId] = useState<string>(() => {
    const fromQuery =
      query.get('rev') ||
      (typeof searchParams.rev === 'string' ? searchParams.rev : undefined);
    if (!fromQuery) {
      return revisions[0]?.id ?? '';
    }
    const exists = revisions.some((rev) => rev.id === fromQuery);
    return exists ? fromQuery : (revisions[0]?.id ?? '');
  });

  useEffect(() => {
    if (!selectedRevisionId && revisions[0]) {
      setSelectedRevisionId(revisions[0].id);
    }
  }, [selectedRevisionId, revisions]);

  const selectedRevision = useMemo(() => {
    // Ensure query-selected revision falls back gracefully when dataset changes server-side.
    return (
      revisions.find((rev) => rev.id === selectedRevisionId) ?? revisions[0]
    );
  }, [revisions, selectedRevisionId]);

  useEffect(() => {
    if (!selectedRevision) {
      return;
    }
    // Keep URL in sync so stale revision links refresh automatically when navigating back.
    const currentRev = query.get('rev');
    if (currentRev === selectedRevision.id) {
      return;
    }
    const params = new URLSearchParams(query.toString());
    params.set('rev', selectedRevision.id);
    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedRevision, query, router, pathname]);

  const columns = useMemo(
    () => (selectedRevision ? createColumns(selectedRevision) : []),
    [selectedRevision]
  );

  if (!selectedRevision) {
    return <Empty description="No revisions available" className="my-10" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-slate-200 bg-sky-900/95 p-5 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <Title level={3} className="!mb-0 text-white">
              {product.code} · {product.name}
            </Title>
            <Text className="text-slate-200">
              Workspace generated {new Date(generatedAt).toLocaleString()} ·
              Source: {source}
            </Text>
          </div>
          <Space size="large" align="center">
            <div className="flex flex-col items-end">
              <Text className="text-xs uppercase tracking-wide text-sky-100">
                Active Revision
              </Text>
              <Select
                value={selectedRevision.id}
                onChange={setSelectedRevisionId}
                options={revisions.map((rev) => ({
                  label: rev.code,
                  value: rev.id
                }))}
                size="large"
              />
            </div>
            <Tooltip title="Routing group management coming with workflow phase">
              <Button icon={<PlusOutlined />} size="large" disabled>
                New Routing Group
              </Button>
            </Tooltip>
          </Space>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.length === 0 ? (
          <Card className="lg:col-span-3">
            <Empty description="No routings for this revision" />
          </Card>
        ) : (
          columns.map((column) => (
            <Card
              key={column.id}
              title={
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <Text className="font-semibold text-slate-700">
                      {column.title}
                    </Text>
                    {column.description ? (
                      <Text className="text-xs text-slate-500">
                        {column.description}
                      </Text>
                    ) : null}
                  </div>
                  <Tag color="blue">{column.routings.length} Routings</Tag>
                </div>
              }
              extra={
                <Button size="small" disabled>
                  Add Routing
                </Button>
              }
              className="min-h-[18rem] shadow-sm"
            >
              {column.routings.length === 0 ? (
                <Empty
                  description="No routing assigned"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Space direction="vertical" size="middle" className="w-full">
                  {column.routings.map((routing) => (
                    <div
                      key={routing.id}
                      className="rounded border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <header className="flex items-center justify-between">
                        <div>
                          <Text className="text-sm font-semibold">
                            {routing.code}
                          </Text>
                          <div className="text-xs text-slate-500">
                            CAM Rev {routing.camRevision}
                          </div>
                        </div>
                        <Tag color={STATUS_COLORS[routing.status]}>
                          {routing.status}
                        </Tag>
                      </header>
                      <ul className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                        {routing.files.map((file) => (
                          <li
                            key={file.id}
                            className="rounded bg-slate-100 px-2 py-1"
                          >
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Space>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

