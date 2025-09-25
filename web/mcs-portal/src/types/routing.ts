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
  camRevision: string | null;
  metaPath: string;
  files: RoutingMetaFile[];
  latestHistoryId?: string | null;
}
