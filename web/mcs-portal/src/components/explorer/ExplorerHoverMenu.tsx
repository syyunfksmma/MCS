"use client";

import { Button, Space, Tooltip, Typography } from 'antd';
import type { CSSProperties, MouseEvent } from 'react';
import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  PushpinOutlined,
  PushpinFilled,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { HoverMenuContext } from '@/hooks/useHoverMenu';
import styles from './ExplorerHoverMenu.module.css';

const { Text } = Typography;

interface ExplorerHoverMenuProps {
  context: HoverMenuContext;
  onClose: () => void;
  cancelClose: () => void;
  scheduleClose: () => void;
  onViewDetail?: (routingId: string) => void;
  onOpenUploads?: (routingId: string) => void;
  onApprove?: (routingId: string) => void;
  onPinToggle?: (routingId: string, nextPinned: boolean) => void;
}

export default function ExplorerHoverMenu({
  context,
  onClose,
  cancelClose,
  scheduleClose,
  onViewDetail,
  onOpenUploads,
  onApprove,
  onPinToggle
}: ExplorerHoverMenuProps) {
  const style = useMemo<CSSProperties>(() => {
    const { anchorRect } = context;
    const top = anchorRect.bottom + window.scrollY + 8;
    const left = anchorRect.left + window.scrollX;
    return {
      top,
      left
    };
  }, [context]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleClick = (
    event: MouseEvent,
    callback?: (routingId: string) => void
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!callback) {
      return;
    }
    callback(context.routingId);
    onClose();
  };

  const approveDisabled = !context.canApprove;
  const isPinned = Boolean(context.isPinned);

  const content = (
    <div
      className={styles.root}
      style={style}
      role="menu"
      aria-label="Routing quick actions"
      onMouseEnter={cancelClose}
      onMouseLeave={() => scheduleClose()}
      data-origin={context.origin}
    >
      <Space size={6} className={styles.badgeRow}>
        <Text strong>{context.routingCode}</Text>
        {context.status ? (
          <Text type="secondary">{context.status}</Text>
        ) : null}
        {isPinned ? <span className={styles.pinnedTag}>Pinned</span> : null}
        {context.addinJobStatus ? (
          <span className={styles.addinTag}>{context.addinJobStatus}</span>
        ) : null}
      </Space>
      {context.slaBreached ? (
        <Space size={6} className={styles.badgeRow}>
          <ClockCircleOutlined style={{ color: '#991b1b' }} />
          <code>SLA +{context.breachMs ?? 0} ms</code>
          <Text type="secondary">Review before approving</Text>
        </Space>
      ) : null}
      <div className={styles.actions}>
        <Tooltip title="Open routing detail">
          <Button
            role="menuitem"
            className={styles.actionButton}
            icon={<EyeOutlined />}
            onClick={(event) => handleClick(event, onViewDetail)}
          >
            View Detail
          </Button>
        </Tooltip>
        <Tooltip title="Open uploads panel">
          <Button
            role="menuitem"
            className={styles.actionButton}
            icon={<UploadOutlined />}
            onClick={(event) => handleClick(event, onOpenUploads)}
          >
            Open Uploads
          </Button>
        </Tooltip>
        <Tooltip
          title={
            approveDisabled
              ? 'Approval unavailable for current status or permissions'
              : 'Approve routing'
          }
        >
          <Button
            role="menuitem"
            className={styles.actionButton}
            icon={<CheckCircleOutlined />}
            aria-disabled={approveDisabled}
            disabled={approveDisabled}
            onClick={(event) => handleClick(event, onApprove)}
          >
            Approve
          </Button>
        </Tooltip>
        <Tooltip
          title={isPinned ? 'Unpin from quick access' : 'Pin to quick access'}
        >
          <Button
            role="menuitem"
            className={styles.actionButton}
            icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onPinToggle?.(context.routingId, !isPinned);
              onClose();
            }}
          >
            {isPinned ? 'Unpin' : 'Pin'}
          </Button>
        </Tooltip>
      </div>
      <div className={styles.footer}>
        <span>Origin: {context.origin}</span>
        <Button type="link" size="small" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}