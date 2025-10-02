'use client';

import { useMemo, useState } from 'react';
import type { Key } from 'react';
import type { BadgeProps } from 'antd';
import {
  Badge,
  Button,
  Empty,
  Input,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import Link from 'next/link';
import { CopyOutlined } from '@ant-design/icons';
import type {
  ProductDashboardResponse,
  ProductSummary
} from '@/types/products';
import ProductFilterPanel from '@/components/products/ProductFilterPanel';
import type { ErpWorkOrder, ErpWorkOrderCollection } from '@/types/erp';
import { updateCamStatus } from '@/lib/erp';

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

const WORK_ORDER_PAGE_SIZE = 10;

function getWorkOrderRowKey(order: ErpWorkOrder): string {
  return `${order.woNo}-${order.procSeq}`;
}

interface ProductDashboardShellProps {
  initialData: ProductDashboardResponse;
  initialWorkOrders: ErpWorkOrderCollection;
}

export default function ProductDashboardShell({
  initialData,
  initialWorkOrders
}: ProductDashboardShellProps) {
  const [query, setQuery] = useState('');
  const [apiMessage, contextHolder] = message.useMessage();
  const [workOrders, setWorkOrders] = useState<ErpWorkOrder[]>(
    initialWorkOrders.workOrders
  );
  const [workOrderTimestamp, setWorkOrderTimestamp] = useState(
    initialWorkOrders.generatedAt
  );
  const [selectedWorkOrderKey, setSelectedWorkOrderKey] = useState<string | null>(
    null
  );
  const [isCamUpdating, setIsCamUpdating] = useState(false);

  const selectedWorkOrder = useMemo(() => {
    if (!selectedWorkOrderKey) {
      return null;
    }

    return (
      workOrders.find(
        (order) => getWorkOrderRowKey(order) === selectedWorkOrderKey
      ) ?? null
    );
  }, [selectedWorkOrderKey, workOrders]);

  const workOrderColumns = useMemo<ColumnsType<ErpWorkOrder>>(
    () => [
      {
        title: 'WoNo',
        dataIndex: 'woNo',
        key: 'woNo',
        sorter: (a, b) => a.woNo.localeCompare(b.woNo),
        width: 160,
        ellipsis: true
      },
      {
        title: 'ProcSeq',
        dataIndex: 'procSeq',
        key: 'procSeq',
        sorter: (a, b) => Number(a.procSeq) - Number(b.procSeq),
        width: 100
      },
      {
        title: 'ItemCd',
        dataIndex: 'itemCd',
        key: 'itemCd',
        width: 140,
        ellipsis: true
      },
      {
        title: 'OrderQty',
        dataIndex: 'orderQty',
        key: 'orderQty',
        sorter: (a, b) => Number(a.orderQty) - Number(b.orderQty),
        align: 'right',
        width: 110
      },
      {
        title: 'JobCd',
        dataIndex: 'jobCd',
        key: 'jobCd',
        width: 120,
        ellipsis: true
      },
      {
        title: 'MachNm',
        dataIndex: 'machNm',
        key: 'machNm',
        width: 220,
        ellipsis: true
      },
      {
        title: 'OperStatusNm',
        dataIndex: 'operStatusNm',
        key: 'operStatusNm',
        width: 180,
        ellipsis: true
      },
      {
        title: 'StartYn',
        dataIndex: 'startYn',
        key: 'startYn',
        align: 'center',
        width: 100,
        render: (value: string) => (
          <Tag color={value === 'Y' ? 'green' : 'default'}>{value}</Tag>
        )
      }
    ],
    []
  );

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

  const handleCamStatusUpdate = async (
    updates: Partial<Pick<ErpWorkOrder, 'is3DModeled' | 'isPgCompleted'>>
  ) => {
    if (!selectedWorkOrderKey) {
      apiMessage.warning('CAM 작업을 진행할 워크오더를 먼저 선택하세요.');
      return;
    }

    const current = workOrders.find(
      (order) => getWorkOrderRowKey(order) === selectedWorkOrderKey
    );

    if (!current) {
      setSelectedWorkOrderKey(null);
      apiMessage.warning('선택한 워크오더를 찾을 수 없습니다. 목록을 새로고침하세요.');
      return;
    }

    const payload = {
      woNo: current.woNo,
      procSeq: current.procSeq,
      itemCd: current.itemCd,
      is3DModeled: updates.is3DModeled ?? current.is3DModeled,
      isPgCompleted: updates.isPgCompleted ?? current.isPgCompleted
    };

    setIsCamUpdating(true);
    try {
      const response = await updateCamStatus(payload);

      setWorkOrders((previous) => {
        const targetKey = getWorkOrderRowKey(current);
        const next: ErpWorkOrder[] = [];

        for (const order of previous) {
          if (getWorkOrderRowKey(order) !== targetKey) {
            next.push(order);
            continue;
          }

          if (response.is3DModeled && response.isPgCompleted) {
            // Completed 작업은 선택 대상에서 제외.
            continue;
          }

          next.push({
            ...order,
            is3DModeled: response.is3DModeled,
            isPgCompleted: response.isPgCompleted
          });
        }

        return next;
      });

      setWorkOrderTimestamp(new Date().toISOString());

      if (response.is3DModeled && response.isPgCompleted) {
        setSelectedWorkOrderKey(null);
        apiMessage.success('3D 모델과 PG가 모두 완료되어 목록에서 제외했습니다.');
      } else {
        setSelectedWorkOrderKey(getWorkOrderRowKey({
          ...current,
          is3DModeled: response.is3DModeled,
          isPgCompleted: response.isPgCompleted
        }));
        apiMessage.success('CAM 상태를 업데이트했습니다.');
      }
    } catch (error) {
      console.error('Failed to update CAM status', error);
      apiMessage.error('CAM 상태 업데이트에 실패했습니다.');
    } finally {
      setIsCamUpdating(false);
    }
  };

  const workOrderSelection: TableRowSelection<ErpWorkOrder> = {
    type: 'radio',
    selectedRowKeys: selectedWorkOrderKey ? [selectedWorkOrderKey] : [],
    onChange: (keys: Key[]) => {
      setSelectedWorkOrderKey((keys[0] as string) ?? null);
    },
    getCheckboxProps: (record: ErpWorkOrder) => ({
      disabled: record.is3DModeled && record.isPgCompleted,
      title:
        record.is3DModeled && record.isPgCompleted
          ? '3D 모델과 PG 완료 항목은 추가 CAM 작업이 필요 없습니다.'
          : undefined
    })
  };

  const disable3dButton = !selectedWorkOrder || selectedWorkOrder.is3DModeled;
  const disablePgButton = !selectedWorkOrder || selectedWorkOrder.isPgCompleted;

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

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div>
            <Title level={4} className="!mb-1">
              ERP Work Orders for CAM
            </Title>
            <Space size="middle">
              <Text type="secondary">
                Source
                <Tag
                  color={initialWorkOrders.source === 'api' ? 'blue' : 'orange'}
                  className="ml-2"
                >
                  {initialWorkOrders.source}
                </Tag>
              </Text>
              <Text type="secondary">
                Updated {new Date(workOrderTimestamp).toLocaleString()}
              </Text>
            </Space>
          </div>
        </div>

        {workOrders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-16">
            <Empty description="CAM 작업 대기 중인 ERP 워크오더가 없습니다." />
          </div>
        ) : (
          <Table<ErpWorkOrder>
            rowKey={getWorkOrderRowKey}
            dataSource={workOrders}
            columns={workOrderColumns}
            pagination={{ pageSize: WORK_ORDER_PAGE_SIZE, hideOnSinglePage: true }}
            size="middle"
            rowSelection={workOrderSelection}
            scroll={{ x: 960 }}
            className="mb-4"
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          {selectedWorkOrder ? (
            <Space size="small">
              <Tag color={selectedWorkOrder.is3DModeled ? 'green' : 'default'}>
                3D 모델 {selectedWorkOrder.is3DModeled ? '완료' : '대기'}
              </Tag>
              <Tag color={selectedWorkOrder.isPgCompleted ? 'green' : 'default'}>
                PG {selectedWorkOrder.isPgCompleted ? '완료' : '대기'}
              </Tag>
              <Text type="secondary">
                {selectedWorkOrder.woNo} / 공정 {selectedWorkOrder.procSeq}
              </Text>
            </Space>
          ) : (
            <Text type="secondary">
              CAM 버튼을 활성화하려면 워크오더를 선택하세요.
            </Text>
          )}

          <Space size="small">
            <Tooltip title={disable3dButton ? '3D 모델 작업이 이미 완료되었습니다.' : '3D 모델 작업 시작'}>
              <Button
                type="primary"
                disabled={disable3dButton || isCamUpdating}
                loading={isCamUpdating && !disable3dButton}
                onClick={() => handleCamStatusUpdate({ is3DModeled: true })}
              >
                3D 모델 작업 완료 처리
              </Button>
            </Tooltip>
            <Tooltip title={disablePgButton ? 'PG 작업이 이미 완료되었습니다.' : 'PG 작업 시작'}>
              <Button
                type="default"
                disabled={disablePgButton || isCamUpdating}
                loading={isCamUpdating && !disablePgButton}
                onClick={() => handleCamStatusUpdate({ isPgCompleted: true })}
              >
                PG 작업 완료 처리
              </Button>
            </Tooltip>
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
