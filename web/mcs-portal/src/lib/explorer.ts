import {
  AddinJob,
  AddinJobStatus,
  ApprovalDecision,
  ApprovalEvent,
  ApprovalEventMap,
  ExplorerItem,
  ExplorerResponse,
  ExplorerRouting,
  ExplorerRoutingGroup
} from '@/types/explorer';
import { getApiBaseUrl } from './env';

type RawExplorerRouting = ExplorerRouting & {
  files?: ExplorerRouting['files'];
};

type RawExplorerRoutingGroup = Omit<
  ExplorerRoutingGroup,
  'routings' | 'displayOrder'
> & {
  routings?: RawExplorerRouting[];
  displayOrder?: number;
  isDeleted?: boolean;
  updatedAt?: string;
  updatedBy?: string;
};

type RawExplorerRevision = {
  id: string;
  code: string;
  routingGroups?: RawExplorerRoutingGroup[];
  routings?: RawExplorerRouting[];
};

type RawExplorerItem = Omit<ExplorerItem, 'revisions'> & {
  revisions: RawExplorerRevision[];
};

type RoutingContext = {
  item: ExplorerItem;
  revision: ExplorerItem['revisions'][number];
  group: ExplorerItem['revisions'][number]['routingGroups'][number];
  routing: ExplorerItem['revisions'][number]['routingGroups'][number]['routings'][number];
};

const cloneRouting = (routing: RawExplorerRouting): ExplorerRouting => ({
  ...routing,
  owner: routing.owner,
  notes: routing.notes,
  sharedDrivePath: routing.sharedDrivePath,
  sharedDriveReady: routing.sharedDriveReady,
  createdAt: routing.createdAt,
  files: (routing.files ?? []).map((file) => ({ ...file }))
});

