import { getApiBaseUrl } from './env';
import type {
  ProductDashboardResponse,
  ProductSummary
} from '@/types/products';

const MOCK_PRODUCTS: ProductSummary[] = [
  {
    id: 'prd_gt3100',
    code: 'GT-3100',
    name: 'Gear Tray Assembly',
    latestRevision: 'REV_A',
    revisionCount: 3,
    routingGroupCount: 2,
    routingCount: 5,
    solidWorksStatus: 'present',
    solidWorksPath:
      '\\\\MCMS_SHARE\\\\Routing\\\\GT-3100\\\\3DM\\\\GT-3100.3dm',
    updatedAt: new Date().toISOString(),
    owner: 'cam.sung'
  },
  {
    id: 'prd_sh2001',
    code: 'SH-2001',
    name: 'Spindle Housing',
    latestRevision: 'REV_C',
    revisionCount: 4,
    routingGroupCount: 3,
    routingCount: 7,
    solidWorksStatus: 'missing',
    solidWorksPath:
      '\\\\MCMS_SHARE\\\\Routing\\\\SH-2001\\\\3DM\\\\SH-2001.3dm',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    owner: 'cam.lee'
  },
  {
    id: 'prd_wp1450',
    code: 'WP-1450',
    name: 'Wheel Plate',
    latestRevision: 'REV_B',
    revisionCount: 2,
    routingGroupCount: 1,
    routingCount: 2,
    solidWorksStatus: 'unknown',
    solidWorksPath: undefined,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  }
];

export async function getProductDashboardMockData(): Promise<ProductDashboardResponse> {
  return {
    source: 'mock',
    generatedAt: new Date().toISOString(),
    total: MOCK_PRODUCTS.length,
    items: MOCK_PRODUCTS
  };
}

export async function fetchProductDashboardData(): Promise<ProductDashboardResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return getProductDashboardMockData();
  }

  try {
    const response = await fetch(`${baseUrl}/api/products/dashboard`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const payload = (await response.json()) as ProductDashboardResponse;
    return { ...payload, source: 'api' };
  } catch (error) {
    console.warn(
      '[fetchProductDashboardData] falling back to mock data',
      error
    );
    return getProductDashboardMockData();
  }
}
