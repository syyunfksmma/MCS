'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  AdminAccount,
  AdminDirectoryGroup,
  AdminStatus,
  ADMIN_STATUS_META,
  fetchAdminAccounts,
  fetchDirectoryGroups,
  syncAdGroup
} from '@/lib/admin';

const { Text, Title } = Typography;

const STATUS_FILTER: { label: string; value: AdminStatus | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '활성', value: 'active' },
  { label: '비활성', value: 'disabled' },
  { label: '잠금', value: 'locked' }
];

interface AdminConsoleProps {
  initialAccounts?: AdminAccount[];
}

export default function AdminConsole({ initialAccounts }: AdminConsoleProps) {
  const [accounts, setAccounts] = useState<AdminAccount[]>(initialAccounts ?? []);
  const [filter, setFilter] = useState<(typeof STATUS_FILTER)[number]['value']>('all');
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<AdminDirectoryGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [accountsData, groupsData] = await Promise.all([fetchAdminAccounts(), fetchDirectoryGroups()]);
      setAccounts(accountsData);
      setGroups(groupsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialAccounts?.length) {
      fetchDirectoryGroups().then(setGroups);
      return;
    }
    void loadData();
  }, [initialAccounts, loadData]);

  const filteredAccounts = useMemo(() => {
    const lower = search.toLowerCase();
    return accounts.filter(account => {
      const statusMatch = filter === 'all' ? true : account.status === filter;
      const textMatch = lower
        ? [account.displayName, account.email, account.department, account.role].some(value =>
            value.toLowerCase().includes(lower)
          )
        : true;
      return statusMatch && textMatch;
    });
  }, [accounts, filter, search]);

  const updateAccountStatus = useCallback((account: AdminAccount, nextStatus: AdminStatus) => {
    setAccounts(prev =>
      prev.map(item =>
        item.id === account.id
          ? {
              ...item,
              status: nextStatus,
              lastUpdated: new Date().toISOString()
            }
          : item
      )
    );
  }, []);

  const openStatusModal = useCallback(
    (account: AdminAccount, nextStatus: AdminStatus) => {
      const meta = ADMIN_STATUS_META[nextStatus];
      Modal.confirm({
        title: `${account.displayName} ${meta.actionLabel}`,
        centered: true,
        okText: meta.actionLabel,
        cancelText: '취소',
        okButtonProps: {
          danger: nextStatus === 'locked' || nextStatus === 'disabled'
        },
        content: (
          <Space direction="vertical" size="small">
            <Text>{meta.description}</Text>
            <Text type="secondary">대상: {account.email}</Text>
          </Space>
        ),
        onOk: () => updateAccountStatus(account, nextStatus)
      });
    },
    [updateAccountStatus]
  );

  const buildGroupMenu = useCallback(
    (account: AdminAccount): MenuProps => ({
      items: groups.map(group => ({
        key: group.id,
        label: (
          <Space>
            <Text>{group.name}</Text>
            <Tag color={group.type === 'security' ? 'geekblue' : 'green'}>{group.type}</Tag>
          </Space>
        ),
        onClick: () => {
          syncAdGroup({ accountId: account.id, groupId: group.id }).then(() => {
            setAccounts(prev =>
              prev.map(item =>
                item.id === account.id
                  ? {
                      ...item,
                      directoryGroups: Array.from(new Set([...(item.directoryGroups ?? []), group.name]))
                    }
                  : item
              )
            );
          });
        }
      }))
    }),
    [groups]
  );

  const columns = useMemo<ColumnsType<AdminAccount>>(
    () => [
      {
        title: '사용자',
        dataIndex: 'displayName',
        key: 'displayName',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.displayName}</Text>
            <Text type="secondary" className="text-xs">
              {record.email}
            </Text>
          </Space>
        )
      },
      {
        title: '부서/역할',
        dataIndex: 'department',
        key: 'department',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Text>{record.department}</Text>
            <Text type="secondary" className="text-xs">
              {record.role}
            </Text>
          </Space>
        )
      },
      {
        title: '상태',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          const meta = ADMIN_STATUS_META[record.status];
          return <Tag color={meta.tagColor}>{meta.label}</Tag>;
        }
      },
      {
        title: 'AD 그룹',
        dataIndex: 'directoryGroups',
        key: 'directoryGroups',
        render: groupsValue =>
          groupsValue?.length ? (
            <Space wrap>
              {groupsValue.map((name: string) => (
                <Tag key={name}>{name}</Tag>
              ))}
            </Space>
          ) : (
            <Text type="secondary">미배정</Text>
          )
      },
      {
        title: '최근 업데이트',
        dataIndex: 'lastUpdated',
        key: 'lastUpdated',
        render: value => new Date(value).toLocaleString()
      },
      {
        title: '액션',
        key: 'actions',
        fixed: 'right',
        render: (_, record) => (
          <Space>
            <Dropdown menu={buildGroupMenu(record)} trigger={['click']}>
              <Button size="small">
                그룹 지정 <DownOutlined />
              </Button>
            </Dropdown>
            <Tooltip title="활성">
              <Button size="small" onClick={() => openStatusModal(record, 'active')}>
                활성
              </Button>
            </Tooltip>
            <Tooltip title="잠금">
              <Button size="small" danger onClick={() => openStatusModal(record, 'locked')}>
                잠금
              </Button>
            </Tooltip>
            <Tooltip title="비활성">
              <Button size="small" danger onClick={() => openStatusModal(record, 'disabled')}>
                비활성
              </Button>
            </Tooltip>
          </Space>
        )
      }
    ],
    [buildGroupMenu, openStatusModal]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Title level={3} className="mb-0">
          Admin Console
        </Title>
        <Text type="secondary">관리자 계정 상태와 AD 그룹을 관리합니다.</Text>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Space>
          {STATUS_FILTER.map(item => (
            <Button
              key={item.value}
              type={filter === item.value ? 'primary' : 'default'}
              size="small"
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Space>
        <Input.Search
          placeholder="이름/이메일/부서 검색"
          allowClear
          value={search}
          onChange={event => setSearch(event.target.value)}
          style={{ width: 280 }}
        />
        <Button icon={<ReloadOutlined />} onClick={() => void loadData()}>
          새로고침
        </Button>
        <Badge status="processing" text={`${filteredAccounts.length}명 표시`} />
      </div>
      <Table<AdminAccount>
        columns={columns}
        dataSource={filteredAccounts}
        loading={loading}
        rowKey="id"
        scroll={{ x: 960 }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        bordered
      />
    </div>
  );
}