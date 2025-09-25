import { getApiBaseUrl } from './env';

export type AdminStatus = 'active' | 'disabled' | 'locked';

export interface AdminAccount {
  id: string;
  displayName: string;
  email: string;
  department: string;
  role: string;
  status: AdminStatus;
  directoryGroups?: string[];
  lastUpdated: string;
}

export interface AdminDirectoryGroup {
  id: string;
  name: string;
  type: 'security' | 'distribution';
}

export type ApiKeyScope = 'workspace' | 'admin' | 'ops';

export interface AdminApiKey {
  id: string;
  label: string;
  scope: ApiKeyScope;
  maskedKey: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt?: string;
  createdBy: string;
  status: 'active' | 'revoked';
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  owner: string;
  updatedAt: string;
}

export interface EnvironmentMessage {
  id: string;
  environment: 'dev' | 'stage' | 'prod';
  message: string;
  active: boolean;
  updatedAt: string;
}

export type AuditSeverity = 'Info' | 'Warning' | 'Critical';

export interface AuditLogEntry {
  id: string;
  category: string;
  action: string;
  severity: AuditSeverity;
  summary: string;
  details?: string;
  routingId?: string;
  historyEntryId?: string;
  eventAt: string;
  createdBy: string;
  metadataJson?: string;
  traceId?: string;
  requestId?: string;
}

