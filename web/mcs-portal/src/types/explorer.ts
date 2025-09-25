export type RoutingStatus =
  | 'Draft'
  | 'PendingApproval'
  | 'Approved'
  | 'Rejected';

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
  owner?: string;
  notes?: string;
  sharedDrivePath?: string;
  sharedDriveReady?: boolean;
  createdAt?: string;
  updatedAt?: string;
  files: ExplorerFile[];
}

export interface ExplorerRoutingGroup {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isDeleted?: boolean;
  updatedAt?: string;
  updatedBy?: string;
  sharedDrivePath?: string;
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

export type AddinJobStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

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

export interface RoutingHistoryEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  description?: string;
}

export type RoutingUploadStatusState =
  | 'pending'
  | 'uploading'
  | 'completed'
  | 'failed';

export interface RoutingUploadStatus {
  fileId: string;
  fileName: string;
  progress: number;
  state: RoutingUploadStatusState;
  checksum?: string;
  sizeBytes?: number;
  updatedAt?: string;
}

export interface RoutingDetailResponse {
  routing: ExplorerRouting;
  history: RoutingHistoryEvent[];
  uploads: RoutingUploadStatus[];
  generatedAt: string;
  source: ExplorerSource | 'mock';
  slaMs?: number;
}
