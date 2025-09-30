'use client';

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
  message
} from 'antd';

import { useCallback, useEffect, useMemo } from 'react';

import TreePanel, { TreePanelReorderPayload } from '@/components/TreePanel';

import FeatureGate from '@/components/features/FeatureGate';

import RoutingCreationWizard, {
  type RoutingCreationInput
} from '@/components/explorer/RoutingCreationWizard';

import WorkspaceUploadPanel from '@/components/workspace/WorkspaceUploadPanel';

import AddinHistoryPanel from './AddinHistoryPanel';

import SearchFilterRail from './SearchFilterRail';

import ExplorerRibbon from './ExplorerRibbon';
import ExplorerLayout from './ExplorerLayout';
import styles from './ExplorerShell.module.css';
import { useExplorerLayout } from '@/hooks/useExplorerLayout';

import { useExplorerData } from '@/hooks/useExplorerData';

import { useRoutingSearch } from '@/hooks/useRoutingSearch';

import type {
  ExplorerItem,
  ExplorerRevision,
  ExplorerRouting,
  ExplorerRoutingGroup,
  ExplorerResponse
} from '@/types/explorer';

import type { RoutingSearchItem, RoutingSearchResult } from '@/types/search';

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
      const candidate = revision.routings.find(
        (routing) => routing.id === routingId
      );

      if (candidate) {
        return candidate;
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

  const searchMutation = useRoutingSearch();

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
      message.info('Routing을 먼저 선택하세요.');

      return;
    }

    scrollToCard('explorer-summary-card');
  }, [scrollToCard, selectedRouting]);

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
  }, [getSelectedRoutingContext]);

  const handleRibbonDownload = useCallback(() => {
    if (!selectedRouting) {
      message.info('다운로드할 Routing을 선택하세요.');

      return;
    }

    message.info('다운로드 기능은 Sprint8에서 활성화될 예정입니다.');
  }, [selectedRouting]);

  const handleShowUploadPanel = useCallback(() => {
    scrollToCard('workspace-upload-card');
  }, [scrollToCard]);

  const handleShowAddinPanel = useCallback(() => {
    scrollToCard('addin-history-card');
  }, [scrollToCard]);

  useEffect(() => {
    setItemsState(items);
  }, [items]);

  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, []);

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
  }, [itemsState, selectedRouting]);

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

    []
  );

  const applyReorder = useCallback(
    (payload: TreePanelReorderPayload) => {
      let updated = false;

      const nextItems = itemsState.map((item) => {
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

            const insertIndex =
              payload.position === 'after' ? targetIndex + 1 : targetIndex;

            normalizedGroups.splice(insertIndex, 0, moved);

            const withDisplayOrder = normalizedGroups.map((group, index) => ({
              ...group,

              displayOrder: index + 1
            }));

            itemChanged = true;

            updated = true;

            return {
              ...revision,

              routingGroups: withDisplayOrder
            };
          }

          if (payload.entityType === 'routing') {
            const nextGroups = revision.routingGroups.map(cloneGroup);

            let groupChanged = false;

            const groupsWithRoutingUpdate = nextGroups.map((group) => {
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

              const insertIndex =
                payload.position === 'after' ? targetIndex + 1 : targetIndex;

              newRoutings.splice(insertIndex, 0, moved);

              groupChanged = true;

              return {
                ...group,

                routings: newRoutings
              };
            });

            if (groupChanged) {
              itemChanged = true;

              updated = true;

              return {
                ...revision,

                routingGroups: groupsWithRoutingUpdate
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

      if (updated) {
        setItemsState(nextItems);

        setSelectedRoutingFromItems(selectedRouting?.id ?? null, nextItems);

        message.success('Routing tree order updated.');
      } else {
        message.warning('Reorder request could not be applied.');
      }
    },

    [itemsState, selectedRouting?.id, setSelectedRoutingFromItems]
  );

  const handleGroupRename = useCallback(
    (groupId: string, nextName: string) => {
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

              name: nextName,

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
        message.warning('Group rename skipped (target not found).');

        return;
      }

      setItemsState(nextItems);

      setSelectedRoutingFromItems(selectedRouting?.id ?? null, nextItems);

      message.success(`Group renamed to ${nextName}.`);
    },

    [itemsState, selectedRouting?.id, setSelectedRoutingFromItems]
  );

  const handleGroupSoftDelete = useCallback(
    (groupId: string, isDeleted: boolean) => {
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
        message.warning('No matching group to update.');

        return;
      }

      setItemsState(nextItems);

      setSelectedRoutingFromItems(selectedRouting?.id ?? null, nextItems);

      message.success(
        isDeleted ? 'Group marked as deleted.' : 'Group restored.'
      );
    },

    [itemsState, selectedRouting?.id, setSelectedRoutingFromItems]
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

    [itemsState]
  );

  const handleWizardCancel = useCallback(() => {
    setWizardContext(null);
  }, []);

  const handleWizardSubmit = useCallback(
    async (input: RoutingCreationInput) => {
      if (!wizardContext) {
        return;
      }

      const newRouting: ExplorerRouting = {
        id: createClientId(),

        code: input.code,

        status: input.status,

        camRevision: wizardContext.revision.code,

        owner: input.owner,

        notes: input.notes,

        sharedDrivePath:
          wizardContext.group.sharedDrivePath ?? wizardContext.item.code,

        sharedDriveReady: input.sharedDriveReady,

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

        files: []
      };

      const nextItems = itemsState.map((item) => {
        if (item.id !== wizardContext.item.id) {
          return item;
        }

        const nextRevisions = item.revisions.map((revision) => {
          if (revision.id !== wizardContext.revision.id) {
            return revision;
          }

          const nextGroups = revision.routingGroups.map((group) => {
            if (group.id !== wizardContext.group.id) {
              return group;
            }

            return {
              ...group,

              updatedAt: new Date().toISOString(),

              updatedBy: 'explorer.ui',

              routings: [newRouting, ...group.routings.map(cloneRouting)]
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

      setSelectedRouting(newRouting);

      message.success(`Routing ${input.code} created.`);

      setWizardContext(null);
    },

    [itemsState, wizardContext]
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

    [isSearchFeatureEnabled, message, searchMutation]
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

    [executeSearch, isSearchFeatureEnabled, message, searchTerm]
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

    [executeSearch, isSearchFeatureEnabled]
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

    [findRoutingById]
  );

  const addinBadgeStatus = selectedRouting ? 'queued' : 'idle';

  const addinBadgeMessage = selectedRouting
    ? `${selectedRouting.code} Add-in 처리 대기(Mock)`
    : '라우팅을 선택하면 Add-in 큐 상태가 표시됩니다.';

  const clearFilters = useCallback(() => {
    setProductFilter(undefined);

    setGroupFilter(undefined);

    setStatusFilter(undefined);
  }, []);

  const resetSearchExperience = useCallback(() => {
    if (typeaheadTimeoutRef.current) {
      clearTimeout(typeaheadTimeoutRef.current);
    }

    setSearchTerm('');

    setSearchResult(null);

    setLastSearchError(null);

    clearFilters();
  }, [clearFilters]);

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

    [message, resetSearchExperience]
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

  const searchItems: RoutingSearchItem[] = searchResult?.items ?? [];
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
      onReorder={applyReorder}
      onGroupRename={handleGroupRename}
      onGroupSoftDelete={handleGroupSoftDelete}
      onGroupCreateRouting={handleGroupCreateRouting}
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
                  총 {searchResult.total ?? filteredItems.length}건
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
                    onMouseEnter={() => setHoveredResultId(item.routingId)}
                    onMouseLeave={() =>
                      setHoveredResultId((prev) =>
                        prev === item.routingId ? null : prev
                      )
                    }
                    onFocus={() => setHoveredResultId(item.routingId)}
                    onBlur={() =>
                      setHoveredResultId((prev) =>
                        prev === item.routingId ? null : prev
                      )
                    }
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

  const previewColumn = (
    <div className={styles.previewColumn}>
      <Card
        id="workspace-upload-card"
        title="Workspace Uploads"
        bordered
        className={styles.previewCard}
      >
        <WorkspaceUploadPanel routing={selectedRouting} />
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
    </div>
  );

  const layoutRibbon = (
    <ExplorerRibbon
      selectedRouting={selectedRouting}
      onOpenSelected={handleRibbonOpenSelected}
      onOpenWizard={handleRibbonOpenWizard}
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
    </>
  );
}
