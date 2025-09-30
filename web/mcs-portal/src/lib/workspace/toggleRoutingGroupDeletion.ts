import { getApiBaseUrl } from '@/lib/env';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ToggleRoutingGroupDeletionRequest {
  groupId: string;
  isDeleted: boolean;
}

export interface ToggleRoutingGroupDeletionResponse {
  success: boolean;
  synchronizedAt?: string;
}

export async function toggleRoutingGroupDeletion(
  { groupId, isDeleted }: ToggleRoutingGroupDeletionRequest
): Promise<ToggleRoutingGroupDeletionResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    await delay(150);
    return {
      success: true,
      synchronizedAt: new Date().toISOString()
    };
  }

  const response = await fetch(`${baseUrl}/api/routing/groups/${groupId}/soft-delete`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isDeleted })
  });

  if (!response.ok) {
    throw new Error(
      `Failed to toggle routing group deletion (${response.status})`
    );
  }

  const result = (await response.json()) as ToggleRoutingGroupDeletionResponse;
  return {
    success: Boolean(result.success),
    synchronizedAt: result.synchronizedAt ?? new Date().toISOString()
  };
}
