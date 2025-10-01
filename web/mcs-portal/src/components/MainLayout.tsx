"use client";

import { Layout } from 'antd';
import type { ReactNode } from 'react';
import HeaderBar from './HeaderBar';
import GlobalTabs from './navigation/GlobalTabs';
import NavigationProvider from './providers/NavigationProvider';

const { Content } = Layout;

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--color-surface-canvas)' }}>
      <HeaderBar />
      <Content style={{ padding: '0 24px 24px', background: 'var(--color-surface-canvas)' }}>
        <NavigationProvider>
          <div
            style={{
              background: 'var(--color-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '0 16px 16px',
              boxShadow: 'var(--shadow-elevated-sm)'
            }}
          >
            <GlobalTabs />
            <div style={{ padding: '24px 8px 0' }}>{children}</div>
          </div>
        </NavigationProvider>
      </Content>
    </Layout>
  );
}
