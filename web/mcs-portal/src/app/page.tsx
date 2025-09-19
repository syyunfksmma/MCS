'use client';

import { Card, Tabs, Empty } from 'antd';
import TreePanel from '../components/TreePanel';
import { useState } from 'react';

const tabItems = [
  { key: 'routing', label: '라우팅 세부', children: <Empty description="라우팅을 선택하세요" /> },
  { key: 'ml', label: 'ML 추천', children: <Empty description="추천 데이터 수집 중" /> },
  { key: 'files', label: '파일 관리', children: <Empty description="파일을 선택하세요" /> },
  { key: 'history', label: '승인 히스토리', children: <Empty description="기록 없음" /> },
  { key: 'addin', label: 'Add-in 연동', children: <Empty description="Add-in 상태 대기" /> }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('routing');

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <TreePanel />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="요약" bordered>
          <p>상태: <strong>대기</strong></p>
          <p>CAM Revision: 1.0.0</p>
          <p>마지막 수정: -</p>
        </Card>
        <Card bordered>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            type="line"
          />
        </Card>
      </div>
    </div>
  );
}
