"use client";

import { Button, Card, Form, Input, List, Select, Space, Typography, message } from "antd";

type ApiKeyEntry = {
  id: string;
  name: string;
  scopes: string[];
  adGroup: string;
};

const mockKeys: ApiKeyEntry[] = [
  {
    id: "key-001",
    name: "AutomationBot",
    scopes: ["routing.read", "routing.write"],
    adGroup: "MCMS-Automation"
  },
  {
    id: "key-002",
    name: "Reporting",
    scopes: ["routing.read"],
    adGroup: "MCMS-Reporting"
  }
];

const scopeOptions = [
  { label: "routing.read", value: "routing.read" },
  { label: "routing.write", value: "routing.write" },
  { label: "workspace.manage", value: "workspace.manage" }
];

const adGroups = [
  { label: "MCMS-Automation", value: "MCMS-Automation" },
  { label: "MCMS-Reporting", value: "MCMS-Reporting" },
  { label: "MCMS-Admin", value: "MCMS-Admin" }
];

export default function ApiKeyManagement() {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    const values = await form.validateFields();
    message.success(`API Key 생성 요청 완료: ${values.name}`);
    form.resetFields();
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="새 API Key 발급">
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="이름" rules={[{ required: true, message: '이름을 입력하세요.' }]}>
            <Input placeholder="예: AutomationBot" />
          </Form.Item>
          <Form.Item name="scopes" label="Scopes" rules={[{ required: true }]}>
            <Select mode="multiple" options={scopeOptions} placeholder="필요한 권한을 선택" />
          </Form.Item>
          <Form.Item name="adGroup" label="AD 그룹" rules={[{ required: true }]}>
            <Select options={adGroups} placeholder="연결할 그룹 선택" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            API Key 생성
          </Button>
        </Form>
      </Card>

      <Card title="발급된 API Key">
        <List
          dataSource={mockKeys}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button size="small" type="link" key="revoke">
                  회수
                </Button>
              ]}
            >
              <Space direction="vertical" size={0} style={{ width: "100%" }}>
                <Typography.Text strong>{item.name}</Typography.Text>
                <Typography.Text type="secondary">
                  Scopes: {item.scopes.join(', ')} · AD 그룹: {item.adGroup}
                </Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}
