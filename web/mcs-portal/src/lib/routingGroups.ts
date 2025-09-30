import { getApiBaseUrl } from '@/lib/env';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RoutingGroupOrderPayload {
  revisionId: string;
  orderedGroupIds: string[];
}

export interface RoutingGroupOrderResponse {
  success: boolean;
  appliedOrder: string[];
  synchronizedAt: string;
}

export async function orderRoutingGroups(
  payload: RoutingGroupOrderPayload
): Promise<RoutingGroupOrderResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    await delay(220);
    return {
      success: true,
      appliedOrder: payload.orderedGroupIds,
      synchronizedAt: new Date().toISOString()
    };
  }

  const response = await fetch(`${baseUrl}/api/routing/groups/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to persist routing group order (${response.status})`);
  }

  const result = (await response.json()) as Partial<RoutingGroupOrderResponse>;
  return {
    success: Boolean(result.success),
    appliedOrder: result.appliedOrder ?? payload.orderedGroupIds,
    synchronizedAt: result.synchronizedAt ?? new Date().toISOString()
  };
}
