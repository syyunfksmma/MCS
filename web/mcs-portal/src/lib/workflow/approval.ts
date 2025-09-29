import { getApiBaseUrl } from '@/lib/env';

type ApprovalDecisionPayload = {
  approve: boolean;
  comment?: string;
};

export async function submitApprovalDecision(
  routingId: string,
  payload: ApprovalDecisionPayload
) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { success: true, mocked: true };
  }
  const response = await fetch(`${baseUrl}/api/routings/${routingId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Approval request failed: ${response.status}`);
  }
  return (await response.json()) as { success: boolean };
}
