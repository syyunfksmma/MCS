import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoutingSummary } from "@/lib/explorerServer";
import { Typography, Space, Card, List } from "antd";

interface ExplorerItemPageProps {
  params: {
    itemId: string;
  };
}

export async function generateMetadata({ params }: ExplorerItemPageProps) {
  const summary = await getRoutingSummary(params.itemId);
  if (!summary) {
    return {
      title: `MCMS Explorer | ${params.itemId}`
    };
  }
  return {
    title: `MCMS Explorer | ${summary.item.code}`,
    description: `Routing overview for ${summary.item.name}`
  };
}

export default async function ExplorerItemPage({ params }: ExplorerItemPageProps) {
  const summary = await getRoutingSummary(params.itemId);
  if (!summary) {
    notFound();
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title={`Item ${summary.item.code}`} bordered>
        <Typography.Paragraph>{summary.item.name}</Typography.Paragraph>
        <Typography.Text type="secondary">
          Total routings: {summary.routingCount}
        </Typography.Text>
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
                    <Typography.Text strong>{group.groupName}</Typography.Text>
                    <Typography.Text type="secondary">
                      Routings: {group.routingCount}
                    </Typography.Text>
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
