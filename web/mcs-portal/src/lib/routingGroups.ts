const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface RoutingGroupOrderPayload {
  revisionId: string;
  orderedGroupIds: string[];
}

export interface RoutingGroupOrderResponse {
  success: boolean;
  appliedOrder: string[];
  synchronizedAt: string;
}

// Mock implementation for /routing-groups/order endpoint
export async function orderRoutingGroups(
  payload: RoutingGroupOrderPayload
): Promise<RoutingGroupOrderResponse> {
  await delay(220);
  return {
    success: true,
    appliedOrder: payload.orderedGroupIds,
    synchronizedAt: new Date().toISOString()
  };
}
