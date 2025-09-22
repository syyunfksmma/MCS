'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CopyOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  AdminApiKey,
  ApiKeyScope,
  fetchAdminApiKeys,
  issueAdminApiKey,
  revokeAdminApiKey
} from '@/lib/admin';

const { Paragraph, Text, Title } = Typography;

const scopeOptions: { label: string; value: ApiKeyScope; description: string }[] = [
  { label: 'Workspace', value: 'workspace', description: 'Workspace 전용 읽기/쓰기 권한' },
  { label: 'Admin', value: 'admin', description: '관리자 API 전체 권한' },
  { label: 'Ops', value: 'ops', description: '운영 대시보드 전용 권한' }
];

interface AdminApiKeysPanelProps {
  createdBy?: string;
}

interface IssueModalState {
  open: boolean;
}

interface RevokeModalState {
  key: AdminApiKey;
}

const formatDate = (value: string) => new Date(value).toLocaleDateString();
const formatDateTime = (value: string) => new Date(value).toLocaleString();
const formatRelative = (value?: string) => {
  if (!value) return '사용 이력 없음';
  const deltaMs = Date.now() - new Date(value).getTime();
  if (Number.isNaN(deltaMs)) return '기록 없음';
  const deltaMinutes = Math.round(deltaMs / (60 * 1000));
  if (deltaMinutes < 1) return '방금';
  if (deltaMinutes < 60) return `${deltaMinutes}분 전`;
  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}시간 전`;
  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays}일 전`;
};

