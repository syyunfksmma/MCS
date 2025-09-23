export type RoutingStatus = 'Draft' | 'PendingApproval' | 'Approved' | 'Rejected';

export interface ExplorerFile {
  id: string;
  name: string;
  type: 'esprit' | 'nc' | 'meta' | 'other';
}

export interface ExplorerRouting {
  id: string;
  code: string;
  status: RoutingStatus;
  camRevision: string;
  files: ExplorerFile[];
}

export interface ExplorerRoutingGroup {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  routings: ExplorerRouting[];
}

export interface ExplorerRevision {
  id: string;
  code: string;
  routingGroups: ExplorerRoutingGroup[];
}

export interface ExplorerItem {
  id: string;
  code: string;
  name: string;
  revisions: ExplorerRevision[];
}

export type ExplorerSource = 'mock' | 'api';

export type AddinJobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export interface AddinJob {
  id: string;
  routingId: string;
  routingCode: string;
  itemName: string;
  revisionCode: string;
  status: AddinJobStatus;
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}

export type ApprovalDecision = 'pending' | 'approved' | 'rejected';

export type ApprovalEventSource = 'user' | 'system' | 'signalr';

export interface ApprovalEvent {
  id: string;
  routingId: string;
  decision: ApprovalDecision;
  actor: string;
  comment: string;
  createdAt: string;
  source: ApprovalEventSource;
}

export type ApprovalEventMap = Record<string, ApprovalEvent[]>;

export interface ExplorerResponse {
  items: ExplorerItem[];
  generatedAt: string;
  source: ExplorerSource;
  addinJobs?: AddinJob[];
  approvalEvents?: ApprovalEventMap;
}
