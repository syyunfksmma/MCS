import { getApiBaseUrl } from './env';
import type {
  CamWorkStatusResponse,
  ErpWorkOrder,
  ErpWorkOrderCollection,
  UpdateCamStatusPayload
} from '@/types/erp';

const MOCK_WORK_ORDERS: ErpWorkOrder[] = [
  {
    woNo: 'PD250800423',
    procSeq: '10',
    itemCd: '3H66692NC',
    orderQty: 1,
    jobCd: 'A10-1',
    machNm: 'SH번 (범용선반 HL-720)',
    operStatusNm: '선삭 1차',
    startYn: 'N',
    is3DModeled: false,
    isPgCompleted: false
  },
  {
    woNo: 'PD250800423',
    procSeq: '20',
    itemCd: '3H66692NC',
    orderQty: 1,
    jobCd: 'B10-1',
    machNm: 'DC번 (범용밀링 HMT-1100)',
    operStatusNm: '사상 1차',
    startYn: 'N',
    is3DModeled: true,
    isPgCompleted: false
  }
];

export async function getMockErpWorkOrders(): Promise<ErpWorkOrderCollection> {
  return {
    source: 'mock',
    generatedAt: new Date().toISOString(),
    workOrders: MOCK_WORK_ORDERS
  };
}

export async function fetchErpWorkOrders(): Promise<ErpWorkOrderCollection> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return getMockErpWorkOrders();
  }

  try {
    const response = await fetch(`${baseUrl}/api/erp/workorders`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to load ERP work orders (${response.status})`);
    }

    const payload = (await response.json()) as ErpWorkOrder[];
    return {
      source: 'api',
      generatedAt: new Date().toISOString(),
      workOrders: payload
    };
  } catch (error) {
    console.warn('[fetchErpWorkOrders] Falling back to mock data', error);
    return getMockErpWorkOrders();
  }
}

export async function updateCamStatus(
  payload: UpdateCamStatusPayload
): Promise<CamWorkStatusResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    const timestamp = new Date().toISOString();
    return {
      ...payload,
      createdAt: timestamp,
      createdBy: 'mock',
      updatedAt: timestamp,
      updatedBy: 'mock',
      last3DModeledAt: payload.is3DModeled ? timestamp : null,
      lastPgCompletedAt: payload.isPgCompleted ? timestamp : null
    };
  }

  const response = await fetch(`${baseUrl}/api/cam/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to update CAM status (${response.status})`);
  }

  return (await response.json()) as CamWorkStatusResponse;
}
