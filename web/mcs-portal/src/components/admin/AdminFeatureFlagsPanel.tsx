'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Segmented,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ThunderboltOutlined } from '@ant-design/icons';
import {
  EnvironmentMessage,
  FeatureFlag,
  fetchEnvironmentMessages,
  fetchFeatureFlags,
  updateEnvironmentMessage,
  updateFeatureFlag
} from '@/lib/admin';

const { Paragraph, Text, Title } = Typography;

interface AdminFeatureFlagsPanelProps {
  environments?: EnvironmentMessage[];
}

export default function AdminFeatureFlagsPanel({
  environments
}: AdminFeatureFlagsPanelProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [envMessages, setEnvMessages] = useState<EnvironmentMessage[]>(
    environments ?? []
  );
  const [loading, setLoading] = useState(false);
  const [environmentFilter, setEnvironmentFilter] = useState<
    'all' | EnvironmentMessage['environment']
  >('all');
  const [messageModal, setMessageModal] = useState<EnvironmentMessage | null>(
    null
  );
  const [messageForm] = Form.useForm<{ message: string; active: boolean }>();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [flagData, envData] = await Promise.all([
        fetchFeatureFlags(),
        fetchEnvironmentMessages()
      ]);
      setFlags(flagData);
      setEnvMessages(envData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (environments?.length) {
      fetchFeatureFlags().then(setFlags);
      return;
    }
    void loadData();
  }, [environments, loadData]);

  const toggleFlag = useCallback(
    async (flag: FeatureFlag, enabled: boolean) => {
      setLoading(true);
      try {
        const updated = await updateFeatureFlag({
          id: flag.id,
          enabled,
          rolloutPercentage: enabled ? flag.rolloutPercentage || 100 : 0
        });
        setFlags((prev) =>
          prev.map((item) => (item.id === flag.id ? updated : item))
        );
        message.success(
          `${flag.name} 플래그가 ${enabled ? '활성화' : '비활성화'}되었습니다.`
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateRollout = useCallback(
    async (flag: FeatureFlag, rollout: number) => {
      setLoading(true);
      try {
        const updated = await updateFeatureFlag({
          id: flag.id,
          enabled: flag.enabled,
          rolloutPercentage: rollout
        });
        setFlags((prev) =>
          prev.map((item) => (item.id === flag.id ? updated : item))
        );
        message.success(`${flag.name} rollout ${rollout}%로 변경되었습니다.`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const filteredEnvMessages = useMemo(() => {
    if (environmentFilter === 'all') return envMessages;
    return envMessages.filter((item) => item.environment === environmentFilter);
  }, [envMessages, environmentFilter]);

  const flagColumns = useMemo<ColumnsType<FeatureFlag>>(
    () => [
      {
        title: '플래그',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.name}</Text>
            <Text type="secondary" className="text-xs">
              {record.key}
            </Text>
          </Space>
        )
      },
      {
        title: '상태',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (_, record) => (
          <Switch
            checked={record.enabled}
            onChange={(checked) => toggleFlag(record, checked)}
            aria-label={`${record.name} 기능 토글`}
          />
        )
      },
      {
        title: 'Rollout %',
        dataIndex: 'rolloutPercentage',
        key: 'rolloutPercentage',
        render: (_, record) => (
          <Segmented
            value={record.rolloutPercentage}
            options={[0, 25, 50, 75, 100]}
            onChange={(value) => updateRollout(record, Number(value))}
          />
        )
      },
      {
        title: '소유자',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: '업데이트',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (value) => new Date(value).toLocaleString()
      }
    ],
    [toggleFlag, updateRollout]
  );

  const activeFlags = flags.filter((flag) => flag.enabled).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Title level={4} className="mb-1">
            Feature Flag & 환경 메시지
          </Title>
          <Text type="secondary">
            플래그 토글과 환경 배너 메시지를 관리합니다.
          </Text>
        </div>
        <Space>
          <Badge status="success" text={`활성 플래그 ${activeFlags}개`} />
          <Button
            icon={<ThunderboltOutlined />}
            onClick={() => void loadData()}
          >
            데이터 새로고침
          </Button>
        </Space>
      </div>

      <Card title="Feature Flags" bordered>
        <Table<FeatureFlag>
          rowKey="id"
          columns={flagColumns}
          dataSource={flags}
          loading={loading}
          pagination={{ pageSize: 5, showSizeChanger: false }}
        />
      </Card>

      <Card
        title="환경 메시지"
        bordered
        extra={
          <Segmented
            value={environmentFilter}
            onChange={(value) =>
              setEnvironmentFilter(value as typeof environmentFilter)
            }
            options={[
              { label: '전체', value: 'all' },
              { label: 'Dev', value: 'dev' },
              { label: 'Stage', value: 'stage' },
              { label: 'Prod', value: 'prod' }
            ]}
          />
        }
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {filteredEnvMessages.map((item) => (
            <Alert
              key={item.id}
              type={item.active ? 'info' : 'warning'}
              showIcon
              message={
                <Space>
                  <Tag
                    color={
                      item.environment === 'prod'
                        ? 'red'
                        : item.environment === 'stage'
                          ? 'orange'
                          : 'blue'
                    }
                  >
                    {item.environment.toUpperCase()}
                  </Tag>
                  {item.message}
                </Space>
              }
              description={
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary">
                    마지막 수정: {new Date(item.updatedAt).toLocaleString()}
                  </Text>
                  <Space>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        messageForm.setFieldsValue({
                          message: item.message,
                          active: item.active
                        });
                        setMessageModal(item);
                      }}
                    >
                      편집
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        message.info(
                          `${item.environment.toUpperCase()} 알림 테스트 전송 (Mock)`
                        )
                      }
                    >
                      테스트 전송
                    </Button>
                  </Space>
                </Space>
              }
            />
          ))}
          {!filteredEnvMessages.length && (
            <Paragraph type="secondary">
              선택한 환경에 메시지가 없습니다.
            </Paragraph>
          )}
        </Space>
      </Card>

      <Modal
        open={Boolean(messageModal)}
        title={`${messageModal?.environment.toUpperCase()} 환경 메시지 편집`}
        okText="저장"
        onCancel={() => setMessageModal(null)}
        onOk={async () => {
          const values = await messageForm.validateFields();
          setLoading(true);
          try {
            const updated = await updateEnvironmentMessage({
              id: messageModal!.id,
              message: values.message,
              active: values.active
            });
            setEnvMessages((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            );
            message.success(
              `${messageModal?.environment.toUpperCase()} 메시지를 업데이트했습니다.`
            );
            setMessageModal(null);
          } finally {
            setLoading(false);
          }
        }}
        destroyOnClose
      >
        <Form form={messageForm} layout="vertical" preserve={false}>
          <Form.Item
            label="메시지"
            name="message"
            rules={[{ required: true, message: '환경 메시지를 입력하세요.' }]}
          >
            <Input.TextArea rows={4} maxLength={200} showCount />
          </Form.Item>
          <Form.Item label="활성화" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
