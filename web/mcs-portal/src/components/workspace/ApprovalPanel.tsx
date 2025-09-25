'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Timeline,
  Typography,
  message
} from 'antd';
import type { ExplorerRouting, ApprovalEvent } from '@/types/explorer';

const { Text, Paragraph } = Typography;

interface ApprovalPanelProps {
  routing: ExplorerRouting | null;
  events: ApprovalEvent[];
  onSubmit: (decision: 'approved' | 'rejected', comment: string) => void;
}

interface ApprovalModalState {
  open: boolean;
  decision: 'approved' | 'rejected';
}

const DECISION_LABEL: Record<'approved' | 'rejected' | 'pending', string> = {
  approved: '승인',
  rejected: '반려',
  pending: '보류'
};

export default function ApprovalPanel({
  routing,
  events,
  onSubmit
}: ApprovalPanelProps) {
  const [modal, setModal] = useState<ApprovalModalState | null>(null);
  const [form] = Form.useForm<{ comment: string }>();
  const [apiMessage, contextHolder] = message.useMessage();

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [events]);

  const openModal = (decision: 'approved' | 'rejected') => {
    if (!routing) {
      apiMessage.warning('먼저 Routing을 선택하세요.');
      return;
    }
    setModal({ open: true, decision });
    form.setFieldsValue({ comment: '' });
  };

  const closeModal = () => {
    setModal(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(modal!.decision, values.comment.trim());
      apiMessage.success(
        `${routing!.code} ${DECISION_LABEL[modal!.decision]} 기록이 추가되었습니다.`
      );
      closeModal();
    } catch (error) {
      // validation handled by form
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {contextHolder}
      <div className="flex flex-wrap gap-2">
        <Button
          type="primary"
          disabled={!routing}
          onClick={() => openModal('approved')}
        >
          승인 요청 기록
        </Button>
        <Button
          danger
          disabled={!routing}
          onClick={() => openModal('rejected')}
        >
          반려 기록 추가
        </Button>
      </div>
      {routing ? (
        <Paragraph type="secondary" className="mb-0 text-sm">
          대상 Routing: <Text strong>{routing.code}</Text> · 상태:{' '}
          {routing.status}
        </Paragraph>
      ) : (
        <Paragraph type="secondary">
          Routing을 선택하면 승인/반려 내역을 확인할 수 있습니다.
        </Paragraph>
      )}
      {sortedEvents.length ? (
        <Timeline>
          {sortedEvents.map((event) => (
            <Timeline.Item
              key={event.id}
              color={
                event.decision === 'approved'
                  ? 'green'
                  : event.decision === 'rejected'
                    ? 'red'
                    : 'blue'
              }
            >
              <div className="flex flex-col gap-1">
                <Text strong>
                  {DECISION_LABEL[event.decision]} ·{' '}
                  {new Date(event.createdAt).toLocaleString()}
                </Text>
                <Text type="secondary">
                  {event.actor} · 출처:{' '}
                  {event.source === 'user'
                    ? '사용자'
                    : event.source === 'system'
                      ? '시스템'
                      : 'SignalR'}
                </Text>
                <Paragraph className="mb-0 whitespace-pre-wrap">
                  {event.comment || '코멘트 없음'}
                </Paragraph>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Empty
          description="승인/반려 이력이 없습니다"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      <Modal
        open={Boolean(modal?.open)}
        title={modal ? `${DECISION_LABEL[modal.decision]} 기록 추가` : ''}
        okText={modal ? `${DECISION_LABEL[modal.decision]} 저장` : '확인'}
        cancelText="취소"
        onOk={handleSubmit}
        onCancel={closeModal}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="코멘트"
            name="comment"
            rules={[
              {
                required: true,
                message: `${DECISION_LABEL[modal?.decision ?? 'approved']} 사유를 입력하세요.`
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (value.trim().length < 5) {
                    return Promise.reject(new Error('5자 이상 입력하세요.'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="승인/반려 사유를 입력하세요"
              maxLength={500}
              showCount
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
