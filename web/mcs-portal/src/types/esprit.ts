export type EspritJobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface EspritJob {
  id: string;
  routingId: string;
  routingCode: string;
  jobType: string;
  status: EspritJobStatus;
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
  priority?: 'normal' | 'high';
  notes?: string;
  logSnippet?: string;
}

export interface EspritApiKey {
  value: string;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
  description?: string;
}