export interface AuditLogQueryOptions {
  from?: string;
  to?: string;
  category?: string;
  action?: string;
  createdBy?: string;
  routingId?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogSearchResult {
  items: AuditLogEntry[];
  totalCount: number;
  page: number;
  pageSize: number;
  source: 'api' | 'mock';
}

export interface AuditAlert {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
}

export interface AuditLogStatistics {
  from: string;
  to: string;
  totalEvents: number;
  approvalEvents: number;
  rejectionEvents: number;
  criticalEvents: number;
  pendingApprovalAverageHours: number;
  eventsByCategory: Record<string, number>;
  eventsByActor: Record<string, number>;
  alerts: AuditAlert[];
  source: 'api' | 'mock';
}

export interface ApprovalHistoryEntry {
  id: string;
  changeType: string;
  field?: string;
  previousValue?: string;
  currentValue?: string;
  outcome: string;
  createdAt: string;
  createdBy: string;
  comment?: string;
}

export const ADMIN_STATUS_META: Record<
  AdminStatus,
  { label: string; actionLabel: string; description: string; tagColor: string }
> = {
  active: {
    label: '활성',
    actionLabel: '활성화',
    description: '사용자를 활성 상태로 전환합니다.',
    tagColor: 'green'
  },
  disabled: {
    label: '비활성',
    actionLabel: '비활성화',
    description: '임시로 로그인 및 API 사용을 제한합니다.',
    tagColor: 'default'
  },
  locked: {
    label: '잠금',
    actionLabel: '잠금',
    description: '보안 잠금 상태로 전환합니다. 2차 인증 확인 필요.',
    tagColor: 'orange'
  }
};

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const generateKeyId = () => `key-${Math.random().toString(36).slice(2, 8)}`;
const generatePlaintextKey = () =>
  `sk_live_${Math.random().toString(36).slice(2, 18)}`;
const maskApiKey = (key: string) => `${key.slice(0, 8)}****${key.slice(-4)}`;

const MOCK_ADMINS: AdminAccount[] = [
  {
    id: 'admin-1',
    displayName: 'Doyun Kim',
    email: 'doyun.kim@example.com',
    department: 'Production Engineering',
    role: 'Workspace Manager',
    status: 'active',
    directoryGroups: ['MCMS-Admins', 'MCMS-Workspace'],
    lastUpdated: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'admin-2',
    displayName: 'Seohyun Lee',
    email: 'seohyun.lee@example.com',
    department: 'Quality Assurance',
    role: 'QA Lead',
    status: 'locked',
    directoryGroups: ['MCMS-Admins'],
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'admin-3',
    displayName: 'Jihoon Park',
    email: 'jihoon.park@example.com',
    department: 'Operations',
    role: 'Ops Supervisor',
    status: 'disabled',
    directoryGroups: ['MCMS-Ops'],
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

const MOCK_GROUPS: AdminDirectoryGroup[] = [
  { id: 'grp-admin', name: 'MCMS-Admins', type: 'security' },
  { id: 'grp-workspace', name: 'MCMS-Workspace', type: 'security' },
  { id: 'grp-ops', name: 'MCMS-Ops', type: 'distribution' }
];

let MOCK_API_KEYS: AdminApiKey[] = [
  {
    id: 'key-1',
    label: 'Playwright 테스트',
    scope: 'workspace',
    maskedKey: 'sk_live_18d3****a91b',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdBy: 'qa.bot',
    status: 'active'
  },
  {
    id: 'key-2',
    label: 'Lighthouse 모니터링',
    scope: 'ops',
    maskedKey: 'sk_live_9821****c7d2',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'ops.supervisor',
    status: 'revoked'
  }
];

let MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'flag-admin-v2',
    key: 'admin.v2',
    name: 'Admin Console v2',
    description: '새로운 Admin Console UI 공개',
    enabled: true,
    rolloutPercentage: 100,
    owner: 'product.admin',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'flag-maintenance-banner',
    key: 'ui.maintenance.banner',
    name: 'Maintenance Banner',
    description: '사전 공지 배너 노출',
    enabled: true,
    rolloutPercentage: 50,
    owner: 'ops.bridge',
    updatedAt: new Date().toISOString()
  }
];

let MOCK_ENV_MESSAGES: EnvironmentMessage[] = [
  {
    id: 'env-dev',
    environment: 'dev',
    message: 'Dev 환경: Mock 데이터가 주기적으로 재설정됩니다.',
    active: true,
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'env-stage',
    environment: 'stage',
    message: 'Stage 환경: 승인 플로우가 QA 검증 중입니다.',
    active: true,
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'env-prod',
    environment: 'prod',
    message: 'Production: 긴급 점검 예정 없음.',
    active: false,
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const MOCK_APPROVAL_HISTORY: Record<string, ApprovalHistoryEntry[]> = {
  routing_gt310001: [
    {
      id: 'hist-gt31-request',
      changeType: 'ApprovalRequested',
      outcome: 'Pending',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      createdBy: 'doyun.kim',
      comment: 'Shift A handoff request'
    },
    {
      id: 'hist-gt31-review',
      changeType: 'RoutingReviewed',
      field: 'Status',
      previousValue: 'Draft',
      currentValue: 'PendingApproval',
      outcome: 'Approved',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      createdBy: 'qa.bot',
      comment: 'Automated checks passed'
    },
    {
      id: 'hist-gt31-approve',
      changeType: 'RoutingApproved',
      field: 'Status',
      previousValue: 'PendingApproval',
      currentValue: 'Approved',
      outcome: 'Approved',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      createdBy: 'seohyun.lee',
      comment: 'Ready for release'
    }
  ],
  routing_sh2001: [
    {
      id: 'hist-sh20-request',
      changeType: 'ApprovalRequested',
      outcome: 'Pending',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      createdBy: 'jihoon.park',
      comment: 'Re-run with updated tooling offsets'
    },
    {
      id: 'hist-sh20-reject',
      changeType: 'RoutingRejected',
      field: 'Status',
      previousValue: 'PendingApproval',
      currentValue: 'Rejected',
      outcome: 'Rejected',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdBy: 'qa.lead',
      comment: 'Fixture clash detected at step 4'
    }
  ]
};

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    category: 'Approval',
    action: 'ApprovalRequested',
    severity: 'Info',
    summary: 'Routing GT310001 approval requested',
    details: 'Shift lead submitted for QA review',
    routingId: 'routing_gt310001',
    historyEntryId: 'hist-gt31-request',
    eventAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    createdBy: 'doyun.kim'
  },
  {
    id: 'audit-2',
    category: 'Approval',
    action: 'RoutingApproved',
    severity: 'Info',
    summary: 'Routing GT310001 approved',
    details: 'QA supervisor approved with no conditions',
    routingId: 'routing_gt310001',
    historyEntryId: 'hist-gt31-approve',
    eventAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdBy: 'seohyun.lee'
  },
  {
    id: 'audit-3',
    category: 'Approval',
    action: 'RoutingRejected',
    severity: 'Warning',
    summary: 'Routing SH2001 rejected',
    details: 'Collision detected at machine SH-01 step 4',
    routingId: 'routing_sh2001',
    historyEntryId: 'hist-sh20-reject',
    eventAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: 'qa.lead'
  },
  {
    id: 'audit-4',
    category: 'Security',
    action: 'AdminLoginFailure',
    severity: 'Warning',
    summary: 'Login failure for ops.supervisor',
    details: 'MFA challenge timed out after 90 seconds',
    eventAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    createdBy: 'ops.supervisor',
    traceId: 'trace-login-4821'
  },
  {
    id: 'audit-5',
    category: 'Integration',
    action: 'GrafanaEmbedViewed',
    severity: 'Info',
    summary: 'Embedded dashboard viewed (Production KPI)',
    details: 'Admin console monitoring card viewed for 3 minutes',
    eventAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdBy: 'doyun.kim',
    traceId: 'trace-grafana-0027'
  }
];

const AUDIT_ACTION_MARKERS: Record<string, string> = {
  ApprovalRequested: 'REQ',
  RoutingApproved: 'APP',
  RoutingRejected: 'REJ',
  AdminLoginFailure: 'LOCK',
  GrafanaEmbedViewed: 'DASH'
};

const DEFAULT_AUDIT_PAGE_SIZE = 25;

const clone = <T>(items: T[]): T[] =>
  items.map((item) => structuredClone(item));

export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
  await delay();
  return clone(MOCK_ADMINS);
}

