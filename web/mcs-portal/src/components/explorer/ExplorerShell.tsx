'use client';

import {
  Card,
  Tabs,
  Empty,
  Typography,
  Spin,
  Alert,
  Timeline,
  Input,
  List,
  Space,
  Button,
  message
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TreePanel, { TreePanelReorderPayload } from '@/components/TreePanel';
import RoutingCreationWizard, {
  type RoutingCreationInput
} from '@/components/explorer/RoutingCreationWizard';
import WorkspaceUploadPanel from '@/components/workspace/WorkspaceUploadPanel';
import AddinBadge from './AddinBadge';
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

type WizardContext = {
  item: ExplorerItem;
  revision: ExplorerRevision;
  group: ExplorerRoutingGroup;
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
      const candidate = revision.routings.find((routing) => routing.id === routingId);
      if (candidate) {
        return candidate;
      }
    }
  }
  return null;
};

const cloneRouting = (routing: ExplorerRouting): ExplorerRouting => ({
  ...routing,
  files: routing.files.map((file) => ({ ...file }))
});

const cloneGroup = (group: ExplorerRoutingGroup): ExplorerRoutingGroup => ({
  ...group,
  routings: group.routings.map(cloneRouting)
});

export default function ExplorerShell({ initialData }: ExplorerShellProps) {
  const { data, isFetching, isError, error } = useExplorerData(initialData);
  const resolved = data ?? initialData;
  const { items, generatedAt, source } = resolved;

  const [itemsState, setItemsState] = useState<ExplorerItem[]>(items);
  const [selectedRouting, setSelectedRouting] = useState<ExplorerRouting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<RoutingSearchResult | null>(null);
  const [lastSearchError, setLastSearchError] = useState<string | null>(null);
  const [wizardContext, setWizardContext] = useState<WizardContext | null>(null);

  const searchMutation = useRoutingSearch();

  useEffect(() => {
    setItemsState(items);
  }, [items]);

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
        label: '������ ���� �ð�',
        value: new Date(generatedAt).toLocaleString()
      },
      { label: '������ ��', value: itemsState.length.toString() },
      { label: '������ ��ó', value: source === 'mock' ? 'Mock' : 'API' },
      {
        label: '����',
        value: isError ? '����' : isFetching ? '�ε� ��' : '����'
      }
    ];

    if (searchResult) {
      base.push({
        label: '�ֱ� �˻� SLA(ms)',
        value: `${searchResult.slaMs ?? '���� �̺���'} / ${searchResult.observedClientMs}`
      });
    }

    return base;
  }, [generatedAt, itemsState.length, source, isError, isFetching, searchResult]);

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
            return { ...revision, routingGroups: withDisplayOrder };
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
              return { ...group, routings: newRoutings };
            });
            if (groupChanged) {
              itemChanged = true;
              updated = true;
              return { ...revision, routingGroups: groupsWithRoutingUpdate };
            }
          }

          return revision;
        });
        return itemChanged ? { ...item, revisions: nextRevisions } : item;
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
          return itemChanged ? { ...revision, routingGroups: nextGroups } : revision;
        });
        return itemChanged ? { ...item, revisions: nextRevisions } : item;
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
          return itemChanged ? { ...revision, routingGroups: nextGroups } : revision;
        });
        return itemChanged ? { ...item, revisions: nextRevisions } : item;
      });

      if (!updated) {
        message.warning('No matching group to update.');
        return;
      }

      setItemsState(nextItems);
      setSelectedRoutingFromItems(selectedRouting?.id ?? null, nextItems);
      message.success(isDeleted ? 'Group marked as deleted.' : 'Group restored.');
    },
    [itemsState, selectedRouting?.id, setSelectedRoutingFromItems]
  );

  const handleGroupCreateRouting = useCallback(
    (groupId: string) => {
      for (const item of itemsState) {
        for (const revision of item.revisions) {
          const group = revision.routingGroups.find((candidate) => candidate.id === groupId);
          if (group) {
            setWizardContext({ item, revision, group });
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
          return { ...revision, routingGroups: nextGroups };
        });
        return { ...item, revisions: nextRevisions };
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
        label: '���',
        children: selectedRouting ? (
          <div className="flex flex-col gap-2">
            <Paragraph>
              <Text strong>Routing Code:</Text> {selectedRouting.code}
            </Paragraph>
            <Paragraph>
              <Text strong>Status:</Text> {selectedRouting.status}
            </Paragraph>
            <Paragraph>
              <Text strong>CAM Revision:</Text> {selectedRouting.camRevision}
            </Paragraph>
          </div>
        ) : (
          <Empty description="������� �����ϼ���" />
        )
      },
      {
        key: 'history',
        label: '�����丮',
        children: <Empty description="�����丮 �ε� ����" />
      },
      {
        key: 'files',
        label: '����',
        children: selectedRouting ? (
          <ul className="list-disc pl-5">
            {selectedRouting.files.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <Empty description="���� ��� �غ� ��" />
        )
      }
    ],
    [selectedRouting]
  );

  const handleSearch = useCallback(
    (rawValue?: string) => {
      const nextTerm = (rawValue ?? searchTerm).trim();
      if (!nextTerm) {
        message.info('�˻�� �Է��ϼ���.');
        return;
      }

      setSearchTerm(nextTerm);
      setLastSearchError(null);

      searchMutation.mutate(
        { term: nextTerm, pageSize: 25, slaTargetMs: 3500 },
        {
          onSuccess: (result) => {
            setSearchResult(result);
            message.success(`�˻� �Ϸ� (${result.total}��)`, 1.2);
          },
          onError: (err) => {
            const description =
              err instanceof Error ? err.message : '�� �� ���� ����';
            setLastSearchError(description);
            message.error(`�˻� ����: ${description}`);
          }
        }
      );
    },
    [searchTerm, searchMutation]
  );

  const handleSelectSearchRouting = useCallback(
    (routingId: string) => {
      const next = findRoutingById(routingId);
      if (!next) {
        message.warning('Ž�� Ʈ���� ���� ������Դϴ�.');
        return;
      }
      setSelectedRouting(next);
    },
    [findRoutingById]
  );

  const addinBadgeStatus = selectedRouting ? 'queued' : 'idle';
  const addinBadgeMessage = selectedRouting
    ? `${selectedRouting.code} Add-in ó�� ���(Mock)`
    : '������� �����ϸ� Add-in ť ���°� ǥ�õ˴ϴ�.';

  const searchItems: RoutingSearchItem[] = searchResult?.items ?? [];

  return (
    <>
      <div className="flex gap-6">
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
        <div className="flex-1 flex flex-col gap-4">
          <Card title="Explorer Summary" bordered>
            <div className="grid grid-cols-2 gap-3">
              {summaryItems.map((item) => (
                <div key={item.label}>
                  <Text strong>{item.label}:</Text> {item.value}
                </div>
              ))}
            </div>
            {isError && (
              <Alert
                className="mt-4"
                type="error"
                message="Explorer �����͸� �ҷ����� ���߽��ϴ�."
                description={(error as Error | undefined)?.message}
                showIcon
              />
            )}
          </Card>
          <Card bordered>
            {isFetching && !isError ? (
              <div className="flex justify-center py-10">
                <Spin tip="Explorer �����͸� �ε� ��" />
              </div>
            ) : (
              <Tabs defaultActiveKey="summary" items={tabs} />
            )}
          </Card>
          <Card title="Routing Search" bordered>
            <Space direction="vertical" size="middle" className="w-full">
              <Input.Search
                placeholder="Routing �ڵ� / ǰ�� / ������ �˻�"
                value={searchTerm}
                enterButton="�˻�"
                loading={searchMutation.isPending}
                onChange={(event) => setSearchTerm(event.target.value)}
                onSearch={handleSearch}
                allowClear
              />
              {lastSearchError ? (
                <Alert type="error" message={lastSearchError} showIcon />
              ) : null}
              {searchResult ? (
                <div className="w-full">
                  <Paragraph type="secondary" className="mb-2 text-sm">
                    ���� SLA: {searchResult.slaMs ?? '�̺���'} ms / Ŭ���̾�Ʈ ����:
                    {' '}
                    {searchResult.observedClientMs} ms �� �� {searchResult.total}��
                  </Paragraph>
                  <List
                    dataSource={searchItems}
                    bordered
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            key="open"
                            type="link"
                            onClick={() =>
                              handleSelectSearchRouting(item.routingId)
                            }
                          >
                            ����
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={`${item.routingCode} �� ${item.productCode}`}
                          description={`Revision ${item.revisionCode} �� ���� ${item.status}`}
                        />
                        <Text type="secondary">
                          {item.groupName}
                          {item.updatedAt
                            ? ` �� ${new Date(item.updatedAt).toLocaleString()}`
                            : ''}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
              ) : (
                <Paragraph type="secondary" className="mb-0 text-sm">
                  �˻� ����� ���� ǥ�õ˴ϴ�. SLA�� Sprint5.1 �α׿� ���� ��ϵ˴ϴ�.
                </Paragraph>
              )}
            </Space>
          </Card>
          <Card title="Workspace Uploads" bordered>
            <WorkspaceUploadPanel routing={selectedRouting} />
          </Card>
          <Card title="Add-in ����" bordered>
            <div className="flex items-center gap-4">
              <AddinBadge status={addinBadgeStatus} message={addinBadgeMessage} />
              <Text type="secondary">SignalR ���� �� �ǽð� ������Ʈ ����</Text>
            </div>
            <Timeline className="mt-4">
              <Timeline.Item color="blue">
                Mock: Add-in ť ��� (10:00)
              </Timeline.Item>
              <Timeline.Item color="green">Mock: ���� �Ϸ� (10:02)</Timeline.Item>
            </Timeline>
          </Card>
        </div>
      </div>
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
