export interface WorkspaceApprovalPayload {
  routingId: string;
  decision: 'approved' | 'rejected';
  comment: string;
}

export interface WorkspaceApprovalResponse {
  success: boolean;
  approvalId: string;
  recordedAt: string;
}

export interface WorkspaceAddinJobPayload {
  routingId: string;
  operation: 'queue' | 'retry' | 'cancel';
  reason?: string;
}

export interface WorkspaceAddinJobResponse {
  success: boolean;
  jobId: string;
  status: 'queued' | 'running' | 'cancelled';
  updatedAt: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitApprovalDecision(
  payload: WorkspaceApprovalPayload
): Promise<WorkspaceApprovalResponse> {
  const { routingId, decision } = payload;
  await delay(180);
  return {
    success: true,
    approvalId: `approval-${routingId}-${decision}-${Date.now().toString(36)}`,
    recordedAt: new Date().toISOString()
  };
}

export async function manageAddinJob(
  payload: WorkspaceAddinJobPayload
): Promise<WorkspaceAddinJobResponse> {
  const { routingId, operation } = payload;
  await delay(160);
  return {
    success: true,
    jobId: `job-${routingId}-${operation}-${Date.now().toString(36)}`,
    status:
      operation === 'cancel'
        ? 'cancelled'
        : operation === 'queue'
          ? 'queued'
          : 'running',
    updatedAt: new Date().toISOString()
  };
}