export async function fetchDirectoryGroups(): Promise<AdminDirectoryGroup[]> {
  await delay();
  return clone(MOCK_GROUPS);
}

export async function syncAdGroup({
  accountId,
  groupId
}: {
  accountId: string;
  groupId: string;
}): Promise<void> {
  console.info('syncAdGroup', accountId, groupId);
  await delay(80);
}

export async function fetchAdminApiKeys(): Promise<AdminApiKey[]> {
  await delay();
  return clone(MOCK_API_KEYS);
}

export async function issueAdminApiKey({
  label,
  scope,
  expiresAt,
  createdBy
}: {
  label: string;
  scope: ApiKeyScope;
  expiresAt: string;
  createdBy: string;
}): Promise<{ apiKey: AdminApiKey; plaintextKey: string }> {
  await delay();
  const id = generateKeyId();
  const plaintextKey = generatePlaintextKey();
  const maskedKey = maskApiKey(plaintextKey);
  const apiKey: AdminApiKey = {
    id,
    label,
    scope,
    maskedKey,
    createdAt: new Date().toISOString(),
    expiresAt,
    createdBy,
    status: 'active'
  };
  MOCK_API_KEYS = [apiKey, ...MOCK_API_KEYS];
  return { apiKey: structuredClone(apiKey), plaintextKey };
}

export async function revokeAdminApiKey({
  id,
  reason
}: {
  id: string;
  reason?: string;
}): Promise<void> {
  console.info('revokeAdminApiKey', id, reason);
  await delay();
  MOCK_API_KEYS = MOCK_API_KEYS.map((key) =>
    key.id === id
      ? {
          ...key,
          status: 'revoked',
          maskedKey: `${key.maskedKey.slice(0, 8)}****${key.maskedKey.slice(-4)}`
        }
      : key
  );
}

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
  await delay();
  return clone(MOCK_FEATURE_FLAGS);
}

