"use client";

import { Card, List, Space, Tag, Timeline, Typography } from "antd";
import AddinBadge, { AddinBadgeProps } from "./AddinBadge";
import { ClockCircleOutlined, CloudSyncOutlined, ThunderboltOutlined } from "@ant-design/icons";

interface AddinHistoryPanelProps {
  status: AddinBadgeProps["status"];
  message?: string;
  routingCode?: string;
}

const { Paragraph, Text } = Typography;

const STATUS_COLORS: Record<AddinBadgeProps["status"], { label: string; color: string }> = {
  idle: { label: "대기", color: "default" },
  queued: { label: "큐 등록", color: "gold" },
  running: { label: "실행 중", color: "blue" },
  failed: { label: "실패", color: "red" },
  completed: { label: "완료", color: "green" }
};

const mockHistory = [
  {
    title: "Add-in 큐 등록",
    description: "MCMS Bot이 작업을 제출했습니다.",
    time: "10:00",
    status: "queued" as const
  },
  {
    title: "작업 실행",
    description: "SolidWorks BOM 동기화",
    time: "10:02",
    status: "running" as const
  },
  {
    title: "결과 검토 대기",
    description: "CAM 엔지니어 확인 필요",
    time: "10:05",
    status: "idle" as const
  }
];

const mockTimeline = [
  {
    color: "blue" as const,
    content: "10:00 Add-in 큐 등록 (Mock)"
  },
  {
    color: "green" as const,
    content: "10:02 Add-in 실행 완료 (Mock)"
  },
  {
    color: "gray" as const,
    content: "10:05 승인 대기 (Mock)"
  }
];

export default function AddinHistoryPanel({
  status,
  message,
  routingCode
}: AddinHistoryPanelProps) {
  const badgeLabel = STATUS_COLORS[status].label;

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Space align="center" size="large">
        <AddinBadge status={status} message={message} />
        <Paragraph className="mb-0" type="secondary">
          {routingCode
            ? `${routingCode} · 현재 상태: ${badgeLabel}`
            : `선택된 Routing 없음 · 현재 상태: ${badgeLabel}`}
        </Paragraph>
      </Space>

      <Card
        size="small"
        title={
          <Space>
            <CloudSyncOutlined />
            <span>가상 Add-in 히스토리</span>
          </Space>
        }
      >
        <List
          dataSource={mockHistory}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space size="small">
                    <Tag color={STATUS_COLORS[item.status].color}>
                      {STATUS_COLORS[item.status].label}
                    </Tag>
                    <span>{item.title}</span>
                  </Space>
                }
                description={item.description}
              />
              <Text type="secondary">{item.time}</Text>
            </List.Item>
          )}
        />
      </Card>

      <Card
        size="small"
        title={
          <Space>
            <ThunderboltOutlined />
            <span>타임라인</span>
          </Space>
        }
      >
        <Timeline
          items={mockTimeline.map((entry) => ({
            color: entry.color,
            dot: <ClockCircleOutlined style={{ fontSize: 12 }} />,
            children: entry.content
          }))}
        />
        <Paragraph type="secondary" className="mb-0 mt-2 text-xs">
          SignalR 연동 시 실제 Add-in 이벤트로 대체 예정입니다.
        </Paragraph>
      </Card>
    </Space>
  );
}
