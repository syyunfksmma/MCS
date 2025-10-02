'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Form, Input, List, Select, Space, Spin, Tag, Typography, message } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEspritJobs, triggerEspritJob, type TriggerEspritJobRequest, type CreateEspritApiKeyResponse } from '@/lib/api/esprit';
import { espritKeys } from '@/lib/queryKeys';
import type { EspritJob } from '@/types/esprit';
import { useNavigation } from '@/hooks/useNavigation';

const { Text } = Typography;

const statusColor: Record<EspritJob['status'], string> = {
  queued: 'gold',
  running: 'blue',
  succeeded: 'green',
  failed: 'red'
};

interface EspritJobPanelProps {
  routingId?: string;
  routingCode?: string;
  onRequestApiKey: () => void;
  lastGeneratedKey?: CreateEspritApiKeyResponse | null;
  className?: string;
}

interface JobFormValues {
  routingId?: string;
  jobType: string;
  priority?: 'normal' | 'high';
  notes?: string;
}

export default function EspritJobPanel({
  routingId,
  routingCode,
  onRequestApiKey,
  lastGeneratedKey,
  className
}: EspritJobPanelProps) {
  const { lastRoutingId } = useNavigation();
  const [form] = Form.useForm<JobFormValues>();
  const initialRoutingId = useMemo(() => routingId ?? lastRoutingId ?? '', [routingId, lastRoutingId]);
  useEffect(() => {
    if (initialRoutingId) {
      form.setFieldsValue({ routingId: initialRoutingId });
    } else {
      form.resetFields(['routingId']);
    }
  }, [form, initialRoutingId]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const jobsQuery = useQuery({
    queryKey: espritKeys.jobs(),
    queryFn: fetchEspritJobs
  });

  const triggerMutation = useMutation({
    mutationFn: triggerEspritJob,
    onSuccess: () => {
      message.success('Esprit EDGE 작업을 큐에 등록했습니다.');
      jobsQuery.refetch();
      form.resetFields(['notes']);
    },
    onError: (error: Error) => {
      message.error(error.message);
    }
  });

  const handleSubmit = (values: JobFormValues) => {
    if (!values.routingId) {
      message.warning('Routing ID를 입력하세요.');
      return;
    }

    const payload: TriggerEspritJobRequest = {
      routingId: values.routingId,
      jobType: values.jobType,
      priority: values.priority,
      notes: values.notes
    };

    triggerMutation.mutate(payload);
  };

  const lastKeyAlert = useMemo(() => {
    if (!lastGeneratedKey) {
      return null;
    }

    return (
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message="최근 발급된 API 키"
        description={
          <Space direction="vertical" size={0}>
            <Text code style={{ wordBreak: 'break-all' }}>{lastGeneratedKey.value}</Text>
            <Text type="secondary">만료: {new Date(lastGeneratedKey.expiresAt).toLocaleString()}</Text>
          </Space>
        }
      />
    );
  }, [lastGeneratedKey]);

  const jobs = jobsQuery.data ?? [];

  return (
    <Card title="Esprit EDGE 작업" className={className}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {lastKeyAlert}
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            routingId: initialRoutingId,
            jobType: routingCode ? 'post-process' : 'import',
            priority: 'normal'
          }}
          onFinish={handleSubmit}
        >
          <Form.Item name="routingId" label="Routing ID" required>
            <Input placeholder="예: 1b3a-..." />
          </Form.Item>
          <Form.Item name="jobType" label="작업 종류" required>
            <Select
              options={[
                { label: '포스트 프로세싱', value: 'post-process' },
                { label: '모델 가져오기', value: 'import-model' },
                { label: '검증만 수행', value: 'validate' }
              ]}
            />
          </Form.Item>
          {routingCode ? (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 12 }}
              message="선택된 Routing"
              description={`${routingCode} 작업을 기준으로 기본값이 채워집니다.`}
            />
          ) : null}
          <Button type="link" onClick={() => setShowAdvanced((prev) => !prev)}>
            {showAdvanced ? '고급 옵션 숨기기' : '고급 옵션 표시'}
          </Button>
          {showAdvanced ? (
            <Form.Item name="priority" label="우선순위">
              <Select
                options={[
                  { label: 'Normal', value: 'normal' },
                  { label: 'High', value: 'high' }
                ]}
              />
            </Form.Item>
          ) : null}
          <Form.Item name="notes" label="메모">
            <Input.TextArea rows={2} placeholder="운영팀 전달 사항" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={triggerMutation.isPending}>
              EDGE 작업 실행
            </Button>
            <Button onClick={onRequestApiKey}>API 키 발급</Button>
            <Button onClick={() => jobsQuery.refetch()} loading={jobsQuery.isFetching}>
              새로 고침
            </Button>
          </Space>
        </Form>

        <div>
          <Text strong>최근 작업</Text>
          {jobsQuery.isLoading ? (
            <Spin style={{ marginTop: 12 }} />
          ) : jobs.length === 0 ? (
            <Alert style={{ marginTop: 12 }} type="info" message="표시할 작업이 없습니다." showIcon />
          ) : (
            <List
              style={{ marginTop: 12 }}
              dataSource={jobs}
              renderItem={(job) => (
                <List.Item>
                  <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    <Space size="small" align="center">
                      <Text strong>{job.routingCode}</Text>
                      <Tag color={statusColor[job.status]}>{job.status}</Tag>
                      <Text type="secondary">{job.jobType}</Text>
                    </Space>
                    <Text type="secondary">
                      요청자 {job.requestedBy} · {new Date(job.updatedAt).toLocaleString()}
                    </Text>
                    {job.logSnippet ? (
                      <Text type="secondary" style={{ whiteSpace: 'pre-line' }}>
                        {job.logSnippet}
                      </Text>
                    ) : null}
                  </Space>
                </List.Item>
              )}
            />
          )}
        </div>
      </Space>
    </Card>
  );
}






