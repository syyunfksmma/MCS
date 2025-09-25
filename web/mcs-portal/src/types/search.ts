export interface RoutingSearchFilters {
  productCode?: string;
  groupId?: string;
  fileType?: string;
  owner?: string;
  updatedAfter?: string;
  updatedBefore?: string;
}

export interface RoutingSearchItem {
  routingId: string;
  routingCode: string;
  productCode: string;
  revisionCode: string;
  groupName: string;
  status: string;
  updatedAt?: string | null;
  sharedDrivePath?: string | null;
}

export type RoutingSearchSource = 'mock' | 'api';

export interface RoutingSearchResponse {
  items: RoutingSearchItem[];
  total: number;
  generatedAt: string;
  source: RoutingSearchSource;
  slaMs?: number | null;
}

export interface RoutingSearchResult extends RoutingSearchResponse {
  observedClientMs: number;
}
