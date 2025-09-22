import { ExplorerResponse } from '@/types/explorer';
import { getApiBaseUrl } from './env';

export async function getExplorerMockData(): Promise<ExplorerResponse> {
  return {
    source: 'mock',
    generatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item_a',
        code: 'Item_A',
        name: '엔진 브래킷',
        revisions: [
          {
            id: 'item_a_rev01',
            code: 'Rev01',
            routings: [
              {
                id: 'routing_gt310001',
                code: 'GT310001',
                status: 'Approved',
                camRevision: '1.2.0',
                files: [
                  { id: 'file_esp', name: 'GT310001.esp', type: 'esprit' },
                  { id: 'file_nc', name: 'GT310001.nc', type: 'nc' },
                  { id: 'file_meta', name: 'meta.json', type: 'meta' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'item_b',
        code: 'Item_B',
        name: '샤프트 하우징',
        revisions: [
          {
            id: 'item_b_rev02',
            code: 'Rev02',
            routings: [
              {
                id: 'routing_sh2001',
                code: 'SH2001',
                status: 'PendingApproval',
                camRevision: '0.9.1',
                files: [
                  { id: 'file_esp2', name: 'SH2001.esp', type: 'esprit' },
                  { id: 'file_meta2', name: 'meta.json', type: 'meta' }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

export async function fetchExplorerData(): Promise<ExplorerResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return getExplorerMockData();
  }

  try {
    const res = await fetch(`${baseUrl}/api/explorer`, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    const payload = (await res.json()) as ExplorerResponse;
    return { ...payload, source: 'api' };
  } catch (error) {
    console.warn('[fetchExplorerData] falling back to mock data:', error);
    return getExplorerMockData();
  }
}
