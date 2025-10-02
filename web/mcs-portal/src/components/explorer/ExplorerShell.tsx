'use client';

import { useUserPermissions } from '@/hooks/useUserPermissions';

import {
  Card,
  Tabs,
  Empty,
  Typography,
  Spin,
  Alert,
  Input,
  List,
  Space,
  Button,
  Divider,
  Tag,
  Modal,
  message
} from 'antd';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

import TreePanel, { TreePanelReorderPayload } from '@/components/TreePanel';
import ExplorerHoverMenu from '@/components/explorer/ExplorerHoverMenu';

import FeatureGate from '@/components/features/FeatureGate';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useHoverMenu } from '@/hooks/useHoverMenu';
import { useRoutingVersions } from '@/hooks/useRoutingVersions';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useNavigation } from '@/hooks/useNavigation';
import type { CreateEspritApiKeyResponse } from '@/lib/api/esprit';

import RoutingCreationWizard, {
  type RoutingCreationInput
} from '@/components/explorer/RoutingCreationWizard';

import WorkspaceUploadPanel from '@/components/workspace/WorkspaceUploadPanel';
import ThreeViewer from '@/components/mcs/ThreeViewer';
import EspritJobPanel from '@/components/mcs/EspritJobPanel';
import EspritKeyModal from '@/components/mcs/EspritKeyModal';

import AddinHistoryPanel from './AddinHistoryPanel';

import RoutingDetailModal from './RoutingDetailModal';

import SearchFilterRail from './SearchFilterRail';

import ExplorerRibbon from './ExplorerRibbon';
import ExplorerLayout from './ExplorerLayout';
import styles from './ExplorerShell.module.css';
import { useExplorerLayout } from '@/hooks/useExplorerLayout';

import { useExplorerData } from '@/hooks/useExplorerData';
import { useRoutingDetail } from '@/hooks/useRoutingDetail';

import { useRoutingSearch } from '@/hooks/useRoutingSearch';
import { orderRoutingGroups } from '@/lib/routingGroups';
import { logRoutingEvent } from '@/lib/telemetry/routing';
import { downloadFromUrl } from '@/lib/downloads/browser';
import { downloadRoutingBundle } from '@/lib/workspace/downloadRoutingBundle';
import { updateRoutingVersion } from '@/lib/api/routingVersions';
import { getRoutingFileDownload } from '@/lib/workspace/getRoutingFileDownload';
import { renameRoutingGroup } from '@/lib/workspace/renameRoutingGroup';
import { createRouting } from '@/lib/workspace/createRouting';
import { toggleRoutingGroupDeletion } from '@/lib/workspace/toggleRoutingGroupDeletion';

import type {
  ExplorerItem,
  ExplorerRevision,
  ExplorerRouting,
  ExplorerRoutingGroup,
  ExplorerResponse,
  ExplorerFile
} from '@/types/explorer';

import type { RoutingSearchItem } from '@/types/search';

interface ExplorerShellProps {
  initialData: ExplorerResponse;
}

type LegacyRoutingListItem = {
  routingId: string;

  routingCode: string;

  productCode: string;

  revisionCode: string;

  status: string;

  groupName: string;

  updatedAt?: string | null;
};

type RoutingContext = {
  item: ExplorerItem;

  revision: ExplorerRevision;

  group: ExplorerRoutingGroup;

  routing: ExplorerRouting;
};

type RoutingGroupOrderPlan = {
  revisionId: string;
  orderedGroupIds: string[];
};

interface ComputeReorderOutcome {
  updated: boolean;
  nextItems: ExplorerItem[];
  groupOrders: RoutingGroupOrderPlan[];
}

const STATUS_TAG_COLOR: Record<string, string> = {
  Approved: 'green',

  PendingApproval: 'gold',

  Rejected: 'red',

  Draft: 'default',

  완료: 'green',

  '진행 중': 'gold'
};

const { Paragraph, Text } = Typography;

