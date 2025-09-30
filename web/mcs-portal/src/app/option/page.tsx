'use client';

import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Select, Switch, Typography } from 'antd';

const { Title, Text } = Typography;

const machineOptions = [
  { label: 'MILL-01', value: 'MILL-01' },
  { label: 'MILL-02', value: 'MILL-02' },
  { label: 'LATHE-02', value: 'LATHE-02' }
];

const engineerOptions = [
  { label: 'Alice', value: 'alice' },
  { label: 'Bob', value: 'bob' },
  { label: 'Charlie', value: 'charlie' }
];

export default function OptionPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Title level={3} style={{ marginBottom: 0 }}>
        Option & 설정
      </Title>
      <Text type="secondary">공유 드라이브, 작업 할당, EDGE 버전 등 시스템 설정을 관리합니다.</Text>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="폴더 구조 설정">
            <Form layout="vertical">
              <Form.Item label="공유 드라이브 경로" required>
                <Input placeholder="\\\\SERVER\\MCMS_SHARE\\Routing" />
              </Form.Item>
              <Form.Item label="로그 저장 경로">
                <Input placeholder="\\\\SERVER\\MCMS_SHARE\\logs" />
              </Form.Item>
              <Form.Item label="버전 보관 기간(일)">
                <InputNumber min={1} max={180} style={{ width: '100%' }} />
              </Form.Item>
              <Button type="primary">저장</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="작업 할당 매핑">
            <Form layout="vertical">
              <Form.Item label="제품군">
                <Select options={machineOptions} mode="multiple" allowClear placeholder="제품군 선택" />
              </Form.Item>
              <Form.Item label="엔지니어">
                <Select options={engineerOptions} mode="multiple" allowClear placeholder="담당 엔지니어" />
              </Form.Item>
              <Button>매핑 추가</Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Divider>Esprit EDGE & Access Data</Divider>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Esprit EDGE 버전 관리">
            <Form layout="vertical">
              <Form.Item label="현재 버전">
                <Input defaultValue="2025.1" />
              </Form.Item>
              <Form.Item label="새 버전 패키지 URL">
                <Input placeholder="https://intranet/packages/esprit-edge.msi" />
              </Form.Item>
              <Button type="primary">버전 등록</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Access Data 매핑">
            <Form layout="vertical">
              <Form.Item label="데이터베이스 연결 문자열">
                <Input.TextArea rows={3} placeholder="Provider=SQLOLEDB;Data Source=..." />
              </Form.Item>
              <Form.Item label="연결 테스트">
                <Button>테스트 실행</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Divider>트래픽 & 서비스 옵션</Divider>
      <Card>
        <Form layout="inline" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <Form.Item label="최대 동시 작업">
            <InputNumber min={1} max={200} defaultValue={25} />
          </Form.Item>
          <Form.Item label="자동 스로틀">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="서비스 상태">
            <Select defaultValue="active" options={[
              { label: 'Active', value: 'active' },
              { label: 'Maintenance', value: 'maintenance' }
            ]} />
          </Form.Item>
          <Button type="primary">설정 저장</Button>
        </Form>
      </Card>
    </div>
  );
}
