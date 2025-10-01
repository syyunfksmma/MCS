"use client";

import Link from "next/link";
import { Card, List, Space, Typography } from "antd";
import type { ExplorerItem } from "@/types/explorer";

const { Paragraph, Text } = Typography;

export interface RoutingGroupSummary {
  groupId: string;
  groupName: string;
  routingCount: number;
}

export interface RevisionSummary {
  revisionId: string;
  revisionCode: string;
  routingGroups: RoutingGroupSummary[];
}

export interface RoutingSummary {
  item: ExplorerItem;
  revisions: RevisionSummary[];
  routingCount: number;
}

interface ExplorerItemClientProps {
  summary: RoutingSummary;
}

export default function ExplorerItemClient({ summary }: ExplorerItemClientProps) {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title={`Item ${summary.item.code}`} bordered>
        <Paragraph>{summary.item.name}</Paragraph>
        <Text type="secondary">Total routings: {summary.routingCount}</Text>
      </Card>

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {summary.revisions.map((revision) => (
          <Card
            key={revision.revisionId}
            title={`Revision ${revision.revisionCode}`}
            bordered
          >
            <List
              dataSource={revision.routingGroups}
              locale={{ emptyText: "No routing groups" }}
              renderItem={(group) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text strong>{group.groupName}</Text>
                    <Text type="secondary">Routings: {group.routingCount}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        ))}
      </Space>

      <Link href="/explorer">Back to Explorer</Link>
    </Space>
  );
}
