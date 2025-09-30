import { getApiBaseUrl } from '@/lib/env';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RenameRoutingGroupRequest {
  groupId: string;
  name: string;
}

export interface RenameRoutingGroupResponse {
  success: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export async function renameRoutingGroup(
  { groupId, name }: RenameRoutingGroupRequest
): Promise<RenameRoutingGroupResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    await delay(180);
    return {
      success: true,
      updatedAt: new Date().toISOString(),
      updatedBy: 'explorer.ui'
    };
  }

  const response = await fetch(`${baseUrl}/api/routing/groups/${groupId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

  if (!response.ok) {
    throw new Error(`Failed to rename routing group (${response.status})`);
  }

  const result = (await response.json()) as RenameRoutingGroupResponse;
  return {
    success: Boolean(result.success),
    updatedAt: result.updatedAt ?? new Date().toISOString(),
    updatedBy: result.updatedBy ?? 'explorer.api'
  };
}
