"use client";

import { Card, Space, Timeline, Typography } from "antd";
import type { ReactNode } from "react";
import AddinBadge, { AddinBadgeProps } from "./AddinBadge";
import { ClockCircleOutlined, CloudSyncOutlined, ThunderboltOutlined } from "@ant-design/icons";
import type { AddinJob, AddinJobStatus } from "@/types/explorer";

interface AddinHistoryPanelProps {
  status: AddinBadgeProps["status"];
  message?: string;
  routingCode?: string;
  jobs?: AddinJob[];
}

const { Paragraph, Text } = Typography;

const STATUS_COLORS: Record<AddinBadgeProps["status"], { label: string; color: string }> = {
  idle: { label: "대기", color: "default" },
  queued: { label: "큐 등록", color: "gold" },
  running: { label: "실행 중", color: "blue" },
  failed: { label: "실패", color: "red" },
  completed: { label: "완료", color: "green" }
};

const jobStatusMap: Record<AddinJobStatus, AddinBadgeProps["status"]> = {
  queued: "queued",
  running: "running",
  succeeded: "completed",
  failed: "failed",
  cancelled: "idle"
};

const mockHistory = [
  {
    title: "Add-in 큐 등록",
    description: "MCMS Bot이 작업을 제출했습니다.",
    time: "10:00",
    status: "queued" as AddinBadgeProps["status"]
  },
  {
    title: "작업 실행",
    description: "SolidWorks BOM 동기화",
    time: "10:02",
    status: "running" as AddinBadgeProps["status"]
  },
  {
    title: "결과 검토 대기",
    description: "CAM 엔지니어 확인 필요",
    time: "10:05",
    status: "idle" as AddinBadgeProps["status"]
  }
];

const historyIconMap: Record<AddinBadgeProps["status"], ReactNode> = {
  idle: <ClockCircleOutlined />,
  queued: <CloudSyncOutlined />,
  running: <ThunderboltOutlined />,
  failed: <ThunderboltOutlined />,
  completed: <ThunderboltOutlined />
};

function buildHistoryFromJobs(jobs: AddinJob[]) {
  return jobs.map((job) => {
    const status = jobStatusMap[job.status] ?? "idle";
    return {
      title: `${job.routingCode} ${STATUS_COLORS[status].label}`,
      description: job.lastMessage ?? job.status,
      time: new Date(job.updatedAt).toLocaleTimeString(),
      status
    };
  });
}

export default function AddinHistoryPanel({
  status,
  message,
  routingCode,
  jobs
}: AddinHistoryPanelProps) {
  const timeline = jobs && jobs.length ? buildHistoryFromJobs(jobs) : mockHistory;

  return (
    <Card bordered>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Space align="center" size="middle">
          <AddinBadge status={status} message={message} />
          <Text>{STATUS_COLORS[status].label}</Text>
          {routingCode ? (
            <Text type="secondary">Routing: {routingCode}</Text>
          ) : null}
        </Space>
        <Paragraph type="secondary">
          Add-in 실행 기록을 확인하고 실패 시 Ops에 즉시 알립니다.
        </Paragraph>
        <Timeline
          mode="left"
          items={timeline.map((entry) => ({
            color: STATUS_COLORS[entry.status].color,
            dot: historyIconMap[entry.status],
            children: (
              <Space direction="vertical" size={2}>
                <Text strong>{entry.title}</Text>
                <Text type="secondary">{entry.description}</Text>
                <Text type="secondary">{entry.time}</Text>
              </Space>
            )
          }))}
        />
      </Space>
    </Card>
  );
}
