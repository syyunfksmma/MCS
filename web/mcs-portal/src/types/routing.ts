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
  isLegacyHidden: boolean;
  legacyHiddenAt?: string | null;
  legacyHiddenBy?: string | null;
  owner?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  stepCount: number;
  fileCount: number;
  history: RoutingVersionHistory[];
}

export interface RoutingMetaFile {
  fileName: string;
  fileType: string;
  relativePath: string;
  checksum: string;
  isPrimary: boolean;
  uploadedBy: string;
  uploadedAt: string;
}

export interface RoutingMeta {
  routingId: string;
  camRevision?: string | null;
  metaPath: string;
  files: RoutingMetaFile[];
  latestHistoryId?: string | null;
  requiresResync?: boolean;
  missingFiles?: string[] | null;
}
