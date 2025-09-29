'use client';

import { Tag, Tooltip } from 'antd';

export interface AddinBadgeProps {
  status: 'idle' | 'queued' | 'running' | 'failed' | 'completed';
  message?: string;
}

const colorMap: Record<AddinBadgeProps['status'], string> = {
  idle: 'default',
  queued: 'gold',
  running: 'blue',
  failed: 'red',
  completed: 'green'
};

const labelMap: Record<AddinBadgeProps['status'], string> = {
  idle: '대기',
  queued: '큐 등록',
  running: '실행 중',
  failed: '실패',
  completed: '완료'
};

export default function AddinBadge({ status, message }: AddinBadgeProps) {
  const tag = <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
  if (!message) return tag;
  return <Tooltip title={message}>{tag}</Tooltip>;
}
