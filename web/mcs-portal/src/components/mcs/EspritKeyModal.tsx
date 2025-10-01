'use client';

import { useState } from 'react';
import { Alert, Button, Form, Input, InputNumber, Modal, Space, Typography, message } from 'antd';
import { createEspritApiKey, type CreateEspritApiKeyRequest, type CreateEspritApiKeyResponse } from '@/lib/api/esprit';

const { Text } = Typography;

interface EspritKeyModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (result: CreateEspritApiKeyResponse) => void;
}

export default function EspritKeyModal({ open, onClose, onCreated }: EspritKeyModalProps) {
  const [form] = Form.useForm<CreateEspritApiKeyRequest>();
  const [loading, setLoading] = useState(false);
  const [issuedKey, setIssuedKey] = useState<CreateEspritApiKeyResponse | null>(null);

  const handleSubmit = async (values: CreateEspritApiKeyRequest) => {
    setLoading(true);
    try {
      const result = await createEspritApiKey(values);
      setIssuedKey(result);
      onCreated?.(result);
      message.success('새 Esprit EDGE API 키가 발급되었습니다.');
      form.resetFields();
    } catch (error) {
      message.error((error as Error).message || 'API 키 발급에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!issuedKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(issuedKey.value);
      message.success('API 키가 클립보드에 복사되었습니다.');
    } catch {
      message.warning('클립보드 복사에 실패했습니다. 직접 복사하세요.');
    }
  };

  const handleAfterClose = () => {
    setIssuedKey(null);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      afterClose={handleAfterClose}
      title="Esprit EDGE API 키 발급"
      okText="발급"
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ expiresInMinutes: 1440 }}
      >
        <Form.Item name="description" label="용도" tooltip="운영팀이 식별할 수 있는 메모를 남겨주세요.">
          <Input placeholder="예: CAM 자동화 스크립트" />
        </Form.Item>
        <Form.Item
          name="expiresInMinutes"
          label="만료 (분)"
          rules={[{ required: true, message: '만료 시간을 입력하세요.' }]}
        >
          <InputNumber min={5} max={7 * 24 * 60} style={{ width: '100%' }} />
        </Form.Item>
      </Form>

      {issuedKey ? (
        <Alert
          style={{ marginTop: 16 }}
          type="success"
          showIcon
          message="발급된 API 키 (한 번만 노출됩니다)"
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text code style={{ wordBreak: 'break-all' }}>{issuedKey.value}</Text>
              <Space>
                <Button size="small" onClick={handleCopy}>복사</Button>
                <Text type="secondary">만료: {new Date(issuedKey.expiresAt).toLocaleString()}</Text>
              </Space>
            </Space>
          }
        />
      ) : null}
    </Modal>
  );
}
