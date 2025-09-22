'use client';

import { Badge, Button, Card, Tabs, Empty, Typography, Spin, Alert, Space, message } from 'antd';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import TreePanel, { TreePanelReorderPayload } from '@/components/TreePanel';
import AddinControlPanel, { SignalRConnectionState } from '@/components/explorer/AddinControlPanel';
import AddinBadge from '@/components/explorer/AddinBadge';
import WorkspaceUploadPanel from '@/components/workspace/WorkspaceUploadPanel';
import WorkspaceMetaPanel from '@/components/workspace/WorkspaceMetaPanel';
import { manageAddinJob, submitApprovalDecision } from '@/lib/workspace';
import ApprovalPanel from '@/components/workspace/ApprovalPanel';
import {
  AddinJob,
  AddinJobStatus,
  ApprovalDecision,
  ApprovalEvent,
  ExplorerItem,
  ExplorerRouting,
  ExplorerResponse
} from '@/types/explorer';
import { useExplorerData } from '@/hooks/useExplorerData';

interface ExplorerShellProps {
  initialData: ExplorerResponse;
}

const { Paragraph, Text } = Typography;
const TAB_ORDER = ['summary', 'history', 'files'] as const;
type TabKey = (typeof TAB_ORDER)[number];

type WorkspaceSnapshot = ExplorerItem[];

interface RoutingContext {
  item: ExplorerItem;
  revision: ExplorerItem['revisions'][number];
  routing: ExplorerRouting;
}

const isEditableElement = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || element.isContentEditable || element.getAttribute('role') === 'textbox';
};

const cloneExplorerItems = (items: ExplorerItem[]): WorkspaceSnapshot =>
  items.map(item => ({
    ...item,
    revisions: item.revisions.map(revision => ({
      ...revision,
      routings: revision.routings.map(routing => ({
        ...routing,
        files: routing.files.map(file => ({ ...file }))
      }))
    }))
  }));

const flattenRoutingContexts = (items: ExplorerItem[]): RoutingContext[] => {
  const contexts: RoutingContext[] = [];
  items.forEach(item => {
    item.revisions.forEach(revision => {
      revision.routings.forEach(routing => {
        contexts.push({ item, revision, routing });
      });
    });
  });
  return contexts;
};

const findRoutingContext = (items: ExplorerItem[], routingId: string): RoutingContext | null => {
  for (const item of items) {
    for (const revision of item.revisions) {
      const routing = revision.routings.find(current => current.id === routingId);
      if (routing) {
        return { item, revision, routing };
      }
    }
  }
  return null;
};

const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const createJobId = () => createId('job');

const createApprovalEvent = (input: {
  routingId: string;
  decision: ApprovalDecision;
  actor: string;
  comment: string;
  source: ApprovalEvent['source'];
  createdAt?: string;
  id?: string;
}): ApprovalEvent => ({
  id: input.id ?? createId('approval'),
  routingId: input.routingId,
  decision: input.decision,
  actor: input.actor,
  comment: input.comment,
  source: input.source,
  createdAt: input.createdAt ?? new Date().toISOString()
});

const seedAddinJobs = (items: ExplorerItem[]): AddinJob[] => {
  const now = Date.now();
  const contexts = flattenRoutingContexts(items).slice(0, 3);
  if (!contexts.length) {
    return [];
  }
  return contexts.map((ctx, index) => {
    const status: AddinJobStatus = index === 0 ? 'running' : index === 1 ? 'succeeded' : 'queued';
    return {
      id: createJobId(),
      routingId: ctx.routing.id,
      routingCode: ctx.routing.code,
      itemName: `${ctx.item.code} · ${ctx.item.name}`,
      revisionCode: ctx.revision.code,
      status,
      requestedBy: index === 1 ? 'qa.bot' : 'workspace.mock',
      createdAt: new Date(now - (index + 3) * 5 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - (index + 1) * 2 * 60 * 1000).toISOString(),
      lastMessage:
        status === 'running'
          ? 'SignalR: 실행 중'
          : status === 'succeeded'
          ? 'SignalR: 완료 알림 수신'
          : '큐에 대기 중'
    };
  });
};

