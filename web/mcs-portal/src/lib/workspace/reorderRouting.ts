import type { TreePanelReorderPayload } from '@/components/TreePanel';
import { getApiBaseUrl } from '@/lib/env';

export async function reorderRouting(payload: TreePanelReorderPayload) {
  const baseUrl = getApiBaseUrl();
  const body = {
    routingId: payload.dragKey,
    targetKey: payload.dropKey,
    position: payload.position
  };
  if (!baseUrl) {
    // Mock scenario for local development
    return { success: true, mocked: true };
  }
  const response = await fetch(`${baseUrl}/api/routings/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`Failed to reorder routing: ${response.status}`);
  }
  return (await response.json()) as { success: boolean };
}
