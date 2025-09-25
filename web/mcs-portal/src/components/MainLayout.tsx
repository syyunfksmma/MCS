'use client';

import { Layout } from 'antd';
import { ReactNode } from 'react';
import HeaderBar from './HeaderBar';

const { Sider, Content } = Layout;

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <HeaderBar />
      <Layout>
        <Sider
          width={240}
          theme="light"
          style={{ padding: '16px', borderRight: '1px solid #f0f0f0' }}
        >
          {/* 추후 사이드 메뉴 삽입 */}
          <p style={{ color: '#4a4a4a' }}>메뉴 준비 중</p>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
