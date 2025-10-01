import type { RoutingStatus } from '@/types/explorer';

export interface RoutingVersionHistory {
  historyId: string;
  changeType: string;
  comment?: string | null;
  actor: string;
  recordedAt: string;
}

export interface RoutingVersion {
  versionId: string;
  routingId: string;
  routingCode: string;
  camRevision: string;
  status: RoutingStatus;
  isPrimary: boolean;
  owner?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  stepCount: number;
  fileCount: number;
  history: RoutingVersionHistory[];
}