export async function updateFeatureFlag({
  id,
  enabled,
  rolloutPercentage
}: {
  id: string;
  enabled: boolean;
  rolloutPercentage: number;
}): Promise<FeatureFlag> {
  await delay();
  MOCK_FEATURE_FLAGS = MOCK_FEATURE_FLAGS.map((flag) =>
    flag.id === id
      ? {
          ...flag,
          enabled,
          rolloutPercentage,
          updatedAt: new Date().toISOString()
        }
      : flag
  );
  const updated = MOCK_FEATURE_FLAGS.find((flag) => flag.id === id);
  if (!updated) {
    throw new Error('Feature flag not found');
  }
  return structuredClone(updated);
}

export async function fetchEnvironmentMessages(): Promise<
  EnvironmentMessage[]
> {
  await delay();
  return clone(MOCK_ENV_MESSAGES);
}

export async function updateEnvironmentMessage({
  id,
  message,
  active
}: {
  id: string;
  message: string;
  active: boolean;
}): Promise<EnvironmentMessage> {
  await delay();
  MOCK_ENV_MESSAGES = MOCK_ENV_MESSAGES.map((item) =>
    item.id === id
      ? {
          ...item,
          message,
          active,
          updatedAt: new Date().toISOString()
        }
      : item
  );
  const updated = MOCK_ENV_MESSAGES.find((item) => item.id === id);
  if (!updated) {
    throw new Error('Environment message not found');
  }
  return structuredClone(updated);
}

const applyAuditFilters = (
  logs: AuditLogEntry[],
  options: AuditLogQueryOptions
): AuditLogEntry[] => {
  const from = options.from ? Date.parse(options.from) : undefined;
  const to = options.to ? Date.parse(options.to) : undefined;
  const category = options.category?.toLowerCase();
  const action = options.action?.toLowerCase();
  const createdBy = options.createdBy?.toLowerCase();
  const routingId = options.routingId?.toLowerCase();

  return logs.filter((log) => {
    const timestamp = Date.parse(log.eventAt);
    if (
      Number.isFinite(from) &&
      from !== undefined &&
      timestamp < (from ?? 0)
    ) {
      return false;
    }
    if (Number.isFinite(to) && to !== undefined && timestamp > (to ?? 0)) {
      return false;
    }
    if (category && log.category.toLowerCase() !== category) {
      return false;
    }
    if (action && log.action.toLowerCase() !== action) {
      return false;
    }
    if (createdBy && !log.createdBy.toLowerCase().includes(createdBy)) {
      return false;
    }
    if (routingId) {
      const current = log.routingId?.toLowerCase();
      if (!current || !current.includes(routingId)) {
        return false;
      }
    }
    return true;
  });
};

const paginateAuditLogs = (
  logs: AuditLogEntry[],
  options: AuditLogQueryOptions
): AuditLogSearchResult => {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.max(1, options.pageSize ?? DEFAULT_AUDIT_PAGE_SIZE);
  const start = (page - 1) * pageSize;
  const sorted = logs
    .slice()
    .sort((a, b) => Date.parse(b.eventAt) - Date.parse(a.eventAt));
  const items = sorted.slice(start, start + pageSize);

  return {
    items: clone(items),
    totalCount: logs.length,
    page,
    pageSize,
    source: 'mock'
  };
};