const createClientId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `routing-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const findRoutingInCollection = (
  collection: ExplorerItem[],

  routingId: string
): ExplorerRouting | null => {
  for (const item of collection) {
    for (const revision of item.revisions) {
      for (const group of revision.routingGroups) {
        const candidate = group.routings.find((routing) => routing.id === routingId);

        if (candidate) {
          return candidate;
        }
      }
    }
  }

  return null;
};

const findRoutingContext = (
  collection: ExplorerItem[],

  routingId: string
): RoutingContext | null => {
  for (const item of collection) {
    for (const revision of item.revisions) {
      for (const group of revision.routingGroups) {
        const routing = group.routings.find(
          (candidate) => candidate.id === routingId
        );

        if (routing) {
          return {
            item,

            revision,

            group,

            routing
          };
        }
      }
    }
  }

  return null;
};

const cloneRouting = (routing: ExplorerRouting): ExplorerRouting => ({
  ...routing,

  files: routing.files.map((file) => ({
    ...file
  }))
});

const cloneGroup = (group: ExplorerRoutingGroup): ExplorerRoutingGroup => ({
  ...group,

  routings: group.routings.map(cloneRouting)
});

function computeReorderOutcome(
  items: ExplorerItem[],
  payload: TreePanelReorderPayload
): ComputeReorderOutcome {
  let updated = false;
  const groupOrders: RoutingGroupOrderPlan[] = [];

  const nextItems = items.map((item) => {
    let itemChanged = false;

    const nextRevisions = item.revisions.map((revision) => {
      if (payload.entityType === 'group') {
        const dragIndex = revision.routingGroups.findIndex(
          (group) => group.id === payload.dragKey
        );

        const dropIndex = revision.routingGroups.findIndex(
          (group) => group.id === payload.dropKey
        );

        if (dragIndex === -1 || dropIndex === -1) {
          return revision;
        }

        const normalizedGroups = revision.routingGroups.map(cloneGroup);

        const [moved] = normalizedGroups.splice(dragIndex, 1);

        const targetIndex = normalizedGroups.findIndex(
          (group) => group.id === payload.dropKey
        );

        if (targetIndex === -1) {
          return revision;
        }

        const insertIndex =
          payload.position === 'after' ? targetIndex + 1 : targetIndex;

        normalizedGroups.splice(insertIndex, 0, moved);

        const withDisplayOrder = normalizedGroups.map((group, index) => ({
          ...group,

          displayOrder: index + 1
        }));

        groupOrders.push({
          revisionId: revision.id,
          orderedGroupIds: withDisplayOrder.map((group) => group.id)
        });

        updated = true;
        itemChanged = true;

        return {
          ...revision,

          routingGroups: withDisplayOrder
        };
      }

      if (payload.entityType === 'routing') {
        let groupChanged = false;

        const nextGroups = revision.routingGroups.map((group) => {
          const dragIndex = group.routings.findIndex(
            (routing) => routing.id === payload.dragKey
          );

          const dropIndex = group.routings.findIndex(
            (routing) => routing.id === payload.dropKey
          );

          if (dragIndex === -1 || dropIndex === -1) {
            return group;
          }

          const newRoutings = group.routings.map(cloneRouting);

          const [moved] = newRoutings.splice(dragIndex, 1);

          const targetIndex = newRoutings.findIndex(
            (routing) => routing.id === payload.dropKey
          );

          if (targetIndex === -1) {
            return group;
          }

          const insertIndex =
            payload.position === 'after' ? targetIndex + 1 : targetIndex;

          newRoutings.splice(insertIndex, 0, moved);

          groupChanged = true;
          updated = true;

          return {
            ...group,

            routings: newRoutings
          };
        });

        if (groupChanged) {
          itemChanged = true;

          return {
            ...revision,

            routingGroups: nextGroups
          };
        }
      }

      return revision;
    });

    return itemChanged
      ? {
          ...item,

          revisions: nextRevisions
        }
      : item;
  });

  return {
    updated,
    nextItems,
    groupOrders
  };
}

export default function ExplorerShell({ initialData }: ExplorerShellProps) {
  const { data, isFetching, isError, error } = useExplorerData(initialData);

  const resolved = data ?? initialData;

  const { items, generatedAt, source } = resolved;

  const {
    itemsState,

    setItemsState,

    selectedRouting,

    setSelectedRouting,

    searchTerm,

    setSearchTerm,

    searchResult,

    setSearchResult,

    lastSearchError,

    setLastSearchError,

    wizardContext,

    setWizardContext,

    productFilter,

    setProductFilter,

    groupFilter,

    setGroupFilter,

    statusFilter,

    setStatusFilter,

    hoveredResultId,

    setHoveredResultId,

    isSearchFeatureEnabled,

    setIsSearchFeatureEnabled,

    legacyFilterTerm,

    setLegacyFilterTerm,

    typeaheadTimeoutRef
  } = useExplorerLayout(items);

  const { setLastRoutingId } = useNavigation();
  const [espritKeyModalOpen, setEspritKeyModalOpen] = useState(false);
  const auth = useAuthContext();
  const permissionsQuery = useUserPermissions();
  const userPermissions = permissionsQuery.data ?? {
    canOpenExplorer: true,
    canReplaceSolidWorks: true,
    canManageRoutingVersions: true
  };

  const versionsQuery = useRoutingVersions(selectedRouting?.id);
const versionList = useMemo(() => versionsQuery.data ?? [], [versionsQuery.data]);
const refetchVersions = versionsQuery.refetch;



const handlePromoteVersion = useCallback(async (versionId: string) => {
  if (!selectedRouting) {
    return;
  }

  const version = versionList.find((entry) => entry.versionId === versionId);
  if (!userPermissions.canManageRoutingVersions) {
    message.warning('You do not have permission to manage routing versions.');
    return;
  }

  try {
    const requestedBy = auth.account?.username ?? 'workspace.user';
    await updateRoutingVersion({
      routingId: selectedRouting.id,
      versionId,
      requestedBy,
      makePrimary: true,
      currentIsPrimary: version?.isPrimary,
      legacyHidden: version?.isLegacyHidden
    });

    setItemsState((prev) => {
      const next = prev.map((item) => ({
        ...item,
        revisions: item.revisions.map((revision) => ({
          ...revision,
          routingGroups: revision.routingGroups.map((group) => ({
            ...group,
            routings: group.routings.map((routing) => {
              if (routing.id === versionId) {
                return { ...routing, isPrimary: true };
              }
              const routeIsPrimary = (routing as { isPrimary?: boolean }).isPrimary ?? false;
              if (routeIsPrimary && routing.id !== versionId) {
                return { ...routing, isPrimary: false };
              }
              return routing;
            })
          }))
        }))
      }));

      const updated = next;
      const promoted =
        findRoutingInCollection(updated, versionId) ??
        findRoutingInCollection(updated, selectedRouting.id);
      setSelectedRouting(promoted ?? null);
      return updated;
    });

    await refetchVersions();
    message.success('Primary version updated.');
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    message.error(`Failed to update primary version: ${detail}`);
  }
}, [auth.account?.username, selectedRouting, setItemsState, setSelectedRouting, userPermissions.canManageRoutingVersions, versionList, refetchVersions]);

const handleToggleLegacyVersion = useCallback(async (versionId: string, nextHidden: boolean) => {
  if (!selectedRouting) {
    return;
  }

  if (!userPermissions.canManageRoutingVersions) {
    message.warning('You do not have permission to manage routing versions.');
    return;
  }

  const version = versionList.find((entry) => entry.versionId === versionId);

  try {
    const requestedBy = auth.account?.username ?? 'workspace.user';
    await updateRoutingVersion({
      routingId: selectedRouting.id,
      versionId,
      requestedBy,
      currentIsPrimary: version?.isPrimary,
      legacyHidden: nextHidden
    });

    await refetchVersions();
    message.success(nextHidden ? 'Legacy flag applied.' : 'Legacy flag removed.');
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    message.error(`Failed to update legacy visibility: ${detail}`);
  }
}, [auth.account?.username, selectedRouting, userPermissions.canManageRoutingVersions, versionList, refetchVersions]);

  const [latestEspritKey, setLatestEspritKey] = useState<CreateEspritApiKeyResponse | null>(null);

  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [detailActiveTab, setDetailActiveTab] = useState('summary');

  const searchMutation = useRoutingSearch();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadMeta, setDownloadMeta] = useState<{ checksum?: string; fileName?: string } | null>(null);


  const routingDetailQuery = useRoutingDetail(selectedRouting, {
    enabled: isDetailModalOpen && Boolean(selectedRouting)
  });
  const detailLoading =
    routingDetailQuery.isLoading || routingDetailQuery.isFetching;
  const detailError =
    routingDetailQuery.error instanceof Error ? routingDetailQuery.error : null;

  const {
    context: hoverMenuContext,
    isOpen: isHoverMenuOpen,
    open: openHoverMenu,
    scheduleClose: scheduleHoverMenuClose,
    cancelClose: cancelHoverMenuClose,
    close: closeHoverMenu
  } = useHoverMenu({ openDelay: 200, closeDelay: 150 });

  const hoverMenuEnabled = isFeatureEnabled('feature.hover-quick-menu');

  const hoverMenuToggleCard = (
    <Card title="Experimental – Hover Quick Menu" bordered size="small">
      <FeatureGate
        flag="feature.hover-quick-menu"
        onToggle={(enabled) => {
          if (!enabled) {
            closeHoverMenu({ immediate: true });
          }
        }}
        fallback={
          <Alert
            type="info"
            showIcon
            message="Hover Quick Menu disabled"
            description="Toggle to preview SLA badges, pinning, and approval quick actions."
          />
        }
      >
        <Alert
          type="success"
          showIcon
          message="Hover Quick Menu enabled"
          description="Move the pointer over routings to open the experimental quick menu."
        />
      </FeatureGate>
      <Text type="secondary">Screenshots should be captured via Storybook ExplorerHoverMenu stories.</Text>
    </Card>
  );

  useEffect(() => {
    if (!hoverMenuEnabled && isHoverMenuOpen) {
      closeHoverMenu({ immediate: true });
    }
  }, [hoverMenuEnabled, isHoverMenuOpen, closeHoverMenu]);

  useEffect(() => {
    if (typeof setLastRoutingId === "function") {
      setLastRoutingId(selectedRouting?.id ?? null);
    }
  }, [selectedRouting?.id, setLastRoutingId]);

  useEffect(() => {
    if (!selectedRouting) {
      setDetailModalOpen(false);
      setDetailActiveTab('summary');
    }
  }, [selectedRouting, setDetailActiveTab, setDetailModalOpen]);

  const getSelectedRoutingContext = useCallback(() => {
    if (!selectedRouting) {
      return null;
    }

    return findRoutingContext(itemsState, selectedRouting.id);
  }, [itemsState, selectedRouting]);

  const scrollToCard = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',

        block: 'start'
      });
    }
  }, []);

  const handleRibbonOpenSelected = useCallback(() => {
    if (!selectedRouting) {
      message.info('Please select a routing first.');

      return;
    }

    setDetailModalOpen(true);
    setDetailActiveTab('summary');

    logRoutingEvent({
      name: 'routing.wave1.detail.open',
      properties: {
        routingId: selectedRouting.id,
        routingCode: selectedRouting.code
      }
    });
  }, [selectedRouting, setDetailActiveTab, setDetailModalOpen]);

  const handleDetailModalClose = useCallback(() => {
    setDetailModalOpen(false);
    setDetailActiveTab('summary');
  }, [setDetailActiveTab, setDetailModalOpen]);

  const handleDetailTabChange = useCallback((key: string) => {
    setDetailActiveTab(key);
  }, [setDetailActiveTab]);

  const handleRibbonOpenWizard = useCallback(() => {
    const context = getSelectedRoutingContext();

    if (!context) {
      message.warning('Routing을 선택한 뒤 새 Routing을 생성하세요.');

      return;
    }

    setWizardContext({
      item: context.item,

      revision: context.revision,

      group: context.group
    });
  }, [getSelectedRoutingContext, setWizardContext]);

  const handleRibbonDownload = useCallback(() => {
    if (!selectedRouting) {
      message.info('다운로드할 Routing을 선택하세요.');

      return;
    }

    setDownloadModalOpen(true);
    setDownloadError(null);
    setDownloadMeta(null);
  }, [selectedRouting, setDownloadModalOpen, setDownloadError, setDownloadMeta]);

  const handleOpenInExplorer = useCallback(async () => {
    if (!selectedRouting) {
      message.warning('Select a routing before opening Explorer.');
      return;
    }

    if (!userPermissions.canOpenExplorer) {
      message.warning('You do not have permission to open Explorer.');
      return;
    }

    const sharedPath = selectedRouting.sharedDrivePath;
    if (!sharedPath) {
      message.warning('Shared drive path is not available for this routing.');
      return;
    }

    const uri = `mcms-explorer://open?path=${encodeURIComponent(sharedPath)}`;
    logRoutingEvent({
      name: 'open_explorer_attempt',
      properties: { routingId: selectedRouting.id, path: sharedPath }
    });

    try {
      window.location.href = uri;
      message.success('Explorer protocol invoked.');
      logRoutingEvent({
        name: 'open_explorer_success',
        properties: { routingId: selectedRouting.id }
      });
    } catch (error) {
      logRoutingEvent({
        name: 'open_explorer_failure',
        properties: {
          routingId: selectedRouting.id,
          reason: error instanceof Error ? error.message : String(error)
        }
      });
      message.warning('Explorer launch may be blocked. Shared path copied to clipboard.');
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(sharedPath);
        }
      } catch {
        // ignore clipboard errors
      }
    }
  }, [selectedRouting, userPermissions.canOpenExplorer]);

  const handleDownloadModalClose = useCallback(() => {
    setDownloadModalOpen(false);
    setDownloadLoading(false);
    setDownloadError(null);
    setDownloadMeta(null);
  }, [setDownloadError, setDownloadLoading, setDownloadModalOpen, setDownloadMeta]);

  const handleBundleDownload = useCallback(async () => {
    if (!selectedRouting) {
      return;
    }

    setDownloadLoading(true);
    setDownloadError(null);

    try {
      const result = await downloadRoutingBundle({ routingId: selectedRouting.id });
      downloadFromUrl(
        result.downloadUrl,
        result.fileName ?? `${selectedRouting.code}.zip`
      );
      if (result.revoke) {
        setTimeout(() => result.revoke?.(), 1000);
      }
      setDownloadMeta({
        checksum: result.checksum ?? undefined,
        fileName: result.fileName ?? `${selectedRouting.code}.zip`
      });
      message.success(`번들 다운로드를 시작했습니다: ${selectedRouting.code}`);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : String(error);
      setDownloadError(description);
      message.error(`번들 다운로드에 실패했습니다: ${description}`);
    } finally {
      setDownloadLoading(false);
    }
  }, [selectedRouting, setDownloadError, setDownloadLoading, setDownloadMeta]);

  const handleFileDownload = useCallback(
    async (file: ExplorerFile) => {
      if (!selectedRouting) {
        return;
      }

      setDownloadLoading(true);
      setDownloadError(null);

      try {
        const result = await getRoutingFileDownload({
          routingId: selectedRouting.id,
          file
        });
        downloadFromUrl(result.downloadUrl, result.fileName ?? file.name);
        if (result.revoke) {
          setTimeout(() => result.revoke?.(), 1000);
        }
        setDownloadMeta({
          checksum: result.checksum ?? undefined,
          fileName: result.fileName ?? file.name
        });
        message.success(`${file.name} 다운로드를 시작했습니다.`);
      } catch (error) {
        const description =
          error instanceof Error ? error.message : String(error);
        setDownloadError(description);
        message.error(`파일 다운로드에 실패했습니다: ${description}`);
      } finally {
        setDownloadLoading(false);
      }
    },
    [selectedRouting, setDownloadError, setDownloadLoading, setDownloadMeta]
  );

  const handleShowUploadPanel = useCallback(() => {
    scrollToCard('workspace-upload-card');
  }, [scrollToCard]);

  const handleShowAddinPanel = useCallback(() => {
    scrollToCard('addin-history-card');
  }, [scrollToCard]);

  useEffect(() => {
    setItemsState(items);
  }, [items, setItemsState]);

  useEffect(() => {
    if (!selectedRouting) {
      setDownloadModalOpen(false);
      setDownloadError(null);
      setDownloadMeta(null);
      setDownloadLoading(false);
    }
  }, [selectedRouting, setDownloadError, setDownloadLoading, setDownloadMeta, setDownloadModalOpen]);

  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, [typeaheadTimeoutRef]);

  useEffect(() => {
    if (!selectedRouting) {
      return;
    }

    const refreshed = findRoutingInCollection(itemsState, selectedRouting.id);

    if (!refreshed) {
      setSelectedRouting(null);
    } else if (refreshed !== selectedRouting) {
      setSelectedRouting(refreshed);
    }
  }, [itemsState, selectedRouting, setSelectedRouting]);

  const findRoutingById = useCallback(
    (routingId: string) => findRoutingInCollection(itemsState, routingId),

    [itemsState]
  );

  const summaryItems = useMemo(() => {
    const base = [
      {
        label: '데이터 생성 시각',

        value: new Date(generatedAt).toLocaleString()
      },

      {
        label: '아이템 수',

        value: itemsState.length.toString()
      },

      {
        label: '데이터 출처',

        value: source === 'mock' ? 'Mock' : 'API'
      },

      {
        label: '상태',

        value: isError ? '에러' : isFetching ? '로딩 중' : '정상'
      }
    ];

    if (searchResult) {
      base.push({
        label: '최근 검색 SLA(ms)',

        value: `${searchResult.slaMs ?? '서버 미보고'} / ${searchResult.observedClientMs}`
      });
    }

    return base;
  }, [
    generatedAt,

    itemsState.length,

    source,

    isError,

    isFetching,

    searchResult
  ]);

  const setSelectedRoutingFromItems = useCallback(
    (routingId: string | null, nextItems: ExplorerItem[]) => {
      if (!routingId) {
        setSelectedRouting(null);

        return;
      }

      const refreshed = findRoutingInCollection(nextItems, routingId);

      setSelectedRouting(refreshed);
    },

    [setSelectedRouting]
  );

  const reorderPersistingRef = useRef(false);
  const renameInFlightRef = useRef<Set<string>>(new Set());
  const softDeleteInFlightRef = useRef<Set<string>>(new Set());

  const persistReorder = useCallback(
    async (payload: TreePanelReorderPayload) => {
      if (reorderPersistingRef.current) {
        message.info('이전 순서 저장이 진행 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      const previousItems = itemsState;

      const { updated, nextItems, groupOrders } = computeReorderOutcome(
        itemsState,
        payload
      );

      if (!updated) {
        message.warning('Reorder 요청이 적용되지 않았습니다.');
        return;
      }

      setItemsState(nextItems);
      setSelectedRoutingFromItems(selectedRouting?.id ?? null, nextItems);

      if (payload.entityType !== 'group' || groupOrders.length === 0) {
        logRoutingEvent({
          name: 'routing.wave1.reorder.local-applied',
          properties: {
            entityType: payload.entityType,
            dragKey: payload.dragKey,
            dropKey: payload.dropKey
          }
        });

        message.success('Routing 순서를 업데이트했습니다.');
        return;
      }

      reorderPersistingRef.current = true;
      const startTime =
        typeof performance !== 'undefined' ? performance.now() : Date.now();

      try {
        await Promise.all(
          groupOrders.map((plan) =>
            orderRoutingGroups({
              revisionId: plan.revisionId,
              orderedGroupIds: plan.orderedGroupIds
            })
          )
        );

        logRoutingEvent({
          name: 'routing.wave1.reorder.success',
          properties: {
            revisionId: groupOrders.map((plan) => plan.revisionId).join(','),
            dragKey: payload.dragKey,
            dropKey: payload.dropKey
          },
          measurements: {
            durationMs:
              (typeof performance !== 'undefined' ? performance.now() : Date.now()) -
              startTime
          }
        });

        message.success('Routing 그룹 순서를 저장했습니다.');
      } catch (error) {
        logRoutingEvent({
          name: 'routing.wave1.reorder.fail',
          properties: {
            revisionId: groupOrders.map((plan) => plan.revisionId).join(','),
            error: error instanceof Error ? error.message : String(error)
          }
        });

        message.error('그룹 순서 저장에 실패하여 이전 상태로 롤백했습니다.');

        setItemsState(previousItems);
        setSelectedRoutingFromItems(selectedRouting?.id ?? null, previousItems);
      } finally {
        reorderPersistingRef.current = false;
      }
    },
    [itemsState, selectedRouting?.id, setItemsState, setSelectedRoutingFromItems]
  );

  const handleReorder = useCallback(
    (payload: TreePanelReorderPayload) => {
      void persistReorder(payload);
    },
    [persistReorder]
  );

  const handleGroupRename = useCallback(
    (groupId: string, nextName: string) => {
      const trimmed = nextName.trim();

      if (!trimmed) {
        message.warning('그룹 이름은 비워둘 수 없습니다.');

        return;
      }

      const previousItems = itemsState;
      const timestamp = new Date().toISOString();
      let updated = false;

      const nextItems = itemsState.map((item) => {
        let itemChanged = false;

        const nextRevisions = item.revisions.map((revision) => {
          const nextGroups = revision.routingGroups.map((group) => {
            if (group.id !== groupId) {
              return group;
            }

            updated = true;
            itemChanged = true;

            return {
              ...group,

              name: trimmed,

              updatedAt: timestamp,

              updatedBy: 'explorer.ui'
            };
          });

          return itemChanged
            ? {
                ...revision,

                routingGroups: nextGroups
              }
            : revision;
        });

        return itemChanged
          ? {
              ...item,

              revisions: nextRevisions
            }
          : item;
      });

      if (!updated) {
        message.warning('대상 그룹을 찾지 못했습니다.');

        return;
      }

      setItemsState(nextItems);
      setSelectedRoutingFromItems(selectedRouting?.id ?? null, nextItems);

      logRoutingEvent({
        name: 'routing.wave1.group.rename.local-applied',
        properties: { groupId, name: trimmed }
      });

      if (renameInFlightRef.current.has(groupId)) {
        message.info('이전 이름 저장이 완료될 때까지 잠시 기다려주세요.');

        return;
      }

      renameInFlightRef.current.add(groupId);

      void renameRoutingGroup({ groupId, name: trimmed })
        .then((result) => {
          logRoutingEvent({
            name: 'routing.wave1.group.rename.success',
            properties: { groupId, name: trimmed }
          });

          if (result.updatedAt || result.updatedBy) {
            setItemsState((current) =>
              current.map((item) => ({
                ...item,
                revisions: item.revisions.map((revision) => ({
                  ...revision,
                  routingGroups: revision.routingGroups.map((group) =>
                    group.id === groupId
                      ? {
                          ...group,
                          updatedAt: result.updatedAt ?? group.updatedAt,
                          updatedBy: result.updatedBy ?? group.updatedBy
                        }
                      : group
                  )
                }))
              }))
            );
          }

          message.success(`Group renamed to ${trimmed}.`);
        })
        .catch((error) => {
          logRoutingEvent({
            name: 'routing.wave1.group.rename.fail',
            properties: {
              groupId,
              name: trimmed,
              error: error instanceof Error ? error.message : String(error)
            }
          });

          message.error('그룹 이름 저장에 실패하여 이전 상태로 복구했습니다.');
          setItemsState(previousItems);
          setSelectedRoutingFromItems(selectedRouting?.id ?? null, previousItems);
        })
        .finally(() => {
          renameInFlightRef.current.delete(groupId);
        });
    },
    [
      itemsState,
      selectedRouting?.id,
      setItemsState,
      setSelectedRoutingFromItems
    ]
  );

  const handleGroupSoftDelete = useCallback(
    (groupId: string, isDeleted: boolean) => {
      const previousItems = itemsState;
      const timestamp = new Date().toISOString();
      let updated = false;

      const nextItems = itemsState.map((item) => {
        let itemChanged = false;

        const nextRevisions = item.revisions.map((revision) => {
          const nextGroups = revision.routingGroups.map((group) => {
            if (group.id !== groupId) {
              return group;
            }

            updated = true;
            itemChanged = true;

            return {
              ...group,

              isDeleted,

              updatedAt: timestamp,

              updatedBy: 'explorer.ui'
            };
          });

          return itemChanged
            ? {
                ...revision,

                routingGroups: nextGroups
              }
            : revision;
        });

        return itemChanged
          ? {
              ...item,

              revisions: nextRevisions
            }
          : item;
      });

      if (!updated) {
        message.warning('대상 그룹을 찾지 못했습니다.');

        return;
      }

      setItemsState(nextItems);
      setSelectedRoutingFromItems(selectedRouting?.id ?? null, nextItems);

      logRoutingEvent({
        name: 'routing.wave1.group.soft-delete.local-applied',
        properties: { groupId, isDeleted }
      });

      if (softDeleteInFlightRef.current.has(groupId)) {
        message.info('이전 삭제/복원 요청이 처리되는 중입니다. 잠시 후 다시 시도해주세요.');

        return;
      }

      softDeleteInFlightRef.current.add(groupId);

      void toggleRoutingGroupDeletion({ groupId, isDeleted })
        .then((result) => {
          logRoutingEvent({
            name: 'routing.wave1.group.soft-delete.success',
            properties: { groupId, isDeleted }
          });

          if (result.synchronizedAt) {
            setItemsState((current) =>
              current.map((item) => ({
                ...item,
                revisions: item.revisions.map((revision) => ({
                  ...revision,
                  routingGroups: revision.routingGroups.map((group) =>
                    group.id === groupId
                      ? {
                          ...group,
                          updatedAt: result.synchronizedAt
                        }
                      : group
                  )
                }))
              }))
            );
          }

          message.success(
            isDeleted ? '그룹을 삭제 상태로 표시했습니다.' : '그룹을 복원했습니다.'
          );
        })
        .catch((error) => {
          logRoutingEvent({
            name: 'routing.wave1.group.soft-delete.fail',
            properties: {
              groupId,
              isDeleted,
              error: error instanceof Error ? error.message : String(error)
            }
          });

          message.error(
            isDeleted
              ? '그룹 삭제 표시 저장에 실패하여 이전 상태로 복구했습니다.'
              : '그룹 복원 저장에 실패하여 이전 상태로 복구했습니다.'
          );
          setItemsState(previousItems);
          setSelectedRoutingFromItems(selectedRouting?.id ?? null, previousItems);
        })
        .finally(() => {
          softDeleteInFlightRef.current.delete(groupId);
        });
    },
    [
      itemsState,
      selectedRouting?.id,
      setItemsState,
      setSelectedRoutingFromItems
    ]
  );

  const handleGroupCreateRouting = useCallback(
    (groupId: string) => {
      for (const item of itemsState) {
        for (const revision of item.revisions) {
          const group = revision.routingGroups.find(
            (candidate) => candidate.id === groupId
          );

          if (group) {
            setWizardContext({
              item,

              revision,

              group
            });

            return;
          }
        }
      }

      message.error('Unable to locate routing group.');
    },

    [itemsState, setWizardContext]
  );

  const handleWizardCancel = useCallback(() => {
    setWizardContext(null);
  }, [setWizardContext]);

  const handleWizardSubmit = useCallback(

    async (input: RoutingCreationInput) => {

      if (!wizardContext) {

        return;

      }



      const context = wizardContext;

      const previousItems = itemsState;

      const previousSelectedId = selectedRouting?.id ?? null;

      const now = new Date().toISOString();

      const fallbackSharedDrivePath =

        context.group.sharedDrivePath ?? context.item.code;



      const optimisticRouting: ExplorerRouting = {

        id: createClientId(),

        code: input.code,

        status: input.status,

        camRevision: context.revision.code,

        owner: input.owner,

        notes: input.notes,

        sharedDrivePath: fallbackSharedDrivePath,

        sharedDriveReady: input.sharedDriveReady,

        createdAt: now,

        updatedAt: now,

        files: []

      };



      const nextItems = itemsState.map((item) => {

        if (item.id !== context.item.id) {

          return item;

        }



        const nextRevisions = item.revisions.map((revision) => {

          if (revision.id !== context.revision.id) {

            return revision;

          }



          const nextGroups = revision.routingGroups.map((group) => {

            if (group.id !== context.group.id) {

              return group;

            }



            return {

              ...group,

              updatedAt: now,

              updatedBy: 'explorer.ui',

              routings: [optimisticRouting, ...group.routings.map(cloneRouting)]

            };

          });



          return {

            ...revision,

            routingGroups: nextGroups

          };

        });



        return {

          ...item,

          revisions: nextRevisions

        };

      });



      setItemsState(nextItems);

      setSelectedRouting(optimisticRouting);



      logRoutingEvent({

        name: 'routing.wave1.create.local-applied',

        properties: {

          groupId: context.group.id,

          routingCode: input.code

        }

      });



      try {

        const result = await createRouting({

          groupId: context.group.id,

          revisionId: context.revision.id,

          revisionCode: context.revision.code,

          itemId: context.item.id,

          itemCode: context.item.code,

          code: input.code,

          status: input.status,

          owner: input.owner,

          notes: input.notes,

          sharedDriveReady: input.sharedDriveReady,

          sharedDrivePath: context.group.sharedDrivePath

        });



        const routingFromApi: ExplorerRouting = {

          ...optimisticRouting,

          ...result.routing,

          files: result.routing.files?.map((file) => ({ ...file })) ?? []

        };



        setItemsState((current) =>

          current.map((item) => {

            if (item.id !== context.item.id) {

              return item;

            }



            const nextRevisions = item.revisions.map((revision) => {

              if (revision.id !== context.revision.id) {

                return revision;

              }



              const nextGroups = revision.routingGroups.map((group) => {

                if (group.id !== context.group.id) {

                  return group;

                }



                return {

                  ...group,

                  updatedAt: routingFromApi.updatedAt ?? now,

                  updatedBy: 'explorer.api',

                  routings: [

                    routingFromApi,

                    ...group.routings.filter(

                      (routing) => routing.id !== optimisticRouting.id

                    )

                  ]

                };

              });



              return {

                ...revision,

                routingGroups: nextGroups

              };

            });



            return {

              ...item,

              revisions: nextRevisions

            };

          })

        );



        setSelectedRouting(routingFromApi);

        setWizardContext(null);



        logRoutingEvent({

          name: 'routing.wave1.create.success',

          properties: {

            groupId: context.group.id,

            routingId: routingFromApi.id,

            routingCode: routingFromApi.code

          }

        });



        message.success(`Routing ${routingFromApi.code} created.`);

      } catch (error) {

        logRoutingEvent({

          name: 'routing.wave1.create.fail',

          properties: {

            groupId: context.group.id,

            routingCode: input.code,

            error: error instanceof Error ? error.message : String(error)

          }

        });



        setItemsState(previousItems);

        setSelectedRoutingFromItems(previousSelectedId, previousItems);

        message.error('Failed to create routing. Changes were reverted.');



        throw error;

      }

    },

    [

      itemsState,

      selectedRouting?.id,

      setItemsState,

      setSelectedRouting,

      setSelectedRoutingFromItems,

      wizardContext,

      setWizardContext

    ]

  );




  const tabs = useMemo(
    () => [
      {
        key: 'summary',

        label: '요약',

        children: selectedRouting ? (
          <div className="flex flex-col gap-2">
            {' '}
            <Paragraph>
              {' '}
              <Text strong>Routing Code:</Text> {selectedRouting.code}
            </Paragraph>{' '}
            <Paragraph>
              {' '}
              <Text strong>Status:</Text> {selectedRouting.status}
            </Paragraph>{' '}
            <Paragraph>
              {' '}
              <Text strong>CAM Revision:</Text> {selectedRouting.camRevision}
            </Paragraph>{' '}
          </div>
        ) : (
          <Empty description="라우팅을 선택하세요" />
        )
      },

      {
        key: 'history',

        label: '히스토리',

        children: <Empty description="히스토리 로딩 예정" />
      },

      {
        key: 'files',

        label: '파일',

        children: selectedRouting ? (
          <ul className="list-disc pl-5">
            {' '}
            {selectedRouting.files.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <Empty description="파일 목록 준비 중" />
        )
      }
    ],

    [selectedRouting]
  );

  const executeSearch = useCallback(
    (term: string, notify = true) => {
      if (!isSearchFeatureEnabled) {
        return;
      }

      setLastSearchError(null);

      searchMutation.mutate(
        {
          term,

          pageSize: 25,

          slaTargetMs: 1500
        },

        {
          onSuccess: (result) => {
            setSearchResult(result);

            if (notify) {
              message.success(`검색 완료 (${result.total}건)`, 1.2);
            }
          },

          onError: (err) => {
            const description =
              err instanceof Error ? err.message : '시스템 서비스 문제';

            setLastSearchError(description);

            message.error(`검색 오류: ${description}`);
          }
        }
      );
    },

    [isSearchFeatureEnabled, searchMutation, setLastSearchError, setSearchResult]
  );

  const handleSearch = useCallback(
    (rawValue?: string) => {
      if (!isSearchFeatureEnabled) {
        message.info('검색 기능 토글이 비활성화되어 있습니다.');

        return;
      }

      const nextTerm = (rawValue ?? searchTerm).trim();

      if (!nextTerm) {
        message.info('검색어를 입력하세요.');

        return;
      }

      setSearchTerm(nextTerm);

      executeSearch(nextTerm, true);
    },

    [executeSearch, isSearchFeatureEnabled, searchTerm, setSearchTerm]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      setLastSearchError(null);

      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }

      if (!isSearchFeatureEnabled) {
        return;
      }

      const trimmed = value.trim();

      if (!trimmed) {
        setSearchResult(null);

        return;
      }

      typeaheadTimeoutRef.current = setTimeout(() => {
        if (trimmed.length >= 2) {
          executeSearch(trimmed, false);
        }
      }, 350);
    },

    [executeSearch, isSearchFeatureEnabled, setLastSearchError, setSearchResult, setSearchTerm, typeaheadTimeoutRef]
  );

  const handleSelectSearchRouting = useCallback(
    (routingId: string) => {
      const next = findRoutingById(routingId);

      if (!next) {
        message.warning('탐색 트리에 없는 라우팅입니다.');

        return;
      }

      setSelectedRouting(next);
    },

    [findRoutingById, setSelectedRouting]
  );


  const handleHoverMenuViewDetail = useCallback(
    (routingId: string) => {
      handleSelectSearchRouting(routingId);
      setDetailModalOpen(true);
      setDetailActiveTab('summary');
    },
    [handleSelectSearchRouting, setDetailActiveTab, setDetailModalOpen]
  );

  const handleHoverMenuOpenUploads = useCallback(
    (routingId: string) => {
      handleSelectSearchRouting(routingId);
      window.setTimeout(() => handleShowUploadPanel(), 0);
    },
    [handleSelectSearchRouting, handleShowUploadPanel]
  );

  const handleHoverMenuApprove = useCallback((routingId: string) => {
    void routingId;
    message.info('Approve flow coming soon.');
  }, []);
  const handleHoverMenuPinToggle = useCallback(
    (routingId: string, nextPinned: boolean) => {
      const action = nextPinned ? 'Pinning ' : 'Unpinning ';
      message.info(action + routingId + ' (placeholder)');
    },
    []
  );

  const handleTreeRoutingHover = useCallback(
    ({ routing, event }: { routing: ExplorerRouting; event: ReactMouseEvent<HTMLElement>; }) => {
      if (!hoverMenuEnabled) {
        return;
      }
      cancelHoverMenuClose();
      const anchorRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      openHoverMenu({
        routingId: routing.id,
        routingCode: routing.code,
        status: routing.status,
        origin: 'tree',
        anchorRect,
        canApprove: routing.status === 'PendingApproval'
      });
    },
    [hoverMenuEnabled, cancelHoverMenuClose, openHoverMenu]
  );

  const handleTreeRoutingLeave = useCallback(() => {
    if (!hoverMenuEnabled) {
      return;
    }
    scheduleHoverMenuClose();
  }, [hoverMenuEnabled, scheduleHoverMenuClose]);
  const addinBadgeStatus = selectedRouting ? 'queued' : 'idle';

  const addinBadgeMessage = selectedRouting
    ? `${selectedRouting.code} Add-in 처리 대기(Mock)`
    : '라우팅을 선택하면 Add-in 큐 상태가 표시됩니다.';

  const clearFilters = useCallback(() => {
    setProductFilter(undefined);

    setGroupFilter(undefined);

    setStatusFilter(undefined);
  }, [setGroupFilter, setProductFilter, setStatusFilter]);

  const resetSearchExperience = useCallback(() => {
    if (typeaheadTimeoutRef.current) {
      clearTimeout(typeaheadTimeoutRef.current);
    }

    setSearchTerm('');

    setSearchResult(null);

    setLastSearchError(null);

    clearFilters();
  }, [clearFilters, setLastSearchError, setSearchResult, setSearchTerm, typeaheadTimeoutRef]);

  const handleSearchFeatureToggle = useCallback(
    (nextEnabled: boolean) => {
      setIsSearchFeatureEnabled(nextEnabled);

      if (!nextEnabled) {
        resetSearchExperience();

        setLegacyFilterTerm('');

        message.info(
          'Routing 검색 플래그 비활성화: 레거시 뷰로 전환되었습니다.',

          1.6
        );
      } else {
        message.success(
          'Routing 검색 플래그 활성화: 신규 검색 뷰가 적용됩니다.',

          1.6
        );
      }
    },

    [resetSearchExperience, setIsSearchFeatureEnabled, setLegacyFilterTerm]
  );

  const legacyRoutingItems = useMemo<LegacyRoutingListItem[]>(() => {
    const entries: LegacyRoutingListItem[] = [];

    itemsState.forEach((item) => {
      item.revisions.forEach((revision) => {
        revision.routingGroups.forEach((group) => {
          group.routings.forEach((routing) => {
            entries.push({
              routingId: routing.id,

              routingCode: routing.code,

              productCode: item.code,

              revisionCode: revision.code,

              status: routing.status,

              groupName: group.name,

              updatedAt: routing.updatedAt ?? group.updatedAt ?? null
            });
          });
        });
      });
    });

    return entries.sort((a, b) => {
      const left = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;

      const right = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      return right - left;
    });
  }, [itemsState]);

  const filteredLegacyItems = useMemo(() => {
    const normalized = legacyFilterTerm.trim().toLowerCase();

    if (!normalized) {
      return legacyRoutingItems.slice(0, 50);
    }

    return legacyRoutingItems

      .filter((item) => {
        const tokens = [
          item.routingCode,

          item.productCode,

          item.groupName,

          item.status
        ].map((value) => value.toLowerCase());

        return tokens.some((token) => token.includes(normalized));
      })

      .slice(0, 50);
  }, [legacyFilterTerm, legacyRoutingItems]);

  const legacyTotalCount = legacyRoutingItems.length;

  const searchItems = useMemo<RoutingSearchItem[]>(() => searchResult?.items ?? [], [searchResult]);
  const termSnapshot = searchTerm || legacyFilterTerm || '';

  const productOptions = useMemo(() => {
    const values = new Set(searchItems.map((item) => item.productCode));

    return Array.from(values).map((value) => ({
      label: value,

      value
    }));
  }, [searchItems]);

  const groupOptions = useMemo(() => {
    const values = new Set(searchItems.map((item) => item.groupName));

    return Array.from(values).map((value) => ({
      label: value || 'N/A',

      value
    }));
  }, [searchItems]);

  const statusOptions = useMemo(() => {
    const values = new Set(searchItems.map((item) => item.status));

    return Array.from(values).map((value) => ({
      label: value,

      value
    }));
  }, [searchItems]);

  const filteredItems = useMemo(
    () =>
      searchItems.filter((item) => {
        if (productFilter && item.productCode !== productFilter) return false;

        if (groupFilter && item.groupName !== groupFilter) return false;

        if (statusFilter && item.status !== statusFilter) return false;

        return true;
      }),

    [searchItems, productFilter, groupFilter, statusFilter]
  );

  const slaSummary = searchResult
    ? {
        target: searchResult.slaTargetMs ?? 1500,

        server: searchResult.slaMs ?? 0,

        client: searchResult.observedClientMs ?? 0
      }
    : null;

  const legacySearchFallback = (
    <Card title="Routing Search (Legacy)" bordered>
      <Space direction="vertical" size="middle" className="w-full">
        <Paragraph type="secondary" className={styles.searchStats}>
          구형 검색은 Explorer 트리에서 계속 확인할 수 있습니다. (
          {filteredLegacyItems.length}/{legacyTotalCount}건)
        </Paragraph>
        <Input.Search
          placeholder="코드/제품/상태 (부분 일치)"
          value={legacyFilterTerm}
          onChange={(event) => setLegacyFilterTerm(event.target.value)}
          onSearch={(value) => setLegacyFilterTerm(value.trim())}
          allowClear
          aria-label="레거시 검색"
        />
        {filteredLegacyItems.length ? (
          <List
            dataSource={filteredLegacyItems}
            bordered
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="open"
                    type="link"
                    onClick={() => handleSelectSearchRouting(item.routingId)}
                  >
                    열기
                  </Button>,
                  <Button key="download" type="link" disabled>
                    다운로드
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={`${item.routingCode} · ${item.productCode}`}
                  description={
                    <>
                      Revision {item.revisionCode} ·
                      <Tag color={STATUS_TAG_COLOR[item.status] ?? 'default'}>
                        {item.status}
                      </Tag>
                    </>
                  }
                />
                <Text type="secondary">
                  {item.groupName}
                  {item.updatedAt
                    ? ` · ${new Date(item.updatedAt).toLocaleString()}`
                    : ''}
                </Text>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="일치하는 결과가 없습니다." />
        )}
      </Space>
    </Card>
  );

  const treeColumn = (
    <TreePanel
      items={itemsState}
      onSelect={(routingId) => {
        if (!routingId) {
          setSelectedRouting(null);
          return;
        }
        const next = findRoutingById(routingId);
        setSelectedRouting(next);
      }}
      onReorder={handleReorder}
      onGroupRename={handleGroupRename}
      onGroupSoftDelete={handleGroupSoftDelete}
      onGroupCreateRouting={handleGroupCreateRouting}
      onRoutingHover={hoverMenuEnabled ? handleTreeRoutingHover : undefined}
      onRoutingLeave={hoverMenuEnabled ? handleTreeRoutingLeave : undefined}
    />
  );

  const mainColumn = (
    <div className={styles.mainColumn}>
      <Card id="explorer-summary-card" title="Explorer Summary" bordered>
        <div className={styles.summaryGrid}>
          {summaryItems.map((item) => (
            <div key={item.label}>
              <Text strong>{item.label}:</Text> {item.value}
            </div>
          ))}
        </div>
        {isError ? (
          <Alert
            className="mt-4"
            type="error"
            message="Explorer 데이터를 불러오는 중 오류가 발생했습니다."
            description={(error as Error | undefined)?.message}
            showIcon
          />
        ) : null}
      </Card>
      <Card bordered>
        {isFetching && !isError ? (
          <div className="flex justify-center py-10">
            <Spin tip="Explorer 데이터를 불러오는 중" />
          </div>
        ) : (
          <Tabs defaultActiveKey="summary" items={tabs} />
        )}
      </Card>
      {hoverMenuToggleCard}
            <FeatureGate
        flag="feature.search-routing"
        onToggle={handleSearchFeatureToggle}
        fallback={legacySearchFallback}
      >
        <Card title="Routing Search" bordered>
          <div className={styles.searchContent}>
            <SearchFilterRail
              productOptions={productOptions}
              groupOptions={groupOptions}
              statusOptions={statusOptions}
              productValue={productFilter}
              groupValue={groupFilter}
              statusValue={statusFilter}
              disabled={!filteredItems.length}
              onProductChange={(value) =>
                setProductFilter(value as string | undefined)
              }
              onGroupChange={(value) =>
                setGroupFilter(value as string | undefined)
              }
              onStatusChange={(value) =>
                setStatusFilter(value as string | undefined)
              }
              onReset={clearFilters}
            />
            <Input.Search
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              onSearch={handleSearch}
              placeholder="Routing \ucf54드 / \uc81c품 / \uc0c1태 \uac80\uc0c9"
              allowClear
              enterButton="Search"
              aria-label="Routing \uac80\uc0c9"
              disabled={!isSearchFeatureEnabled}
            />
            {lastSearchError ? (
              <Alert
                type="error"
                message={lastSearchError}
                showIcon
                className="mt-2"
              />
            ) : null}
            <div className={styles.slaGrid}>
              <div className={styles.slaCard}>
                <span className={styles.slaLabel}>서버 SLA</span>
                <span className={styles.slaValue}>
                  {slaSummary?.server ?? '—'} ms
                </span>
                <span className={styles.slaDelta}>
                  목표 {slaSummary?.target ?? '1,500'} ms
                </span>
              </div>
              <div className={styles.slaCard}>
                <span className={styles.slaLabel}>클라이언트 관측</span>
                <span className={styles.slaValue}>
                  {slaSummary?.client ?? '—'} ms
                </span>
                {slaSummary ? (
                  <span className={styles.slaDelta}>
                    대비{' '}
                    {Math.round(
                      ((slaSummary.client || 0) / (slaSummary.target || 1)) *
                        100
                    )}
                    %
                  </span>
                ) : null}
              </div>
              <div className={styles.slaCard}>
                <span className={styles.slaLabel}>결과 수</span>
                <span className={styles.slaValue}>{filteredItems.length}</span>
                <span className={styles.slaDelta}>
                  총 {(searchResult?.total ?? filteredItems.length)}건
                </span>
              </div>
            </div>
            <Paragraph className={styles.searchStats}>
              검색어: “{searchTerm || termSnapshot}” · 최신 탐색 시간{' '}
              {new Date().toLocaleTimeString()}
            </Paragraph>
            <List
              className={styles.resultList}
              dataSource={filteredItems}
              locale={{
                emptyText: <Empty description="검색 결과가 없습니다." />
              }}
              renderItem={(item) => {
                const isActive = hoveredResultId === item.routingId;
                return (
                  <List.Item
                    className={styles.resultItem}
                    data-active={isActive}
                    onMouseEnter={(event) => {
                      setHoveredResultId(item.routingId);
                      if (hoverMenuEnabled) {
                        cancelHoverMenuClose();
                        const anchorRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                        openHoverMenu({
                          routingId: item.routingId,
                          routingCode: item.routingCode,
                          status: item.status,
                          origin: 'search',
                          anchorRect,
                          canApprove: item.status === 'PendingApproval'
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredResultId((prev) => (prev === item.routingId ? null : prev));
                      if (hoverMenuEnabled) {
                        scheduleHoverMenuClose();
                      }
                    }}
                    onFocus={(event) => {
                      setHoveredResultId(item.routingId);
                      if (hoverMenuEnabled) {
                        cancelHoverMenuClose();
                        const anchorRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                        openHoverMenu(
                          {
                            routingId: item.routingId,
                            routingCode: item.routingCode,
                            status: item.status,
                            origin: 'search',
                            anchorRect,
                            canApprove: item.status === 'PendingApproval'
                          },
                          { immediate: true }
                        );
                      }
                    }}
                    onBlur={() => {
                      setHoveredResultId((prev) => (prev === item.routingId ? null : prev));
                      if (hoverMenuEnabled) {
                        scheduleHoverMenuClose();
                      }
                    }}
                  >
                    <div className={styles.resultHeader}>
                      <div className={styles.resultTitle}>
                        <span>{item.routingCode}</span>
                        <Divider type="vertical" />
                        <Text type="secondary">{item.productCode}</Text>
                      </div>
                      <div className={styles.resultActions}>
                        <Button
                          size="small"
                          type="link"
                          onClick={() =>
                            handleSelectSearchRouting(item.routingId)
                          }
                        >
                          열기
                        </Button>
                        <Button
                          size="small"
                          type="link"
                          onClick={() =>
                            message.info('핀 기능은 준비 중입니다.')
                          }
                        >
                          핀 고정
                        </Button>
                        <Button size="small" type="link" disabled>
                          다운로드
                        </Button>
                      </div>
                    </div>
                    <div className={styles.resultMeta}>
                      <span>{item.groupName}</span>
                      <Divider type="vertical" />
                      <span>{item.status}</span>
                      {item.updatedAt ? (
                        <>
                          <Divider type="vertical" />
                          <span>
                            {new Date(item.updatedAt).toLocaleString()}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </List.Item>
                );
              }}
            />
          </div>
        </Card>
      </FeatureGate>
    </div>
  );

  const modelUrl = useMemo(() => {
    if (!selectedRouting || !selectedRouting.files) {
      return undefined;
    }

    const candidate = selectedRouting.files.find((file) =>
      file.type === 'stl' || file.type === 'esprit'
    );

    if (!candidate) {
      return undefined;
    }

    return `/api/workspace/models/${selectedRouting.id}/${candidate.id}`;
  }, [selectedRouting]);

const previewColumn = (
    <div className={styles.previewColumn}>
      <Card
        id="workspace-upload-card"
        title="Workspace Uploads"
        bordered
        className={styles.previewCard}
      >
        <WorkspaceUploadPanel
          routing={selectedRouting}
          canReplaceSolidWorks={userPermissions.canReplaceSolidWorks}
          permissionsLoading={permissionsQuery.isLoading}
        />
      </Card>
      <Card
        id="three-viewer-card"
        title="3D Preview"
        bordered
        className={styles.previewCard}
      >
        <ThreeViewer modelUrl={modelUrl} />
        <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
          {modelUrl ? '선택된 Routing과 연결된 모델을 불러왔습니다.' : '표시할 모델이 없으면 샘플 형상이 렌더링됩니다.'}
        </Text>
      </Card>
      <Card
        id="addin-history-card"
        title="Add-in Log"
        bordered
        className={styles.previewCard}
      >
        <AddinHistoryPanel
          status={addinBadgeStatus}
          message={addinBadgeMessage}
          routingCode={selectedRouting?.code}
          jobs={resolved.addinJobs}
        />
      </Card>
      <EspritJobPanel
        className={styles.previewCard}
        routingId={selectedRouting?.id ?? undefined}
        routingCode={selectedRouting?.code ?? undefined}
        onRequestApiKey={() => setEspritKeyModalOpen(true)}
        lastGeneratedKey={latestEspritKey}
      />
    </div>
  );

  const layoutRibbon = (
    <ExplorerRibbon
      selectedRouting={selectedRouting}
      canOpenExplorer={userPermissions.canOpenExplorer}
      onOpenSelected={handleRibbonOpenSelected}
      onOpenWizard={handleRibbonOpenWizard}
      onOpenExplorer={handleOpenInExplorer}
      onShowUploadPanel={handleShowUploadPanel}
      onDownloadSelected={handleRibbonDownload}
      onShowAddinPanel={handleShowAddinPanel}
    />
  );

  return (
    <>
      <ExplorerLayout
        ribbon={layoutRibbon}
        tree={treeColumn}
        main={mainColumn}
        aside={previewColumn}
      />
      <EspritKeyModal
        open={espritKeyModalOpen}
        onClose={() => setEspritKeyModalOpen(false)}
        onCreated={(result) => {
          setLatestEspritKey(result);
          setEspritKeyModalOpen(false);
        }}
      />
      <Modal
        open={downloadModalOpen}
        onCancel={handleDownloadModalClose}
        title={selectedRouting ? `${selectedRouting.code} 다운로드` : 'Routing 다운로드'}
        footer={null}
        destroyOnClose
      >
        <Space direction="vertical" size="middle" className="w-full">
          <Button
            type="primary"
            block
            onClick={handleBundleDownload}
            loading={downloadLoading}
            disabled={!selectedRouting}
          >
            {selectedRouting ? `${selectedRouting.code} 번들(.zip) 다운로드` : 'Routing을 선택하세요'}
          </Button>
          {downloadError ? (
            <Alert type="error" showIcon message={downloadError} />
          ) : null}
          {downloadMeta ? (
            <Alert
              type="success"
              showIcon
              message="다운로드 정보"
              description={
                <div className="flex flex-col gap-1">
                  <div>파일명: {downloadMeta.fileName}</div>
                  {downloadMeta.checksum ? (
                    <div>Checksum: <code>{downloadMeta.checksum}</code></div>
                  ) : null}
                </div>
              }
            />
          ) : null}
          <Divider />
          <Text strong>개별 파일 다운로드</Text>
          {selectedRouting && selectedRouting.files.length ? (
            <List
              dataSource={selectedRouting.files}
              renderItem={(file) => (
                <List.Item
                  actions={[
                    <Button
                      key="download"
                      type="link"
                      onClick={() => handleFileDownload(file)}
                      loading={downloadLoading}
                    >
                      다운로드
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={file.name}
                    description={`유형: ${file.type}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="다운로드 가능한 파일이 없습니다." />
          )}
        </Space>
      </Modal>
      <RoutingDetailModal
        open={isDetailModalOpen}
        routing={selectedRouting}
        detail={routingDetailQuery.data}
        loading={detailLoading}
        error={detailError}
        activeTab={detailActiveTab}
        onTabChange={handleDetailTabChange}
        onClose={handleDetailModalClose}
        onRetry={routingDetailQuery.refetch}
        versions={versionList}
        versionsLoading={versionsQuery.isLoading || versionsQuery.isFetching}
        canManageVersions={userPermissions.canManageRoutingVersions}
        onPromoteVersion={handlePromoteVersion}
        onToggleLegacyVersion={handleToggleLegacyVersion}
      />
      {wizardContext ? (
        <RoutingCreationWizard
          open
          item={wizardContext.item}
          revision={wizardContext.revision}
          group={wizardContext.group}
          onCancel={handleWizardCancel}
          onSubmit={handleWizardSubmit}
        />
      ) : null}
      {hoverMenuEnabled && hoverMenuContext ? (
        <ExplorerHoverMenu
          context={hoverMenuContext}
          onClose={() => closeHoverMenu({ immediate: true })}
          cancelClose={cancelHoverMenuClose}
          scheduleClose={scheduleHoverMenuClose}
          onViewDetail={handleHoverMenuViewDetail}
          onOpenUploads={handleHoverMenuOpenUploads}
          onApprove={handleHoverMenuApprove}
          onPinToggle={handleHoverMenuPinToggle}
        />
      ) : null}
    </>
  );
}