export default function AdminApiKeysPanel({ createdBy = 'admin.user' }: AdminApiKeysPanelProps) {
  const [keys, setKeys] = useState<AdminApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [issueModal, setIssueModal] = useState<IssueModalState | null>(null);
  const [revokeModal, setRevokeModal] = useState<RevokeModalState | null>(null);
  const [issueForm] = Form.useForm<{ label: string; scope: ApiKeyScope; expiresIn: number }>();
  const [revokeForm] = Form.useForm<{ reason: string; confirmation: string }>();
  const [issuedKey, setIssuedKey] = useState<{ label: string; plaintext: string } | null>(null);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminApiKeys();
      setKeys(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadKeys();
  }, [loadKeys]);

  const activeCount = useMemo(() => keys.filter(key => key.status === 'active').length, [keys]);

  const columns = useMemo<ColumnsType<AdminApiKey>>(
    () => [
      {
        title: '레이블',
        dataIndex: 'label',
        key: 'label',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.label}</Text>
            <Text type="secondary" className="text-xs">
              {record.maskedKey}
            </Text>
          </Space>
        )
      },
      {
        title: '스코프',
        dataIndex: 'scope',
        key: 'scope',
        render: scope => {
          const option = scopeOptions.find(item => item.value === scope);
          return <Tag color={scope === 'admin' ? 'red' : scope === 'workspace' ? 'blue' : 'purple'}>{option?.label ?? scope}</Tag>;
        }
      },
      {
        title: '생성/만료',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Text>{formatDateTime(record.createdAt)}</Text>
            <Text type="secondary" className="text-xs">
              만료: {formatDate(record.expiresAt)}
            </Text>
          </Space>
        )
      },
      {
        title: '최근 사용',
        dataIndex: 'lastUsedAt',
        key: 'lastUsedAt',
        render: value => formatRelative(value)
      },
      {
        title: '상태',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <Tag color={status === 'active' ? 'green' : 'default'}>{status === 'active' ? '활성' : '폐기됨'}</Tag>
        )
      },
      {
        title: '액션',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Tooltip title="키 복사">
              <Button
                icon={<CopyOutlined />}
                size="small"
                disabled={record.status !== 'active'}
                onClick={() => {
                  void navigator.clipboard.writeText(record.maskedKey);
                  message.success('마스킹된 키를 복사했습니다. 실제 키는 발급 시에만 확인 가능합니다.');
                }}
              />
            </Tooltip>
            <Tooltip title="API 키 폐기">
              <Button
                size="small"
                danger
                disabled={record.status !== 'active'}
                onClick={() => {
                  revokeForm.resetFields();
                  setRevokeModal({ key: record });
                }}
              >
                폐기
              </Button>
            </Tooltip>
          </Space>
        )
      }
    ],
    [revokeForm]
  );

  const openIssueModal = () => {
    issueForm.setFieldsValue({ scope: 'workspace', expiresIn: 30 });
    setIssueModal({ open: true });
  };

  const handleIssue = async () => {
    const values = await issueForm.validateFields();
    const expiresAt = new Date(Date.now() + values.expiresIn * 24 * 60 * 60 * 1000).toISOString();
    const confirmResult = await new Promise<boolean>(resolve => {
      Modal.confirm({
        title: 'API 키 발급 확인',
        icon: <ExclamationCircleOutlined />,
        content: (
          <Space direction="vertical">
            <Text>레이블: {values.label}</Text>
            <Text>스코프: {values.scope}</Text>
            <Text>만료일: {formatDate(expiresAt)}</Text>
            <Text type="secondary">확인을 누르면 새 API 키가 생성되며, 이번 화면에서만 전체 키가 노출됩니다.</Text>
          </Space>
        ),
        okText: '발급',
        cancelText: '취소',
        onOk: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
    if (!confirmResult) return;

    setLoading(true);
    try {
      const { apiKey, plaintextKey } = await issueAdminApiKey({
        label: values.label,
        scope: values.scope,
        expiresAt,
        createdBy
      });
      setKeys(prev => [apiKey, ...prev]);
      setIssuedKey({ label: values.label, plaintext: plaintextKey });
      message.success('API 키를 발급했습니다. 반드시 안전한 곳에 저장하세요.');
      setIssueModal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeModal) return;
    const { reason, confirmation } = await revokeForm.validateFields();
    if (confirmation !== 'DELETE') {
      revokeForm.setFields([{ name: 'confirmation', errors: ['DELETE 를 정확히 입력하세요.'] }]);
      return;
    }
    setLoading(true);
    try {
      await revokeAdminApiKey({ id: revokeModal.key.id, reason });
      setKeys(prev =>
        prev.map(key =>
          key.id === revokeModal.key.id
            ? { ...key, status: 'revoked', maskedKey: `${key.maskedKey.slice(0, 9)}✱✱✱${key.maskedKey.slice(-4)}` }
            : key
        )
      );
      message.success('API 키를 폐기했습니다.');
      setRevokeModal(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Title level={4} className="mb-1">
            API Key 관리
          </Title>
          <Text type="secondary">발급/폐기 이력을 관리하고 만료 일정을 확인하세요.</Text>
        </div>
        <Space>
          <Badge status="processing" text={`활성 ${activeCount}개`} />
          <Button type="primary" icon={<PlusOutlined />} onClick={openIssueModal}>
            새 API 키 발급
          </Button>
          <Button onClick={() => void loadKeys()}>새로고침</Button>
        </Space>
      </div>

      <Alert
        type="info"
        showIcon
        message="API 키는 발급 직후에만 전체 값이 표시됩니다. 반드시 비밀 저장소에 보관하세요."
      />

      <Table<AdminApiKey>
        rowKey="id"
        columns={columns}
        dataSource={keys}
        loading={loading}
        pagination={{ pageSize: 6, showSizeChanger: false }}
        bordered
      />

      <Modal
        open={Boolean(issueModal)}
        title="새 API 키 발급"
        okText="다음"
        onCancel={() => setIssueModal(null)}
        onOk={handleIssue}
        destroyOnClose
      >
        <Form form={issueForm} layout="vertical" preserve={false}>
          <Form.Item
            label="레이블"
            name="label"
            rules={[{ required: true, message: '레이블을 입력하세요.' }]}
          >
            <Input placeholder="예: Admin Console 연동" maxLength={60} />
          </Form.Item>
          <Form.Item label="스코프" name="scope" rules={[{ required: true, message: '스코프를 선택하세요.' }]}
          >
            <Select
              options={scopeOptions.map(option => ({ label: option.label, value: option.value }))}
              placeholder="스코프 선택"
            />
          </Form.Item>
          <Form.Item
            label="만료 (일)"
            name="expiresIn"
            rules={[
              { required: true, message: '만료 일수를 입력하세요.' },
              {
                validator: (_, value) => {
                  if (typeof value !== 'number') return Promise.reject(new Error('숫자를 입력하세요.'));
                  if (value < 7) return Promise.reject(new Error('최소 7일 이상이어야 합니다.'));
                  if (value > 180) return Promise.reject(new Error('최대 180일까지 설정 가능합니다.'));
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" min={7} max={180} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={Boolean(revokeModal)}
        title="API 키 폐기"
        okText="폐기"
        okButtonProps={{ danger: true }}
        onCancel={() => setRevokeModal(null)}
        onOk={handleRevoke}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>{revokeModal?.key.label}</Text> 키를 영구 폐기합니다. 복구가 불가능하며, 애플리케이션에서 즉시 사용이 중단됩니다.
          </Paragraph>
          <Form form={revokeForm} layout="vertical" preserve={false}>
            <Form.Item label="폐기 사유" name="reason" rules={[{ required: true, message: '사유를 작성하세요.' }]}
            >
              <Input.TextArea rows={3} placeholder="예: 테스트 키 만료, 보안 사고 대응" maxLength={200} showCount />
            </Form.Item>
            <Form.Item
              label="확인"
              name="confirmation"
              tooltip="DELETE 를 입력하면 폐기가 진행됩니다."
              rules={[{ required: true, message: 'DELETE 를 입력하세요.' }]}
            >
              <Input placeholder="DELETE" />
            </Form.Item>
          </Form>
        </Space>
      </Modal>

      <Modal
        open={Boolean(issuedKey)}
        title="새 API 키"
        okText="닫기"
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setIssuedKey(null)}
        destroyOnClose
      >
        <Paragraph>
          <Text type="secondary">발급된 키는 이번 화면에서만 전체 값이 표시됩니다. 반드시 보관하세요.</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>{issuedKey?.label}</Text>
        </Paragraph>
        <Input.TextArea value={issuedKey?.plaintext ?? ''} readOnly autoSize={{ minRows: 3 }} />
        <Button
          className="mt-3"
          icon={<CopyOutlined />}
          onClick={() => {
            if (issuedKey?.plaintext) {
              void navigator.clipboard.writeText(issuedKey.plaintext);
              message.success('전체 API 키를 복사했습니다.');
            }
          }}
        >
          키 복사
        </Button>
      </Modal>
    </div>
  );
}

