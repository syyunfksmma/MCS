export interface ErpWorkOrder {
  woNo: string;
  procSeq: string;
  itemCd: string;
  orderQty: number;
  jobCd: string;
  machNm: string;
  operStatusNm: string;
  startYn: string;
  is3DModeled: boolean;
  isPgCompleted: boolean;
}

export interface ErpWorkOrderCollection {
  source: 'api' | 'mock';
  generatedAt: string;
  workOrders: ErpWorkOrder[];
}

export interface UpdateCamStatusPayload {
  woNo: string;
  procSeq: string;
  itemCd?: string;
  is3DModeled: boolean;
  isPgCompleted: boolean;
}

export interface CamWorkStatusResponse {
  woNo: string;
  procSeq: string;
  itemCd?: string;
  is3DModeled: boolean;
  isPgCompleted: boolean;
  last3DModeledAt?: string | null;
  lastPgCompletedAt?: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
}
