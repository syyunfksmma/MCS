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

export interface ExplorerRevision {
  id: string;
  code: string;
  routings: ExplorerRouting[];
}

export interface ExplorerItem {
  id: string;
  code: string;
  name: string;
  revisions: ExplorerRevision[];
}

export type ExplorerSource = "mock" | "api";

export interface ExplorerResponse {
  items: ExplorerItem[];
  generatedAt: string;
  source: ExplorerSource;
}
