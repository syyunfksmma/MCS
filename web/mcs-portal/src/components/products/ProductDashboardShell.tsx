'use client';

import { useMemo, useState } from 'react';
import type { BadgeProps } from 'antd';
import {
  Badge,
  Button,
  Empty,
  Input,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  message
} from 'antd';
import Link from 'next/link';
import { CopyOutlined } from '@ant-design/icons';
import type {
  ProductDashboardResponse,
  ProductSummary
} from '@/types/products';
import ProductFilterPanel from '@/components/products/ProductFilterPanel';

const { Title, Text } = Typography;

const SOLIDWORKS_BADGE_STATUS: Record<
  ProductSummary['solidWorksStatus'],
  BadgeProps['status']
> = {
  present: 'success',
  missing: 'error',
  unknown: 'default'
};

const SOLIDWORKS_STATUS_LABEL: Record<
  ProductSummary['solidWorksStatus'],
  string
> = {
  present: '3DM Synced',
  missing: '3DM Missing',
  unknown: '3DM Unknown'
};

interface ProductDashboardShellProps {
  initialData: ProductDashboardResponse;
}

export default function ProductDashboardShell({
  initialData
}: ProductDashboardShellProps) {
  const [query, setQuery] = useState('');
  const [apiMessage, contextHolder] = message.useMessage();

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return initialData.items;
    }

    // NOTE: Client-side filtering keeps Sprint 5 scope lean until FR-9 wires the search API.
    return initialData.items.filter((item) => {
      return (
        item.code.toLowerCase().includes(normalizedQuery) ||
        item.name.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [initialData.items, query]);

  const handleCopyPath = async (path?: string) => {
    if (!path) {
      apiMessage.warning('SolidWorks path not provided yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(path);
      apiMessage.success('Copied SolidWorks shared path.');
    } catch (error) {
      console.warn('Failed to copy SolidWorks path', error);
      apiMessage.error('Copy failed. Please copy manually.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {contextHolder}
      <section className="rounded-xl border border-slate-200 bg-sky-900/95 p-5 text-slate-50 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <Title level={3} className="!mb-0 text-white">
              Product Routing Dashboard
            </Title>
            <Text>
              Snapshot generated{' '}
              {new Date(initialData.generatedAt).toLocaleString()}
            </Text>
          </div>
          <Space size="large">
            <Statistic
              title="Products"
              value={initialData.total}
              valueStyle={{ color: '#fff' }}
            />
            <Statistic
              title="SolidWorks Linked"
              value={
                initialData.items.filter(
                  (item) => item.solidWorksStatus === 'present'
                ).length
              }
              valueStyle={{ color: '#fff' }}
            />
            <Statistic
              title="Routing Groups"
              value={initialData.items.reduce(
                (acc, item) => acc + item.routingGroupCount,
                0
              )}
              valueStyle={{ color: '#fff' }}
            />
          </Space>
        </div>
      </section>

      <div className="flex gap-6">
        <ProductFilterPanel />

        <main className="flex-1 space-y-5">
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary">Source</Text>
                <Tag
                  color={initialData.source === 'api' ? 'blue' : 'orange'}
                  className="ml-3"
                >
                  {initialData.source}
                </Tag>
              </div>
              <Tooltip title="Search across product code and name. Additional filters arrive with FR-9.">
                <div>
                  {/* NOTE: Debounce will be introduced with FR-9 when the search API is wired; current dataset is lightweight enough for direct updates. */}
                  <Input.Search
                    allowClear
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by product code or name"
                    size="large"
                    className="w-96"
                  />
                </div>
              </Tooltip>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white py-20">
              <Empty description="No products match your search." />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex h-full flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-400 hover:shadow-md"
                >
                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <Text className="text-xs uppercase tracking-wide text-slate-500">
                        Product Code
                      </Text>
                      <Title level={4} className="!mb-0">
                        {product.code}
                      </Title>
                      <Text type="secondary">{product.name}</Text>
                    </div>
                    <Badge
                      status={SOLIDWORKS_BADGE_STATUS[product.solidWorksStatus]}
                      text={SOLIDWORKS_STATUS_LABEL[product.solidWorksStatus]}
                    />
                  </header>

                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Latest Revision</dt>
                      <dd className="font-semibold">
                        {product.latestRevision ?? 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Owner</dt>
                      <dd>{product.owner ?? 'Unassigned'}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Routing Groups</dt>
                      <dd>{product.routingGroupCount}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Routings</dt>
                      <dd>{product.routingCount}</dd>
                    </div>
                  </dl>

                  <div className="rounded bg-slate-50 p-3 text-sm">
                    <Text className="block text-xs uppercase tracking-wide text-slate-500">
                      SolidWorks Shared Path
                    </Text>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <Text className="truncate font-mono text-xs text-slate-600">
                        {product.solidWorksPath ??
                          'Pending shared-drive confirmation'}
                      </Text>
                      <Tooltip title="Copy network path">
                        <Button
                          icon={<CopyOutlined />}
                          size="small"
                          type="default"
                          onClick={() => handleCopyPath(product.solidWorksPath)}
                        >
                          Copy
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  <footer className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
                    <span>
                      Updated {new Date(product.updatedAt).toLocaleString()}
                    </span>
                    <Link
                      href={`/products/${product.code}/workspace`}
                      className="text-sky-600 hover:text-sky-800"
                    >
                      View workspace
                    </Link>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
