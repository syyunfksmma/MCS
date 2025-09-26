import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Steps,
  Typography,
  Select,
  Space
} from 'antd';
import type {
  ExplorerItem,
  ExplorerRoutingGroup,
  ExplorerRevision
} from '@/types/explorer';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const ROUTING_STATUSES = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Pending Approval', value: 'PendingApproval' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' }
] as const;

type WizardStep = 0 | 1 | 2;

export interface RoutingCreationInput {
  code: string;
  owner: string;
  status: 'Draft' | 'PendingApproval' | 'Approved' | 'Rejected';
  notes?: string;
  sharedDriveReady: boolean;
}

interface RoutingCreationWizardProps {
  open: boolean;
  item: ExplorerItem;
  group: ExplorerRoutingGroup;
  revision: ExplorerRevision;
  onCancel: () => void;
  onSubmit: (input: RoutingCreationInput) => Promise<void> | void;
}

export default function RoutingCreationWizard({
  open,
  item,
  revision,
  group,
  onCancel,
  onSubmit
}: RoutingCreationWizardProps) {
  const [current, setCurrent] = useState<WizardStep>(0);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<RoutingCreationInput>();

  const sharedDrivePath = useMemo(() => {
    return (
      group.sharedDrivePath ??
      `\\\\MCMS_SHARE\\\\Routing\\\\${item.code}\\\\REV_${group.id.split('-')[0]}\\\\GROUP_${group.id}\\`
    );
  }, [group.sharedDrivePath, group.id, item.code]);

  const resetState = () => {
    setCurrent(0);
    setSubmitting(false);
    form.resetFields();
  };

  const handleClose = () => {
    resetState();
    onCancel();
  };

  const nextStep = async () => {
    try {
      await form.validateFields(
        current === 0
          ? ['code', 'owner']
          : current === 1
            ? ['status', 'notes']
            : ['sharedDriveReady']
      );
      setCurrent((step) => (step + 1) as WizardStep);
    } catch {
      // validation handled by antd
    }
  };

  const previousStep = () => {
    setCurrent((step) => (step - 1) as WizardStep);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue(true);
      setSubmitting(true);
      await onSubmit(values as RoutingCreationInput);
      setSubmitting(false);
      handleClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      maskClosable={!submitting}
      width={680}
      footer={null}
      title={`${group.name} · New Routing`}
    >
      <Steps
        current={current}
        size="small"
        items={[
          { title: 'Basic Info' },
          { title: 'Workflow' },
          { title: 'Shared Drive' }
        ]}
        className="mb-6"
      />
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'Draft', sharedDriveReady: false }}
        disabled={submitting}
      >
        {current === 0 ? (
          <>
            <Paragraph type="secondary" className="mb-3">
              대상 Revision: {revision.code}
            </Paragraph>
            <Form.Item
              label="Routing Code"
              name="code"
              rules={[{ required: true, message: 'Routing code is required.' }]}
            >
              <Input placeholder="예: GT310002" maxLength={32} />
            </Form.Item>
            <Form.Item
              label="Owner"
              name="owner"
              rules={[{ required: true, message: 'Owner is required.' }]}
            >
              <Input placeholder="예: cam.jane" maxLength={64} />
            </Form.Item>
          </>
        ) : null}
        {current === 1 ? (
          <>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
            >
              <Select
                options={ROUTING_STATUSES.map((option) => ({
                  label: option.label,
                  value: option.value
                }))}
              />
            </Form.Item>
            <Form.Item label="Notes" name="notes">
              <TextArea
                placeholder="Routing purpose, tooling notes, etc."
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </>
        ) : null}
        {current === 2 ? (
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Text strong>Shared drive path</Text>
              <div className="mt-1 rounded bg-slate-100 px-3 py-2 text-sm font-mono">
                {sharedDrivePath}
              </div>
            </div>
            <Form.Item
              name="sharedDriveReady"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error('공유 드라이브 준비 여부를 확인해 주세요.')
                        )
                }
              ]}
            >
              <Checkbox>
                공유 드라이브 폴더가 생성되었으며 접근 권한을 확인했습니다.
              </Checkbox>
            </Form.Item>
          </Space>
        ) : null}
      </Form>
      <div className="mt-6 flex justify-between">
        <Button onClick={handleClose} disabled={submitting}>
          취소
        </Button>
        <Space>
          {current > 0 ? (
            <Button onClick={previousStep} disabled={submitting}>
              이전
            </Button>
          ) : null}
          {current < 2 ? (
            <Button type="primary" onClick={nextStep} disabled={submitting}>
              다음
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              Routing 생성
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
}



