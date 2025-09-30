'use client';

import { Badge, Card, Col, Divider, Input, List, Row, Tabs, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import ThreeViewer from '@/components/mcs/ThreeViewer';

const { Title, Text } = Typography;

const fileTree = [
  {
    title: 'Routing',
    children: [
      { title: 'REV_A', children: ['GROUP_MAIN', 'GROUP_SECONDARY'] },
      { title: 'REV_B', children: ['GROUP_TEST'] }
    ]
  }
];

export default function ServerPage() {
  const [activeKey, setActiveKey] = useState('browser');
  const groups = useMemo(
    () => ['Routing 로그', 'ETL 이벤트', '시스템 경고'].map((name, index) => ({
      title: name,
      key: log-
    })),
    []
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Title level={3} style={{ marginBottom: 0 }}>
        Server 운영 패널
      </Title>
      <Text type="secondary">폴더 구조, 로그, REV 관리를 한 곳에서 제어합니다.</Text>

      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: 'browser',
            label: '파일 구조',
            children: (
              <Row gutter={16}>
                <Col xs={24} md={10}>
                  <Card title="공유 드라이브">
                    <List
                      bordered
                      dataSource={fileTree}
                      renderItem={(item) => (
                        <List.Item>
                          <div>
                            <Text strong>{item.title}</Text>
                            <div style={{ paddingLeft: 16 }}>
                              {item.children?.map((child) => (
                                <div key={child.title ?? String(child)}>
                                  <Text>{child.title ?? child}</Text>
                                </div>
                              ))}
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={14}>
                  <Card title="세부 정보">
                    <Text type="secondary">노드를 선택하면 파일 경로와 메타데이터가 표시됩니다.</Text>
                  </Card>
                </Col>
              </Row>
            )
          },
          {
            key: 'logs',
            label: '실시간 로그',
            children: (
              <Card>
                <Input.Search placeholder="로그 검색" style={{ marginBottom: 16 }} />
                <List
                  size="small"
                  dataSource={groups}
                  renderItem={(item) => (
                    <List.Item>
                      <Badge status="processing" text={item.title} />
                    </List.Item>
                  )}
                />
              </Card>
            )
          },
          {
            key: 'rev',
            label: 'REV 관리',
            children: (
              <Card>
                <List
                  header={
                    <Row>
                      <Col span={8}>REV</Col>
                      <Col span={8}>상태</Col>
                      <Col span={8}>작업</Col>
                    </Row>
                  }
                  dataSource={[
                    { rev: 'REV_A', status: '승인 대기' },
                    { rev: 'REV_B', status: '완료' }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Row style={{ width: '100%' }}>
                        <Col span={8}>{item.rev}</Col>
                        <Col span={8}>
                          <Tag color={item.status === '완료' ? 'green' : 'gold'}>{item.status}</Tag>
                        </Col>
                        <Col span={8}>
                          <Text type="secondary">세부 탭에서 제어</Text>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </Card>
            )
          }
        ]}
      />

      <Divider>STL / SolidWorks 미리보기</Divider>
      <Card>
        <ThreeViewer />
        <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
          실제 모델 URL과 연동되면 해당 위치에 자동으로 로딩됩니다.
        </Text>
      </Card>
    </div>
  );
}
