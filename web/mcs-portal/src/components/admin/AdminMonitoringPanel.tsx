'use client';

import { useState } from 'react';
import { Button, Card, Empty, Space, Typography } from 'antd';
import { LinkOutlined, ReloadOutlined } from '@ant-design/icons';
import { getGrafanaEmbedUrl, getGrafanaExternalUrl } from '@/lib/env';

const { Text, Title } = Typography;

export default function AdminMonitoringPanel() {
  const embedUrl = getGrafanaEmbedUrl();
  const externalUrl = getGrafanaExternalUrl();
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Title level={3} className="mb-0">
          Monitoring Dashboard
        </Title>
        <Text type="secondary">Embed the live KPI dashboard directly inside the admin console.</Text>
      </div>
      <Card
        bordered
        bodyStyle={{ padding: 12 }}
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => setIframeKey(prev => prev + 1)}>
              Refresh
            </Button>
            {externalUrl && (
              <Button type="link" icon={<LinkOutlined />} href={externalUrl} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </Button>
            )}
          </Space>
        }
      >
        {embedUrl ? (
          <iframe
            key={iframeKey}
            src={embedUrl}
            title="MCMS Monitoring Dashboard"
            className="w-full"
            style={{ border: 0, height: 420 }}
            allowFullScreen
          />
        ) : (
          <Empty description={
            <Space direction="vertical" size={2}>
              <Text strong>Embed URL is not configured.</Text>
              <Text type="secondary">Configure NEXT_PUBLIC_GRAFANA_EMBED_URL to render the dashboard.</Text>
            </Space>
          } />
        )}
      </Card>
    </div>
  );
}