const buildAuditCsv = (logs: AuditLogEntry[]): string => {
  const lines: string[] = [
    'Timestamp,Category,Action,Severity,Actor,Summary,RoutingId,HistoryEntryId,TraceId,RequestId'
  ];
  for (const log of logs) {
    const summary = (log.summary ?? '').replace(/"/g, '""');
    const actor = (log.createdBy ?? '').replace(/"/g, '""');
    const line = [
      new Date(log.eventAt).toISOString(),
      log.category,
      log.action,
      log.severity,
      actor,
      summary,
      log.routingId ?? '',
      log.historyEntryId ?? '',
      log.traceId ?? '',
      log.requestId ?? ''
    ].join(',');
    lines.push(line);
  }
  return lines.join('\n');
};

const computeAuditStatistics = (
  logs: AuditLogEntry[],
  fromIso: string,
  toIso: string,
  source: 'api' | 'mock'
): AuditLogStatistics => {
  const totalEvents = logs.length;
  const approvalEvents = logs.filter(
    (item) => item.category.toLowerCase() === 'approval'
  ).length;
  const rejectionEvents = logs.filter(
    (item) => item.action === 'RoutingRejected'
  ).length;
  const criticalEvents = logs.filter(
    (item) => item.severity === 'Critical'
  ).length;

  const eventsByCategory = Object.fromEntries(
    logs.reduce((map, log) => {
      const key = log.category || 'Uncategorized';
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  );

  const eventsByActor = Object.fromEntries(
    logs.reduce((map, log) => {
      const key = log.createdBy || 'unknown';
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  );

  const requestMap = new Map<string, number>();
  for (const log of logs) {
    if (log.action === 'ApprovalRequested' && log.routingId) {
      const ts = Date.parse(log.eventAt);
      const current = requestMap.get(log.routingId);
      if (Number.isFinite(ts) && (current === undefined || ts < current)) {
        requestMap.set(log.routingId, ts);
      }
    }
  }

  const durations: number[] = [];
  for (const log of logs) {
    if (!log.routingId) continue;
    if (log.action === 'RoutingApproved' || log.action === 'RoutingRejected') {
      const requestTs = requestMap.get(log.routingId);
      const decisionTs = Date.parse(log.eventAt);
      if (
        requestTs !== undefined &&
        Number.isFinite(decisionTs) &&
        decisionTs >= requestTs
      ) {
        durations.push((decisionTs - requestTs) / (1000 * 60 * 60));
      }
    }
  }

  const pendingApprovalAverageHours = durations.length
    ? durations.reduce((sum, value) => sum + value, 0) / durations.length
    : 0;

  const alerts: AuditAlert[] = [];
  const nowIso = new Date().toISOString();

  if (criticalEvents > 0) {
    alerts.push({
      id: 'critical-events',
      title: 'Critical audit events detected',
      severity: 'critical',
      message: `${criticalEvents} critical events recorded in the selected window.`,
      createdAt: nowIso
    });
  }

  if (totalEvents > 0) {
    const rejectionRate = rejectionEvents / totalEvents;
    if (rejectionRate >= 0.25) {
      const rejectionPercentage = Math.round(rejectionRate * 1000) / 10;
      alerts.push({
        id: 'high-rejection-rate',
        title: 'High rejection rate',
        severity: 'warning',
        message: `Rejection rate is ${rejectionPercentage}% of total audit events.`,
        createdAt: nowIso
      });
    }
  }

  if (pendingApprovalAverageHours >= 12) {
    const averageHours = Math.round(pendingApprovalAverageHours * 10) / 10;
    alerts.push({
      id: 'approval-sla',
      title: 'Approval SLA at risk',
      severity: 'warning',
      message: `Average approval turnaround is ${averageHours}h. Target is under 12h.`,
      createdAt: nowIso
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'all-clear',
      title: 'No anomalies detected',
      severity: 'info',
      message: 'Audit activity within normal thresholds.',
      createdAt: nowIso
    });
  }
  return {
    from: fromIso,
    to: toIso,
    totalEvents,
    approvalEvents,
    rejectionEvents,
    criticalEvents,
    pendingApprovalAverageHours,
    eventsByCategory,
    eventsByActor,
    alerts,
    source
  };
};

const resolveRange = (
  options: AuditLogQueryOptions
): { from: string; to: string } => {
  const now = new Date();
  const to = options.to ? new Date(options.to) : now;
  const from = options.from
    ? new Date(options.from)
    : new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    from: new Date(from).toISOString(),
    to: new Date(to).toISOString()
  };
};

const getMockAuditLogs = (
  options: AuditLogQueryOptions
): AuditLogSearchResult => {
  const filtered = applyAuditFilters(MOCK_AUDIT_LOGS, options);
  return paginateAuditLogs(filtered, options);
};

export async function fetchAuditLogs(
  options: AuditLogQueryOptions = {}
): Promise<AuditLogSearchResult> {
  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    try {
      const params = new URLSearchParams();
      if (options.from) params.set('from', options.from);
      if (options.to) params.set('to', options.to);
      if (options.category) params.set('category', options.category);
      if (options.action) params.set('action', options.action);
      if (options.createdBy) params.set('createdBy', options.createdBy);
      if (options.routingId) params.set('routingId', options.routingId);
      params.set('page', String(Math.max(1, options.page ?? 1)));
      params.set(
        'pageSize',
        String(Math.max(1, options.pageSize ?? DEFAULT_AUDIT_PAGE_SIZE))
      );

      const response = await fetch(
        `${baseUrl}/api/audit-logs?${params.toString()}`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }
      const payload = (await response.json()) as Omit<
        AuditLogSearchResult,
        'source'
      >;
      return { ...payload, source: 'api' };
    } catch (error) {
      console.warn('[fetchAuditLogs] falling back to mock data:', error);
    }
  }
  return getMockAuditLogs(options);
}

export async function exportAuditLogsCsv(
  options: AuditLogQueryOptions = {}
): Promise<string> {
  const baseUrl = getApiBaseUrl();
  const filtered = applyAuditFilters(MOCK_AUDIT_LOGS, options);

  if (baseUrl) {
    try {
      const params = new URLSearchParams();
      if (options.from) params.set('from', options.from);
      if (options.to) params.set('to', options.to);
      if (options.category) params.set('category', options.category);
      if (options.action) params.set('action', options.action);
      if (options.createdBy) params.set('createdBy', options.createdBy);
      if (options.routingId) params.set('routingId', options.routingId);
      params.set('page', '1');
      params.set('pageSize', String(Math.max(1, options.pageSize ?? 5000)));

      const response = await fetch(
        `${baseUrl}/api/audit-logs/export?${params.toString()}`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error(`Failed to export audit logs: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn('[exportAuditLogsCsv] falling back to mock data:', error);
    }
  }

  return buildAuditCsv(filtered);
}

export async function fetchAuditStatistics(
  options: AuditLogQueryOptions = {}
): Promise<AuditLogStatistics> {
  const { from, to } = resolveRange(options);
  const baseUrl = getApiBaseUrl();

  if (baseUrl) {
    try {
      const params = new URLSearchParams();
      params.set('from', from);
      params.set('to', to);
      if (options.category) params.set('category', options.category);
      if (options.createdBy) params.set('createdBy', options.createdBy);
      if (options.routingId) params.set('routingId', options.routingId);

      const response = await fetch(
        `${baseUrl}/api/audit-logs/statistics?${params.toString()}`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch audit statistics: ${response.status}`);
      }
      const payload = (await response.json()) as Omit<
        AuditLogStatistics,
        'source'
      >;
      return { ...payload, source: 'api' };
    } catch (error) {
      console.warn('[fetchAuditStatistics] falling back to mock data:', error);
    }
  }

  const filtered = applyAuditFilters(MOCK_AUDIT_LOGS, { ...options, from, to });
  return computeAuditStatistics(filtered, from, to, 'mock');
}

export async function fetchApprovalHistory(
  routingId: string
): Promise<ApprovalHistoryEntry[]> {
  if (!routingId) {
    return [];
  }

  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    try {
      const response = await fetch(
        `${baseUrl}/api/routings/${routingId}/approval-history`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch approval history: ${response.status}`);
      }
      const payload = (await response.json()) as ApprovalHistoryEntry[];
      return payload;
    } catch (error) {
      console.warn('[fetchApprovalHistory] falling back to mock data:', error);
    }
  }

  return [...(MOCK_APPROVAL_HISTORY[routingId] ?? [])];
}

export function resolveAuditActionMarker(action: string): string {
  return AUDIT_ACTION_MARKERS[action] ?? '???';
}
