'use client';

import { Layout, Typography, Space, Button } from 'antd';
import { QuestionCircleOutlined, BellOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default function HeaderBar() {
  return (
    <Header style={{ background: '#ffffff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        MCS Portal
      </Typography.Title>
      <Space size="middle">
        <Button icon={<QuestionCircleOutlined />} type="text">
          도움말
        </Button>
        <Button icon={<BellOutlined />} type="text">
          알림
        </Button>
        <Button type="primary">프로필</Button>
      </Space>
    </Header>
  );
}