const seedApprovalEvents = (items: ExplorerItem[]): Record<string, ApprovalEvent[]> => {
  const contexts = flattenRoutingContexts(items);
  const now = Date.now();
  const seed: Record<string, ApprovalEvent[]> = {};
  contexts.forEach((ctx, index) => {
    const baseDecision: ApprovalDecision =
      ctx.routing.status === 'Approved'
        ? 'approved'
        : ctx.routing.status === 'Rejected'
        ? 'rejected'
        : 'pending';
    seed[ctx.routing.id] = [
      createApprovalEvent({
        routingId: ctx.routing.id,
        decision: baseDecision,
        actor: baseDecision === 'approved' ? 'qa.bot' : 'workspace.mock',
        comment:
          baseDecision === 'approved'
            ? '이전 작업에서 승인 완료되었습니다.'
            : baseDecision === 'rejected'
            ? '품질 점검 중 반려되었습니다.'
            : '승인 대기 상태입니다.',
        source: 'system',
        createdAt: new Date(now - index * 3 * 60 * 1000).toISOString()
      })
    ];
  });
  return seed;
};

const reorderWithinArray = <T extends { id: string }>(
  list: T[],
  dragKey: string,
  dropKey: string,
  position: 'before' | 'after'
): T[] => {
  const dragIndex = list.findIndex(item => item.id === dragKey);
  const dropIndex = list.findIndex(item => item.id === dropKey);
  if (dragIndex === -1 || dropIndex === -1 || dragIndex === dropIndex) {
    return list.slice();
  }
  const updated = [...list];
  const [moved] = updated.splice(dragIndex, 1);
  const adjustedDropIndex = dropIndex - (dragIndex < dropIndex ? 1 : 0);
  const insertIndex = position === 'before' ? Math.max(0, adjustedDropIndex) : adjustedDropIndex + 1;
  updated.splice(insertIndex, 0, moved);
  return updated;
};

const applyReorder = (items: ExplorerItem[], payload: TreePanelReorderPayload): WorkspaceSnapshot => {
  const cloned = cloneExplorerItems(items);

  if (payload.entityType === 'item') {
    return reorderWithinArray(cloned, payload.dragKey, payload.dropKey, payload.position);
  }

  for (const item of cloned) {
    if (payload.entityType === 'revision') {
      const revisions = item.revisions;
      if (revisions.some(revision => revision.id === payload.dragKey || revision.id === payload.dropKey)) {
        item.revisions = reorderWithinArray(revisions, payload.dragKey, payload.dropKey, payload.position);
        return cloned;
      }
      continue;
    }

    for (const revision of item.revisions) {
      if (payload.entityType === 'routing') {
        const routings = revision.routings;
        if (routings.some(routing => routing.id === payload.dragKey || routing.id === payload.dropKey)) {
          revision.routings = reorderWithinArray(routings, payload.dragKey, payload.dropKey, payload.position);
          return cloned;
        }
        continue;
      }

      if (payload.entityType === 'file') {
        for (const routing of revision.routings) {
          const files = routing.files;
          if (files.some(file => file.id === payload.dragKey || file.id === payload.dropKey)) {
            routing.files = reorderWithinArray(files, payload.dragKey, payload.dropKey, payload.position);
            return cloned;
          }
        }
      }
    }
  }

  return cloned;
};

const mapJobStatusToBadge = (status: AddinJobStatus): 'idle' | 'queued' | 'running' | 'failed' | 'completed' => {
  switch (status) {
    case 'queued':
      return 'queued';
    case 'running':
      return 'running';
    case 'succeeded':
      return 'completed';
    case 'failed':
    case 'cancelled':
      return 'failed';
    default:
      return 'idle';
  }
};

