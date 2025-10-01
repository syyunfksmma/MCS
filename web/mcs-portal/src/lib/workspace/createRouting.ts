import { getApiBaseUrl } from '@/lib/env';
import type { ExplorerFile, ExplorerRouting, RoutingStatus } from '@/types/explorer';

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

interface ServerCreateRoutingRequest {
  itemRevisionId: string;
  routingCode: string;
  isPrimary: boolean;
  steps: unknown[];
  files: unknown[];
  requestedBy: string;
  clientRequestId: string;
}

interface RoutingDto {
  id: string;
  itemRevisionId: string;
  routingCode: string;
  status: RoutingStatus;
  camRevision: string;
  isPrimary: boolean;
  files: Array<{
    id: string;
    fileName: string;
    fileType: string;
  }>;
}

const mapManagedFileType = (value: string): ExplorerFile['type'] => {
  switch (value.toLowerCase()) {
    case 'esprit':
      return 'esprit';
    case 'nc':
      return 'nc';
    case 'meta':
      return 'meta';
    default:
      return 'other';
  }
};

const mapRoutingDtoToExplorer = (
  dto: RoutingDto,
  fallback: CreateRoutingRequest
): ExplorerRouting => ({
  id: dto.id ?? createClientRoutingId(),
  code: dto.routingCode ?? fallback.code,
  status: dto.status ?? fallback.status,
  camRevision: dto.camRevision ?? fallback.revisionCode,
  owner: fallback.owner,
  notes: fallback.notes,
  sharedDrivePath: fallback.sharedDrivePath ?? fallback.itemCode,
  sharedDriveReady: fallback.sharedDriveReady,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  files: Array.isArray(dto.files)
    ? dto.files.map((file) => ({
        id: file.id,
        name: file.fileName,
        type: mapManagedFileType(file.fileType)
      }))
    : []
});

export async function createRouting(
  payload: CreateRoutingRequest
): Promise<CreateRoutingResponse> {
  const baseUrl = getApiBaseUrl();

  const clientRequestId = createClientRoutingId();

  if (!baseUrl) {
    await delay(240);
    const now = new Date().toISOString();
    return {
      success: true,
      routing: {
        id: clientRequestId,
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

  const requestPayload: ServerCreateRoutingRequest = {
    itemRevisionId: payload.revisionId,
    routingCode: payload.code,
    isPrimary: payload.status === 'Approved',
    steps: [],
    files: [],
    requestedBy: payload.owner,
    clientRequestId
  };

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/routings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(requestPayload)
  });

  if (response.ok) {
    const dto = (await response.json()) as RoutingDto;
    return {
      success: true,
      routing: mapRoutingDtoToExplorer(dto, payload)
    };
  }

  if (response.status === 409) {
    const payloadJson = await response.json().catch(() => null);
    if (payloadJson?.routing) {
      const dto = payloadJson.routing as RoutingDto;
      return {
        success: true,
        routing: mapRoutingDtoToExplorer(dto, payload),
        message: payloadJson?.message ?? 'Routing already exists; reused existing instance.'
      };
    }

    throw new Error(payloadJson?.message ?? `Routing conflict (${response.status}).`);
  }

  throw new Error(`Failed to create routing (${response.status})`);
}