const ensureRoutingGroups = (
  revision: RawExplorerRevision
): ExplorerRoutingGroup[] => {
  const groups = revision.routingGroups ?? [];
  if (groups.length > 0) {
    return groups
      .map((group, index) => ({
        id: group.id ?? `${revision.id}-group-${index + 1}`,
        name: group.name ?? `Group ${index + 1}`,
        description: group.description,
        displayOrder: group.displayOrder ?? index + 1,
        isDeleted: group.isDeleted ?? false,
        updatedAt: group.updatedAt,
        updatedBy: group.updatedBy,
        routings: (group.routings ?? []).map(cloneRouting)
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  const legacyRoutings = revision.routings ?? [];
  if (legacyRoutings.length > 0) {
    return [
      {
        id: `${revision.id}-legacy-group`,
        name: 'Legacy',
        description: 'Migrated from legacy routing list.',
        displayOrder: 1,
        isDeleted: false,
        routings: legacyRoutings.map(cloneRouting)
      }
    ];
  }

  return [];
};

const normalizeExplorerItems = (items: RawExplorerItem[]): ExplorerItem[] =>
  items.map((item) => ({
    ...item,
    revisions: item.revisions.map((revision) => ({
      id: revision.id,
      code: revision.code,
      routingGroups: ensureRoutingGroups(revision)
    }))
  }));

const createMockItems = (): RawExplorerItem[] => [
  {
    id: 'item_a',
    code: 'Item_A',
    name: 'Precision Bracket',
    revisions: [
      {
        id: 'item_a_rev01',
        code: 'Rev01',
        routingGroups: [
          {
            id: 'group_a_machining',
            name: 'Machining',
            description:
              'Primary machining steps for bracket roughing and finishing.',
            displayOrder: 1,
            sharedDrivePath:
              '\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_machining',
            routings: [
              {
                id: 'routing_gt310001',
                code: 'GT310001',
                status: 'Approved',
                camRevision: '1.2.0',
                owner: 'cam.jane',
                notes: 'Initial machining program synced from ESPRIT.',
                sharedDrivePath:
                  '\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_machining',
                sharedDriveReady: true,
                createdAt: new Date(
                  Date.now() - 6 * 60 * 60 * 1000
                ).toISOString(),
                files: [
                  { id: 'file_esp', name: 'GT310001.esp', type: 'esprit' },
                  { id: 'file_nc', name: 'GT310001.nc', type: 'nc' },
                  { id: 'file_meta', name: 'meta.json', type: 'meta' }
                ]
              }
            ]
          },
          {
            id: 'group_a_quality',
            name: 'Quality & Inspection',
            description: 'Coordinate-check and QA steps pending definition.',
            displayOrder: 2,
            sharedDrivePath:
              '\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_quality',
            isDeleted: true,
            updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            updatedBy: 'qa.bot',
            routings: []
          }
        ]
      }
    ]
  },
  {
    id: 'item_b',
    code: 'Item_B',
    name: 'Fixture Assembly',
    revisions: [
      {
        id: 'item_b_rev02',
        code: 'Rev02',
        routingGroups: [
          {
            id: 'group_b_setup',
            name: 'Setup & Fixturing',
            description: 'Fixture mounting and calibration sequence.',
            displayOrder: 1,
            sharedDrivePath:
              '\\MCMS_SHARE\\Routing\\Item_B\\REV_item_b_rev02\\GROUP_group_b_setup',
            routings: [
              {
                id: 'routing_sh2001',
                code: 'SH2001',
                status: 'PendingApproval',
                camRevision: '0.9.1',
                owner: 'cam.lee',
                notes: 'Awaiting approval after tool change.',
                sharedDrivePath:
                  '\\MCMS_SHARE\\Routing\\Item_B\\REV_item_b_rev02\\GROUP_group_b_setup',
                sharedDriveReady: true,
                createdAt: new Date(
                  Date.now() - 3 * 60 * 60 * 1000
                ).toISOString(),
                files: [
                  { id: 'file_esp2', name: 'SH2001.esp', type: 'esprit' },
                  { id: 'file_meta2', name: 'meta.json', type: 'meta' }
                ]
              }
            ]
          },
          {
            id: 'group_b_quality',
            name: 'Inspection',
            description:
              'Placeholder group for surface and tolerance inspection.',
            displayOrder: 2,
            sharedDrivePath:
              '\\MCMS_SHARE\\Routing\\Item_B\\REV_item_b_rev02\\GROUP_group_b_quality',
            routings: []
          }
        ]
      }
    ]
  }
];

const flattenRoutingContexts = (items: ExplorerItem[]): RoutingContext[] => {
  const contexts: RoutingContext[] = [];
  items.forEach((item) => {
    item.revisions.forEach((revision) => {
      revision.routingGroups.forEach((group) => {
        group.routings.forEach((routing) => {
          contexts.push({ item, revision, group, routing });
        });
      });
    });
  });
  return contexts;
};

const createMockAddinJobs = (items: ExplorerItem[]): AddinJob[] => {
  const contexts = flattenRoutingContexts(items).slice(0, 3);
  if (!contexts.length) {
    return [];
  }
  const now = Date.now();
  return contexts.map((ctx, index) => {
    const statusOrder: AddinJobStatus[] = ['running', 'succeeded', 'queued'];
    const status = statusOrder[index] ?? 'queued';
    const createdAt = new Date(now - (index + 3) * 5 * 60 * 1000).toISOString();
    const updatedAt = new Date(now - (index + 1) * 2 * 60 * 1000).toISOString();
    const lastMessage =
      status === 'running'
        ? 'SignalR: job running'
        : status === 'succeeded'
          ? 'SignalR: job succeeded'
          : 'Queued from workspace';

    return {
      id: `job-${index + 1}`,
      routingId: ctx.routing.id,
      routingCode: ctx.routing.code,
      itemName: `${ctx.item.code} - ${ctx.item.name}`,
      revisionCode: ctx.revision.code,
      status,
      requestedBy: index === 1 ? 'qa.bot' : 'workspace.mock',
      createdAt,
      updatedAt,
      lastMessage
    };
  });
};

const createMockApprovalEvents = (items: ExplorerItem[]): ApprovalEventMap => {
  const contexts = flattenRoutingContexts(items);
  const now = Date.now();
  const result: ApprovalEventMap = {};
  const commentMap: Record<ApprovalDecision, string> = {
    approved: 'Seed event: routing approved automatically.',
    rejected: 'Seed event: routing rejected automatically.',
    pending: 'Seed event: waiting for reviewer.'
  };

  contexts.forEach((ctx, index) => {
    const baseDecision: ApprovalDecision =
      ctx.routing.status === 'Approved'
        ? 'approved'
        : ctx.routing.status === 'Rejected'
          ? 'rejected'
          : 'pending';
    const event: ApprovalEvent = {
      id: `approval-${ctx.routing.id}-${index + 1}`,
      routingId: ctx.routing.id,
      decision: baseDecision,
      actor: baseDecision === 'approved' ? 'qa.bot' : 'workspace.mock',
      comment: commentMap[baseDecision],
      createdAt: new Date(now - index * 3 * 60 * 1000).toISOString(),
      source: 'system'
    };
    result[ctx.routing.id] = [event];
  });

  return result;
};

export async function getExplorerMockData(): Promise<ExplorerResponse> {
  const items = normalizeExplorerItems(createMockItems());
  return {
    source: 'mock',
    generatedAt: new Date().toISOString(),
    items,
    addinJobs: createMockAddinJobs(items),
    approvalEvents: createMockApprovalEvents(items)
  };
}

export async function fetchExplorerData(): Promise<ExplorerResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return getExplorerMockData();
  }

  try {
    const res = await fetch(`${baseUrl}/api/explorer`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    const payload = (await res.json()) as ExplorerResponse;
    const normalizedItems = normalizeExplorerItems(
      payload.items as unknown as RawExplorerItem[]
    );
    return {
      ...payload,
      source: 'api',
      items: normalizedItems,
      addinJobs: payload.addinJobs ?? createMockAddinJobs(normalizedItems),
      approvalEvents:
        payload.approvalEvents ?? createMockApprovalEvents(normalizedItems)
    };
  } catch (error) {
    console.warn('[fetchExplorerData] falling back to mock data:', error);
    return getExplorerMockData();
  }
}
