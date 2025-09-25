export type SolidWorksStatus = 'present' | 'missing' | 'unknown';

export interface ProductSummary {
  id: string;
  code: string;
  name: string;
  latestRevision?: string;
  revisionCount: number;
  routingGroupCount: number;
  routingCount: number;
  solidWorksPath?: string;
  solidWorksStatus: SolidWorksStatus;
  updatedAt: string;
  owner?: string;
}

export interface ProductDashboardResponse {
  source: 'mock' | 'api';
  generatedAt: string;
  total: number;
  items: ProductSummary[];
}

export interface ProductSearchSummary {
  query: string;
  filters?: {
    solidWorks?: SolidWorksStatus[];
  };
}
