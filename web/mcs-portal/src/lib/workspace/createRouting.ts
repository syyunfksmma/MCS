import { getApiBaseUrl } from '@/lib/env';
import type { ExplorerRouting, RoutingStatus } from '@/types/explorer';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createClientRoutingId = () =>
  `routing-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export interface CreateRoutingRequest {
  groupId: string;
  revisionId: string;
  revisionCode: string;
  itemId: string;
  itemCode: string;
  code: string;
  status: RoutingStatus;
  owner: string;
  notes?: string;
  sharedDriveReady: boolean;
  sharedDrivePath?: string;
}

export interface CreateRoutingResponse {
  success: boolean;
  routing: ExplorerRouting;
  message?: string;
}

export async function createRouting(
  payload: CreateRoutingRequest
): Promise<CreateRoutingResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    await delay(240);
    const now = new Date().toISOString();
    return {
      success: true,
      routing: {
        id: createClientRoutingId(),
        code: payload.code,
        status: payload.status,
        camRevision: payload.revisionCode,
        owner: payload.owner,
        notes: payload.notes,
        sharedDrivePath: payload.sharedDrivePath ?? payload.itemCode,
        sharedDriveReady: payload.sharedDriveReady,
        createdAt: now,
        updatedAt: now,
        files: []
      },
      message: 'mock'
    };
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, '')}/api/routing/groups/${payload.groupId}/routings`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create routing (${response.status})`);
  }

  const result = (await response.json()) as Partial<CreateRoutingResponse> & {
    routing?: Partial<ExplorerRouting>;
  };

  const now = new Date().toISOString();
  const routing: ExplorerRouting = {
    id: result.routing?.id ?? createClientRoutingId(),
    code: result.routing?.code ?? payload.code,
    status: result.routing?.status ?? payload.status,
    camRevision: result.routing?.camRevision ?? payload.revisionCode,
    owner: result.routing?.owner ?? payload.owner,
    notes: result.routing?.notes ?? payload.notes,
    sharedDrivePath:
      result.routing?.sharedDrivePath ?? payload.sharedDrivePath ?? payload.itemCode,
    sharedDriveReady:
      result.routing?.sharedDriveReady ?? payload.sharedDriveReady ?? false,
    createdAt: result.routing?.createdAt ?? now,
    updatedAt: result.routing?.updatedAt ?? now,
    files: Array.isArray(result.routing?.files)
      ? result.routing!.files!.map((file) => ({ ...file }))
      : []
  };

  return {
    success: result.success ?? true,
    routing,
    message: result.message
  };
}