export default function ExplorerShell({ initialData }: ExplorerShellProps) {
  const { data, isFetching, isError, error } = useExplorerData(initialData);
  const resolved = data ?? initialData;
  const { items, generatedAt, source } = resolved;

  const [messageApi, contextHolder] = message.useMessage();

  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceSnapshot>(() => cloneExplorerItems(items));
  const [undoStack, setUndoStack] = useState<WorkspaceSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<WorkspaceSnapshot[]>([]);
  const [selectedRoutingId, setSelectedRoutingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('summary');

  const [addinJobs, setAddinJobs] = useState<AddinJob[]>(() => seedAddinJobs(items));
  const [signalRState, setSignalRState] = useState<SignalRConnectionState>('connected');
  const [approvalEvents, setApprovalEvents] = useState<Record<string, ApprovalEvent[]>>(() => seedApprovalEvents(items));

  useEffect(() => {
    setWorkspaceItems(cloneExplorerItems(items));
    setUndoStack([]);
    setRedoStack([]);
    setAddinJobs(seedAddinJobs(items));
    setApprovalEvents(seedApprovalEvents(items));
    setSelectedRoutingId(prev => {
      if (!prev) {
        return prev;
      }
      const exists = items
        .flatMap(item => item.revisions)
        .flatMap(revision => revision.routings)
        .some(routing => routing.id === prev);
      return exists ? prev : null;
    });
  }, [items]);

  useEffect(() => {
    if (!selectedRoutingId) {
      return;
    }
    const exists = workspaceItems
      .flatMap(item => item.revisions)
      .flatMap(revision => revision.routings)
      .some(routing => routing.id === selectedRoutingId);
    if (!exists) {
      setSelectedRoutingId(null);
    }
  }, [workspaceItems, selectedRoutingId]);

  const selectedRouting = useMemo<ExplorerRouting | null>(() => {
    if (!selectedRoutingId) {
      return null;
    }
    for (const item of workspaceItems) {
      for (const revision of item.revisions) {
        const routing = revision.routings.find(r => r.id === selectedRoutingId);
        if (routing) {
          return routing;
        }
      }
    }
    return null;
  }, [workspaceItems, selectedRoutingId]);

  const selectedApprovalEvents = useMemo(() => {
    if (!selectedRoutingId) {
      return [] as ApprovalEvent[];
    }
    return approvalEvents[selectedRoutingId] ?? [];
  }, [approvalEvents, selectedRoutingId]);

  const firstRouting = useMemo(() => {
    for (const item of workspaceItems) {
      for (const revision of item.revisions) {
        if (revision.routings.length > 0) {
          return revision.routings[0];
        }
      }
    }
    return null;
  }, [workspaceItems]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (isEditableElement(event.target)) {
        return;
      }

      if (event.ctrlKey && !event.shiftKey && !event.metaKey && !event.altKey) {
        if (event.key === 'ArrowRight') {
          const currentIndex = TAB_ORDER.indexOf(activeTab);
          const nextIndex = (currentIndex + 1) % TAB_ORDER.length;
          setActiveTab(TAB_ORDER[nextIndex]);
          event.preventDefault();
          return;
        }
        if (event.key === 'ArrowLeft') {
          const currentIndex = TAB_ORDER.indexOf(activeTab);
          const previousIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
          setActiveTab(TAB_ORDER[previousIndex]);
          event.preventDefault();
          return;
        }
        if (event.code === 'Space') {
          event.preventDefault();
          if (selectedRoutingId) {
            setSelectedRoutingId(null);
          } else if (firstRouting) {
            setSelectedRoutingId(firstRouting.id);
          }
          return;
        }
        if (event.key === '1' || event.key === '2' || event.key === '3') {
          const index = Number(event.key) - 1;
          if (TAB_ORDER[index]) {
            setActiveTab(TAB_ORDER[index]);
            event.preventDefault();
            return;
          }
        }
      }

      if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key === 'Escape') {
        setSelectedRoutingId(null);
        setActiveTab('summary');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, firstRouting, selectedRoutingId]);

  const summaryItems = useMemo(
    () => [
      { label: 'Generated At', value: new Date(generatedAt).toLocaleString() },
      { label: 'Items', value: workspaceItems.length.toString() },
      { label: 'Source', value: source === 'mock' ? 'Mock' : 'API' },
      { label: 'Status', value: isError ? 'Error' : isFetching ? 'Fetching' : 'Ready' }
    ],
    [generatedAt, workspaceItems.length, source, isError, isFetching]
  );

  const tabs = useMemo(
    () => [
      {
        key: 'summary',
        label: 'Summary',
        children: selectedRouting ? (
          <div className="flex flex-col gap-2">
            <Paragraph>
              <Text strong>Routing Code:</Text> {selectedRouting.code}
            </Paragraph>
            <Paragraph>
              <Text strong>Status:</Text> {selectedRouting.status}
            </Paragraph>
            <Paragraph>
              <Text strong>CAM Revision:</Text> {selectedRouting.camRevision}
            </Paragraph>
          </div>
        ) : (
          <Empty description="Select a routing to view details" />
        )
      },
      {
        key: 'history',
        label: 'History',
        children: <Empty description="History panel pending" />
      },
      {
        key: 'files',
        label: 'Files',
        children: selectedRouting ? (
          <ul className="list-disc pl-5">
            {selectedRouting.files.map(file => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <Empty description="Select a routing to view files" />
        )
      }
    ],
    [selectedRouting]
  );

  const isDirty = useMemo(() => {
    return JSON.stringify(workspaceItems) !== JSON.stringify(items);
  }, [workspaceItems, items]);

  const selectedAddinJob = useMemo(() => {
    if (!selectedRoutingId) {
      return null;
    }
    return addinJobs.find(job => job.routingId === selectedRoutingId) ?? null;
  }, [addinJobs, selectedRoutingId]);

  const appendApprovalEvent = (
    routingId: string,
    payload: { decision: ApprovalDecision; actor: string; comment: string; source: ApprovalEvent['source']; createdAt?: string }
  ) => {
    const event = createApprovalEvent({ routingId, ...payload });
    setApprovalEvents(prev => ({
      ...prev,
      [routingId]: [event, ...(prev[routingId] ?? [])]
    }));
    return event;
  };

  const updateRoutingStatus = (routingId: string, nextStatus: ExplorerRouting['status']) => {
    setWorkspaceItems(current => {
      const draft = cloneExplorerItems(current);
      let updated = false;
      for (const item of draft) {
        for (const revision of item.revisions) {
          const routing = revision.routings.find(r => r.id === routingId);
          if (routing) {
            if (routing.status !== nextStatus) {
              routing.status = nextStatus;
              updated = true;
            }
            break;
          }
        }
      }
      if (!updated) {
        return current;
      }
      setUndoStack(prev => [...prev, cloneExplorerItems(current)]);
      setRedoStack([]);
      return draft;
    });
  };

  const handleReorder = (payload: TreePanelReorderPayload) => {
    setWorkspaceItems(current => {
      const next = applyReorder(current, payload);
      if (JSON.stringify(next) === JSON.stringify(current)) {
        return current;
      }
      setUndoStack(prev => [...prev, cloneExplorerItems(current)]);
      setRedoStack([]);
      return next;
    });
  };

  const handleUndo = () => {
    if (!undoStack.length) {
      return;
    }
    const previousSnapshot = undoStack[undoStack.length - 1];
    const currentSnapshot = cloneExplorerItems(workspaceItems);
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentSnapshot]);
    setWorkspaceItems(cloneExplorerItems(previousSnapshot));
  };

  const handleRedo = () => {
    if (!redoStack.length) {
      return;
    }
    const nextSnapshot = redoStack[redoStack.length - 1];
    const currentSnapshot = cloneExplorerItems(workspaceItems);
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, currentSnapshot]);
    setWorkspaceItems(cloneExplorerItems(nextSnapshot));
  };

  const handleApprovalSubmit = (decision: 'approved' | 'rejected', comment: string) => {
    if (!selectedRouting) {
      messageApi.warning('Routing을 먼저 선택하세요.');
      return;
    }
    const nextStatus: ExplorerRouting['status'] = decision === 'approved' ? 'Approved' : 'Rejected';
    updateRoutingStatus(selectedRouting.id, nextStatus);
    appendApprovalEvent(selectedRouting.id, {
      decision,
      actor: 'workspace.user',
      comment,
      source: 'user'
    });
    void submitApprovalDecision({ routingId: selectedRouting.id, decision, comment });
  };

  const handleQueueJob = () => {
    if (!selectedRouting) {
      messageApi.warning('Routing을 먼저 선택하세요.');
      return;
    }
    const context = findRoutingContext(workspaceItems, selectedRouting.id);
    if (!context) {
      messageApi.error('선택한 Routing 정보를 찾을 수 없습니다.');
      return;
    }
    const now = new Date().toISOString();
    const newJob: AddinJob = {
      id: createJobId(),
      routingId: selectedRouting.id,
      routingCode: selectedRouting.code,
      itemName: `${context.item.code} · ${context.item.name}`,
      revisionCode: context.revision.code,
      status: 'queued',
      requestedBy: 'operator.mock',
      createdAt: now,
      updatedAt: now,
      lastMessage: '수동 큐잉 완료'
    };
    setAddinJobs(prev => [newJob, ...prev]);
    appendApprovalEvent(selectedRouting.id, {
      decision: 'pending',
      actor: 'operator.mock',
      comment: 'Add-in 작업이 큐에 추가되었습니다.',
      source: 'user'
    });
    void manageAddinJob({ routingId: selectedRouting.id, operation: 'queue' });
    messageApi.success(`${selectedRouting.code} Add-in 작업이 큐에 추가되었습니다.`);
  };

  const handleRetryJob = (jobId: string) => {
    const target = addinJobs.find(job => job.id === jobId);
    if (!target) {
      messageApi.error('대상 작업을 찾을 수 없습니다.');
      return;
    }
    const now = new Date().toISOString();
    setAddinJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? {
              ...job,
              status: 'queued',
              updatedAt: now,
              lastMessage: '재시도 요청'
            }
          : job
      )
    );
    appendApprovalEvent(target.routingId, {
      decision: 'pending',
      actor: 'operator.mock',
      comment: '사용자가 재시도를 요청했습니다.',
      source: 'user'
    });
    void manageAddinJob({ routingId: target.routingId, operation: 'retry' });
    messageApi.success('재시도 요청이 큐에 반영되었습니다.');
  };

  const handleCancelJob = (jobId: string) => {
    const target = addinJobs.find(job => job.id === jobId);
    if (!target) {
      messageApi.error('대상 작업을 찾을 수 없습니다.');
      return;
    }
    const now = new Date().toISOString();
    setAddinJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? {
              ...job,
              status: 'cancelled',
              updatedAt: now,
              lastMessage: '사용자 취소'
            }
          : job
      )
    );
    appendApprovalEvent(target.routingId, {
      decision: 'rejected',
      actor: 'operator.mock',
      comment: '사용자가 Add-in 작업을 취소했습니다.',
      source: 'user'
    });
    updateRoutingStatus(target.routingId, 'Rejected');
    void manageAddinJob({ routingId: target.routingId, operation: 'cancel', reason: 'user-cancelled' });
    messageApi.warning('작업이 취소 상태로 전환되었습니다.');
  };

  useEffect(() => {
    if (signalRState !== 'connected') {
      return;
    }
    const interval = window.setInterval(() => {
      let nextEvent: { job: AddinJob; status: AddinJobStatus } | null = null;
      const nextTimestamp = new Date().toISOString();
      setAddinJobs(prev => {
        const queuedIndex = prev.findIndex(job => job.status === 'queued');
        if (queuedIndex !== -1) {
          const next = prev.map((job, index) =>
            index === queuedIndex
              ? {
                  ...job,
                  status: 'running',
                  updatedAt: nextTimestamp,
                  lastMessage: 'SignalR: 작업 시작'
                }
              : job
          );
          nextEvent = { job: { ...next[queuedIndex] }, status: 'running' };
          return next;
        }
        const runningIndex = prev.findIndex(job => job.status === 'running');
        if (runningIndex !== -1) {
          const succeeded = Math.random() < 0.85;
          const nextStatus: AddinJobStatus = succeeded ? 'succeeded' : 'failed';
          const next = prev.map((job, index) =>
            index === runningIndex
              ? {
                  ...job,
                  status: nextStatus,
                  updatedAt: nextTimestamp,
                  lastMessage: succeeded ? 'SignalR: 작업 완료' : 'SignalR: 작업 실패'
                }
              : job
          );
          nextEvent = { job: { ...next[runningIndex] }, status: nextStatus };
          return next;
        }
        return prev;
      });
      if (nextEvent) {
        if (nextEvent.status === 'succeeded') {
          appendApprovalEvent(nextEvent.job.routingId, {
            decision: 'approved',
            actor: 'signalr.mock',
            comment: 'SignalR: Add-in 작업이 성공적으로 완료되었습니다.',
            source: 'signalr'
          });
          updateRoutingStatus(nextEvent.job.routingId, 'Approved');
          messageApi.success(`${nextEvent.job.routingCode} 작업이 완료되었습니다.`);
        } else if (nextEvent.status === 'failed') {
          appendApprovalEvent(nextEvent.job.routingId, {
            decision: 'rejected',
            actor: 'signalr.mock',
            comment: 'SignalR: Add-in 작업이 실패했습니다.',
            source: 'signalr'
          });
          updateRoutingStatus(nextEvent.job.routingId, 'Rejected');
          messageApi.error(`${nextEvent.job.routingCode} 작업이 실패했습니다.`);
        } else if (nextEvent.status === 'running') {
          appendApprovalEvent(nextEvent.job.routingId, {
            decision: 'pending',
            actor: 'signalr.mock',
            comment: 'SignalR: Add-in 작업이 시작되었습니다.',
            source: 'signalr'
          });
          messageApi.info(`${nextEvent.job.routingCode} 작업이 시작되었습니다.`);
        }
      }
    }, 3200);
    return () => window.clearInterval(interval);
  }, [signalRState, messageApi]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSignalRState(prev => {
        if (prev === 'connected' && Math.random() < 0.08) {
          return 'disconnected';
        }
        return prev;
      });
    }, 25000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (signalRState !== 'disconnected') {
      return;
    }
    const timer = window.setTimeout(() => {
      setSignalRState('reconnecting');
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [signalRState]);

  useEffect(() => {
    if (signalRState !== 'reconnecting') {
      return;
    }
    const timer = window.setTimeout(() => {
      setSignalRState('connected');
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [signalRState]);

  const previousConnectionRef = useRef<SignalRConnectionState>('connected');
  useEffect(() => {
    if (previousConnectionRef.current !== signalRState) {
      if (signalRState === 'disconnected') {
        messageApi.warning('SignalR 연결이 끊어졌습니다 (Mock).');
      } else if (signalRState === 'reconnecting') {
        messageApi.info('SignalR 재연결을 시도합니다...');
      } else if (signalRState === 'connected' && previousConnectionRef.current !== 'connected') {
        messageApi.success('SignalR 연결이 복구되었습니다.');
      }
    }
    previousConnectionRef.current = signalRState;
  }, [signalRState, messageApi]);

  const handleReconnect = () => {
    if (signalRState === 'connected') {
      messageApi.info('이미 SignalR에 연결되어 있습니다.');
      return;
    }
    setSignalRState('reconnecting');
  };

  const addinBadgeStatus = selectedAddinJob
    ? mapJobStatusToBadge(selectedAddinJob.status)
    : selectedRouting
    ? 'idle'
    : 'idle';

  const addinBadgeMessage = selectedAddinJob
    ? selectedAddinJob.lastMessage ?? 'Add-in 상태 정보 없음'
    : selectedRouting
    ? `${selectedRouting.code} 작업을 큐에 추가할 수 있습니다.`
    : 'Routing을 선택하면 Add-in 상태를 확인할 수 있습니다.';

  return (
    <>
      {contextHolder}
      <div className="flex gap-6">
        <TreePanel
          items={workspaceItems}
          selectedKey={selectedRoutingId}
          onReorder={handleReorder}
          onSelect={routingId => {
            if (!routingId) {
              setSelectedRoutingId(null);
              return;
            }
            setSelectedRoutingId(routingId);
            setActiveTab('summary');
          }}
        />
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge status={isDirty ? 'processing' : 'default'} text={isDirty ? 'Unsaved changes' : 'All changes saved'} />
            <Space>
              <Button icon={<UndoOutlined />} disabled={!undoStack.length} onClick={handleUndo}>
                Undo
              </Button>
              <Button icon={<RedoOutlined />} disabled={!redoStack.length} onClick={handleRedo}>
                Redo
              </Button>
            </Space>
          </div>
          <Card title="Explorer Summary" bordered>
            <div className="grid grid-cols-2 gap-3">
              {summaryItems.map(item => (
                <div key={item.label}>
                  <Text strong>{item.label}:</Text> {item.value}
                </div>
              ))}
            </div>
            <Paragraph type="secondary" className="mt-4 text-sm">
              Shortcuts: Ctrl+Left/Right tab switch | Ctrl+1/2/3 direct tabs | Ctrl+Space toggle selection | Esc clear selection
            </Paragraph>
            {isError && (
              <Alert
                className="mt-4"
                type="error"
                message="Failed to load explorer data."
                description={(error as Error | undefined)?.message}
                showIcon
              />
            )}
          </Card>
          <Card bordered>
            {isFetching && !isError ? (
              <div className="flex justify-center py-10">
                <Spin tip="Loading explorer data" />
              </div>
            ) : (
              <Tabs activeKey={activeTab} onChange={key => setActiveTab(key as TabKey)} items={tabs} />
            )}
          </Card>
          <Card title="Workspace Uploads" bordered>
            <WorkspaceUploadPanel routing={selectedRouting} />
          </Card>
          <Card title="meta.json (Mock)" bordered>
            <WorkspaceMetaPanel routing={selectedRouting} />
          </Card>
          <Card title="승인/반려 워크플로우" bordered>
            <ApprovalPanel routing={selectedRouting} events={selectedApprovalEvents} onSubmit={handleApprovalSubmit} />
          </Card>
          <Card
            title="Add-in Control Panel"
            bordered
            extra={<AddinBadge status={addinBadgeStatus} message={addinBadgeMessage} />}
          >
            <AddinControlPanel
              jobs={addinJobs}
              selectedRouting={selectedRouting}
              onQueueJob={handleQueueJob}
              onRetryJob={handleRetryJob}
              onCancelJob={handleCancelJob}
              connectionState={signalRState}
              onReconnect={handleReconnect}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

