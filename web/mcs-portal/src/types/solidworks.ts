export interface SolidWorksLink {
  linkId: string;
  itemRevisionId: string;
  routingId: string;
  modelPath: string;
  configuration?: string | null;
  isLinked: boolean;
  lastSyncedAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
}