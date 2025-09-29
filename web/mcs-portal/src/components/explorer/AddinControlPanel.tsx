"use client";

import { Button, Card, List, Space, Tag, Typography, message } from "antd";
import type { AddinJob } from "@/types/explorer";

interface AddinControlPanelProps {
  jobs?: AddinJob[];
  onRetry?: (jobId: string) => Promise<void> | void;
  onCancel?: (jobId: string) => Promise<void> | void;
}

const { Text } = Typography;

const statusColor: Record<AddinJob["status"], string> = {
  queued: "gold",
  running: "blue",
  succeeded: "green",
  failed: "red",
  cancelled: "default"
};

export default function AddinControlPanel({ jobs, onRetry, onCancel }: AddinControlPanelProps) {
  const hasJobs = jobs && jobs.length;

  const handleRetry = async (jobId: string) => {
    try {
      await onRetry?.(jobId);
      message.success("재시도 요청을 전송했습니다.");
    } catch (error) {
      message.error(`재시도 요청 실패: ${(error as Error).message}`);
    }
  };

  const handleCancel = async (jobId: string) => {
    try {
      await onCancel?.(jobId);
      message.success("취소 요청을 전송했습니다.");
    } catch (error) {
      message.error(`취소 요청 실패: ${(error as Error).message}`);
    }
  };

  return (
    <Card title="Add-in Control Panel" bordered>
      {hasJobs ? (
        <List
          dataSource={jobs}
          renderItem={(job) => (
            <List.Item
              actions={[
                <Button size="small" onClick={() => handleRetry(job.id)} key="retry">
                  재시도
                </Button>,
                <Button size="small" danger onClick={() => handleCancel(job.id)} key="cancel">
                  취소
                </Button>
              ]}
            >
              <Space direction="vertical" size={0} style={{ width: "100%" }}>
                <Space align="center" size="small">
                  <Text strong>{job.routingCode}</Text>
                  <Tag color={statusColor[job.status]}>{job.status}</Tag>
                  <Text type="secondary">요청자: {job.requestedBy}</Text>
                </Space>
                <Text type="secondary">
                  {new Date(job.updatedAt).toLocaleString()} · {job.lastMessage ?? "상태 업데이트 없음"}
                </Text>
              </Space>
            </List.Item>
          )}
        />
      ) : (
        <Text type="secondary">현재 대기 중인 Add-in 작업이 없습니다.</Text>
      )}
    </Card>
  );
}
