'use client';

import { Layout } from 'antd';
import { ReactNode } from 'react';
import HeaderBar from './HeaderBar';
import GlobalTabs from './navigation/GlobalTabs';

const { Content } = Layout;

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f7f9fc' }}>
      <HeaderBar />
      <Content style={{ padding: '0 24px 24px' }}>
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '0 16px 16px' }}>
          <GlobalTabs />
          <div style={{ padding: '24px 8px 0' }}>{children}</div>
        </div>
      </Content>
    </Layout>
  );
}
