import type { ExplorerResponse, RoutingDetailResponse } from "@/types/explorer";
import type { RoutingVersion } from "@/types/routing";
import type { SolidWorksLink } from "@/types/solidworks";

export interface SmokeFixture {
  explorer: ExplorerResponse;
  routingDetail: Record<string, RoutingDetailResponse>;
  routingVersions: Record<string, RoutingVersion[]>;
  solidworks: Record<string, SolidWorksLink>;
}

export const workspaceSmokeFixture: SmokeFixture = {
  explorer: {
    source: "mock",
    generatedAt: "2025-10-02T00:00:00.000Z",
    items: [
      {
        id: "item_a",
        code: "Item_A",
        name: "Precision Bracket",
        revisions: [
          {
            id: "item_a_rev01",
            code: "Rev01",
            routingGroups: [
              {
                id: "group_a_machining",
                name: "Machining",
                description: "Primary machining steps for bracket roughing and finishing.",
                displayOrder: 1,
                sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_machining",
                routings: [
                  {
                    id: "routing_gt310001",
                    code: "GT310001",
                    status: "Approved",
                    camRevision: "1.2.0",
                    owner: "cam.jane",
                    notes: "Initial machining program synced from ESPRIT.",
                    sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_machining",
                    sharedDriveReady: true,
                    createdAt: "2025-10-01T03:00:00.000Z",
                    updatedAt: "2025-10-01T07:15:00.000Z",
                    files: [
                      { id: "file_gt310001_esp", name: "GT310001.esp", type: "esprit" },
                      { id: "file_gt310001_nc", name: "GT310001.nc", type: "nc" },
                      { id: "file_gt310001_meta", name: "meta.json", type: "meta" }
                    ]
                  }
                ]
              },
              {
                id: "group_a_quality",
                name: "Quality & Inspection",
                description: "Coordinate-check and QA steps pending definition.",
                displayOrder: 2,
                sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_quality",
                isDeleted: true,
                updatedAt: "2025-10-01T09:00:00.000Z",
                updatedBy: "qa.bot",
                routings: []
              }
            ]
          }
        ]
      },
      {
        id: "item_b",
        code: "Item_B",
        name: "Fixture Assembly",
        revisions: [
          {
            id: "item_b_rev02",
            code: "Rev02",
            routingGroups: [
              {
                id: "group_b_setup",
                name: "Setup & Fixturing",
                description: "Fixture mounting and calibration sequence.",
                displayOrder: 1,
                sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_B\\REV_item_b_rev02\\GROUP_group_b_setup",
                routings: [
                  {
                    id: "routing_sh2001",
                    code: "SH2001",
                    status: "PendingApproval",
                    camRevision: "0.9.1",
                    owner: "cam.lee",
                    notes: "Awaiting approval after tool change.",
                    sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_B\\REV_item_b_rev02\\GROUP_group_b_setup",
                    sharedDriveReady: true,
                    createdAt: "2025-10-01T06:00:00.000Z",
                    updatedAt: "2025-10-01T08:00:00.000Z",
                    files: [
                      { id: "file_sh2001_esp", name: "SH2001.esp", type: "esprit" },
                      { id: "file_sh2001_meta", name: "meta.json", type: "meta" }
                    ]
                  }
                ]
              },
              {
                id: "group_b_inspection",
                name: "Inspection",
                description: "Placeholder group for surface and tolerance inspection.",
                displayOrder: 2,
                sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_B\\REV_item_b_rev02\\GROUP_group_b_quality",
                routings: []
              }
            ]
          }
        ]
      }
    ],
    addinJobs: [],
    approvalEvents: {}
  },
  routingDetail: {
    routing_gt310001: {
      routing: {
        id: "routing_gt310001",
        code: "GT310001",
        status: "Approved",
        camRevision: "1.2.0",
        owner: "cam.jane",
        sharedDriveReady: true,
        sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_machining",
        notes: "Initial machining program synced from ESPRIT.",
        createdAt: "2025-10-01T03:00:00.000Z",
        updatedAt: "2025-10-01T07:15:00.000Z",
        files: [
          { id: "file_gt310001_esp", name: "GT310001.esp", type: "esprit" },
          { id: "file_gt310001_nc", name: "GT310001.nc", type: "nc" },
          { id: "file_gt310001_meta", name: "meta.json", type: "meta" }
        ]
      },
      history: [
        {
          id: "hist-gt310001-approve",
          timestamp: "2025-10-01T07:20:00.000Z",
          actor: "qa.bot",
          action: "Approved for production",
          description: "Auto-approved during nightly sync."
        }
      ],
      uploads: [
        {
          fileId: "upload-gt310001",
          fileName: "GT310001.nc",
          state: "completed",
          progress: 100,
          checksum: "abc123",
          sizeBytes: 20480,
          updatedAt: "2025-10-01T07:05:00.000Z"
        }
      ],
      generatedAt: "2025-10-02T00:10:00.000Z",
      source: "mock",
      slaMs: 920
    },
    routing_sh2001: {
      routing: {
        id: "routing_sh2001",
        code: "SH2001",
        status: "PendingApproval",
        camRevision: "0.9.1",
        owner: "cam.lee",
        sharedDriveReady: true,
        sharedDrivePath: "\\\\MCMS_SHARE\\Routing\\Item_B\\REV_item_b_rev02\\GROUP_group_b_setup",
        notes: "Awaiting approval after tool change.",
        createdAt: "2025-10-01T06:00:00.000Z",
        updatedAt: "2025-10-01T08:00:00.000Z",
        files: [
          { id: "file_sh2001_esp", name: "SH2001.esp", type: "esprit" },
          { id: "file_sh2001_meta", name: "meta.json", type: "meta" }
        ]
      },
      history: [
        {
          id: "hist-sh2001-submit",
          timestamp: "2025-10-01T08:30:00.000Z",
          actor: "cam.lee",
          action: "Submitted for approval",
          description: "Tool change completed; pending QA review."
        }
      ],
      uploads: [],
      generatedAt: "2025-10-02T00:12:00.000Z",
      source: "mock",
      slaMs: 1040
    }
  },
  routingVersions: {
    routing_gt310001: [
      {
        versionId: "routing_gt310001",
        routingId: "routing_gt310001",
        routingCode: "GT310001",
        camRevision: "1.2.0",
        status: "Approved",
        isPrimary: true,
        isLegacyHidden: false,
        is3DModeled: true,
        isPgCompleted: true,
        owner: "cam.jane",
        createdAt: "2025-09-28T12:00:00.000Z",
        updatedAt: "2025-10-01T07:15:00.000Z",
        stepCount: 10,
        fileCount: 3,
        history: []
      },
      {
        versionId: "routing_gt310001_alt",
        routingId: "routing_gt310001",
        routingCode: "GT310001",
        camRevision: "1.1.0",
        status: "Approved",
        isPrimary: false,
        isLegacyHidden: false,
        is3DModeled: true,
        isPgCompleted: true,
        owner: "cam.jane",
        createdAt: "2025-09-20T12:00:00.000Z",
        updatedAt: "2025-09-25T09:00:00.000Z",
        stepCount: 9,
        fileCount: 3,
        history: []
      }
    ],
    routing_sh2001: [
      {
        versionId: "routing_sh2001",
        routingId: "routing_sh2001",
        routingCode: "SH2001",
        camRevision: "0.9.1",
        status: "PendingApproval",
        isPrimary: true,
        isLegacyHidden: false,
        is3DModeled: true,
        isPgCompleted: false,
        owner: "cam.lee",
        createdAt: "2025-09-30T06:00:00.000Z",
        updatedAt: "2025-10-01T08:00:00.000Z",
        stepCount: 6,
        fileCount: 2,
        history: []
      }
    ]
  },
  solidworks: {
    routing_gt310001: {
      linkId: "sw-link-gt310001",
      itemRevisionId: "item_a_rev01",
      routingId: "routing_gt310001",
      modelPath: "\\\\plm\\routing\\Item_A\\GT310001\\assembly.sldasm",
      configuration: "DEFAULT",
      isLinked: true,
      lastSyncedAt: "2025-10-01T07:00:00.000Z",
      updatedBy: "cam.jane",
      updatedAt: "2025-10-01T07:00:00.000Z"
    },
    routing_sh2001: {
      linkId: "sw-link-sh2001",
      itemRevisionId: "item_b_rev02",
      routingId: "routing_sh2001",
      modelPath: "\\\\plm\\routing\\Item_B\\SH2001\\assembly.sldasm",
      configuration: "DEFAULT",
      isLinked: true,
      lastSyncedAt: "2025-09-30T23:40:00.000Z",
      updatedBy: "cam.lee",
      updatedAt: "2025-09-30T23:40:00.000Z"
    }
  }
};

export const cloneWorkspaceSmokeFixture = (): SmokeFixture =>
  JSON.parse(JSON.stringify(workspaceSmokeFixture));
