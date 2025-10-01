'use client';

import { Button, Card, Input, Space, Tooltip, Tree, Tag } from 'antd';
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useCallback, useEffect, useMemo, useState, useId } from 'react';
import {
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  HolderOutlined
} from '@ant-design/icons';
import { ExplorerItem } from '@/types/explorer';
import styles from './TreePanel.module.css';

type ExplorerNodeType = 'item' | 'revision' | 'group' | 'routing' | 'file';

type ExplorerTreeNode = DataNode & {
  key: string;
  children?: ExplorerTreeNode[];
  parentKey?: string;
  nodeType: ExplorerNodeType;
  searchLabel: string;
};

export type TreePanelReorderPayload = {
  entityType: ExplorerTreeNode['nodeType'];
  dragKey: string;
  dropKey: string;
  position: 'before' | 'after';
};

interface TreePanelProps {
  items: ExplorerItem[];
  selectedKey?: string | null;
  onSelect?: (routingId: string | null) => void;
  onReorder?: (payload: TreePanelReorderPayload) => void;
  onGroupRename?: (groupId: string, nextName: string) => void;
  onGroupSoftDelete?: (groupId: string, isDeleted: boolean) => void;
  onGroupCreateRouting?: (groupId: string) => void;
  onRoutingHover?: (payload: {
    routing: ExplorerItem['revisions'][number]['routingGroups'][number]['routings'][number];
    event: ReactMouseEvent<HTMLSpanElement>;
  }) => void;
  onRoutingLeave?: () => void;
}

const ROUTING_STATUS_COLOR: Record<string, string> = {
  Approved: '#10b981',
  PendingApproval: '#f59e0b',
  Rejected: '#ef4444',
  Draft: '#94a3b8'
};

const DEFAULT_STATUS_COLOR = '#94a3b8';

const cloneNode = (node: ExplorerTreeNode): ExplorerTreeNode => ({
  ...node,
  children: (node.children as ExplorerTreeNode[] | undefined)?.map((child) =>
    cloneNode(child)
  )
});

interface NodeRef {
  node: ExplorerTreeNode;
  parent: ExplorerTreeNode | null;
  siblings: ExplorerTreeNode[];
  index: number;
}

const findNode = (nodes: ExplorerTreeNode[], key: string): NodeRef | null => {
  const stack: {
    parent: ExplorerTreeNode | null;
    siblings: ExplorerTreeNode[];
  }[] = [{ parent: null, siblings: nodes }];

  while (stack.length) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    const { parent, siblings } = current;
    for (let index = 0; index < siblings.length; index += 1) {
      const node = siblings[index];
      if (node.key === key) {
        return { node, parent, siblings, index };
      }
      if (node.children && node.children.length) {
        stack.push({
          parent: node,
          siblings: node.children as ExplorerTreeNode[]
        });
      }
    }
  }

  return null;
};

const collectExpandableKeys = (nodes: ExplorerTreeNode[]): string[] => {
  const keys: string[] = [];

  const traverse = (list: ExplorerTreeNode[]) => {
    list.forEach((node) => {
      if (node.children && node.children.length) {
        keys.push(node.key);
        traverse(node.children as ExplorerTreeNode[]);
      }
    });
  };

  traverse(nodes);
  return keys;
};

const findAncestorKeys = (
  nodes: ExplorerTreeNode[],
  key: string,
  ancestors: string[] = []
): string[] => {
  for (const node of nodes) {
    if (node.key === key) {
      return ancestors;
    }

    if (node.children && node.children.length) {
      const result = findAncestorKeys(
        node.children as ExplorerTreeNode[],
        key,
        [...ancestors, node.key]
      );

      if (result.length) {
        return result;
      }
    }
  }

  return [];
};

export default function TreePanel({
  items,
  selectedKey,
  onSelect,
  onReorder,
  onGroupRename,
  onGroupSoftDelete,
  onGroupCreateRouting,
  onRoutingHover,
  onRoutingLeave
}: TreePanelProps) {
  const [search, setSearch] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupDraftName, setGroupDraftName] = useState('');
  const [treeData, setTreeData] = useState<ExplorerTreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const instructionsId = useId();

  const stopEditing = useCallback(() => {
    setEditingGroupId(null);
    setGroupDraftName('');
  }, []);

  const allExpandableKeys = useMemo(
    () => collectExpandableKeys(treeData),
    [treeData]
  );

  const expandAll = useCallback(() => {
    setExpandedKeys(allExpandableKeys);
    setAutoExpandParent(false);
  }, [allExpandableKeys]);

  const collapseAll = useCallback(() => {
    setExpandedKeys([]);
    setAutoExpandParent(false);
  }, []);

  const commitEditing = useCallback(
    (groupId: string) => {
      const trimmed = groupDraftName.trim();
      if (!trimmed) {
        stopEditing();
        return;
      }
      if (onGroupRename) {
        onGroupRename(groupId, trimmed);
      }
      stopEditing();
    },
    [groupDraftName, onGroupRename, stopEditing]
  );

  const buildTreeNodes = useCallback(
    (source: ExplorerItem[]): ExplorerTreeNode[] => {
      const buildFileNode = (
        file: ExplorerItem['revisions'][number]['routingGroups'][number]['routings'][number]['files'][number],
        parentKey: string
      ): ExplorerTreeNode => ({
        title: file.name,
        key: file.id,
        parentKey,
        nodeType: 'file',
        searchLabel: file.name.toLowerCase()
      });

      const buildRoutingNode = (
        routing: ExplorerItem['revisions'][number]['routingGroups'][number]['routings'][number],
        parentKey: string
      ): ExplorerTreeNode => ({
        title: (
          <span
            className={styles.routingTitle}
            onMouseEnter={(event) => onRoutingHover?.({ routing, event })}
            onMouseLeave={() => onRoutingLeave?.()}
          >
            <span
              className={styles.statusDot}
              style={{
                backgroundColor:
                  ROUTING_STATUS_COLOR[routing.status] ?? DEFAULT_STATUS_COLOR
              }}
              aria-hidden
            />
            <span>{routing.code}</span>
            <span className={styles.routingStatus}>{routing.status}</span>
          </span>
        ),
        key: routing.id,
        parentKey,
        nodeType: 'routing',
        searchLabel:
          `${routing.code} ${routing.status} ${routing.camRevision}`.toLowerCase(),
        children: routing.files.map((file) => buildFileNode(file, routing.id))
      });

      const buildGroupNode = (
        group: ExplorerItem['revisions'][number]['routingGroups'][number],
        parentKey: string
      ): ExplorerTreeNode => {
        const isEditing = editingGroupId === group.id;
        const isDeleted = Boolean(group.isDeleted);
        const title = isEditing ? (
          <div
            className="flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <Input
              size="small"
              autoFocus
              value={groupDraftName}
              onChange={(event) => setGroupDraftName(event.target.value)}
              onPressEnter={() => commitEditing(group.id)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  stopEditing();
                }
              }}
              onBlur={() => commitEditing(group.id)}
              style={{ minWidth: 120 }}
            />
            <Space size={4}>
              <Button
                size="small"
                type="text"
                icon={<CheckOutlined />}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  commitEditing(group.id);
                }}
              />
              <Button
                size="small"
                type="text"
                icon={<CloseOutlined />}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  stopEditing();
                }}
              />
            </Space>
          </div>
        ) : (
          <div
            className="flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <span
              style={
                isDeleted
                  ? { textDecoration: 'line-through', color: '#94a3b8' }
                  : undefined
              }
            >
              {group.name}
            </span>
            {isDeleted ? <Tag color="volcano">Deleted</Tag> : null}
            <span className="ml-auto flex items-center gap-1">
              <Tooltip title="New routing">
                <Button
                  size="small"
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={(event) => {
                    event.stopPropagation();
                    onGroupCreateRouting?.(group.id);
                  }}
                />
              </Tooltip>
              <Tooltip title="Rename group">
                <Button
                  size="small"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(event) => {
                    event.stopPropagation();
                    setEditingGroupId(group.id);
                    setGroupDraftName(group.name);
                  }}
                />
              </Tooltip>
              <Tooltip
                title={isDeleted ? 'Restore group' : 'Mark group deleted'}
              >
                <Button
                  size="small"
                  type="text"
                  icon={isDeleted ? <RollbackOutlined /> : <DeleteOutlined />}
                  onClick={(event) => {
                    event.stopPropagation();
                    onGroupSoftDelete?.(group.id, !isDeleted);
                  }}
                />
              </Tooltip>
            </span>
          </div>
        );

        return {
          title,
          key: group.id,
          parentKey,
          nodeType: 'group',
          searchLabel: group.name.toLowerCase(),
          children: group.routings.map((routing) =>
            buildRoutingNode(routing, group.id)
          )
        };
      };

      const buildRevisionNode = (
        revision: ExplorerItem['revisions'][number],
        parentKey: string
      ): ExplorerTreeNode => ({
        title: revision.code,
        key: revision.id,
        parentKey,
        nodeType: 'revision',
        searchLabel: revision.code.toLowerCase(),
        children: [...revision.routingGroups]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((group) => buildGroupNode(group, revision.id))
      });

      return source.map((item) => ({
        title: (
          <span>
            {item.code} <Tag color="blue">{item.name}</Tag>
          </span>
        ),
        key: item.id,
        nodeType: 'item',
        searchLabel: `${item.code} ${item.name}`.toLowerCase(),
        children: item.revisions.map((revision) =>
          buildRevisionNode(revision, item.id)
        )
      }));
    },
    [
      editingGroupId,
      groupDraftName,
      onGroupSoftDelete,
      onGroupCreateRouting,
      onRoutingHover,
      onRoutingLeave,
      commitEditing,
      stopEditing
    ]
  );

  useEffect(() => {
    setTreeData(buildTreeNodes(items));
    if (editingGroupId) {
      const exists = items
        .flatMap((item) => item.revisions)
        .flatMap((revision) => revision.routingGroups)
        .some((group) => group.id === editingGroupId);
      if (!exists) {
        stopEditing();
      }
    }
  }, [items, buildTreeNodes, editingGroupId, stopEditing]);

  useEffect(() => {
    setExpandedKeys(allExpandableKeys);
    setAutoExpandParent(true);
  }, [allExpandableKeys]);

  useEffect(() => {
    if (!search.trim()) {
      return;
    }
    setExpandedKeys(allExpandableKeys);
    setAutoExpandParent(true);
  }, [search, allExpandableKeys]);

  useEffect(() => {
    if (!selectedKey) {
      return;
    }
    const ancestors = findAncestorKeys(treeData, selectedKey);
    if (ancestors.length) {
      setExpandedKeys((previous) => {
        const merged = new Set(previous);
        ancestors.forEach((key) => merged.add(key));
        return Array.from(merged);
      });
      setAutoExpandParent(true);
    }
  }, [selectedKey, treeData]);

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return treeData;
    }
    const lower = search.toLowerCase();

    const filterNodes = (nodes: ExplorerTreeNode[]): ExplorerTreeNode[] => {
      const result: ExplorerTreeNode[] = [];
      nodes.forEach((node) => {
        const children = node.children
          ? filterNodes(node.children as ExplorerTreeNode[])
          : undefined;
        const matches = node.searchLabel.includes(lower);
        if (matches || (children && children.length)) {
          result.push({ ...node, children });
        }
      });
      return result;
    };

    return filterNodes(treeData);
  }, [treeData, search]);

  const handleDrop: TreeProps['onDrop'] = (info) => {
    if (!info.dropToGap) {
      return;
    }

    const dragKey = String(info.dragNode.key);
    const dropKey = String(info.node.key);
    const cloned = treeData.map((node) => cloneNode(node));

    const dragRef = findNode(cloned, dragKey);
    const dropRef = findNode(cloned, dropKey);

    if (!dragRef || !dropRef) {
      return;
    }

    if (
      (dragRef.parent?.key ?? null) !== (dropRef.parent?.key ?? null) ||
      dragRef.node.nodeType !== dropRef.node.nodeType
    ) {
      setTreeData(cloned);
      return;
    }

    const sameList = dragRef.siblings === dropRef.siblings;
    let dropIndex = dropRef.index;
    if (sameList && dragRef.index < dropRef.index) {
      dropIndex -= 1;
    }

    dragRef.siblings.splice(dragRef.index, 1);

    const positionMeta = info.node.pos?.split('-');
    const relativePosition = positionMeta
      ? info.dropPosition - Number(positionMeta[positionMeta.length - 1])
      : 0;

    const insertIndex = relativePosition <= 0 ? dropIndex : dropIndex + 1;

    dropRef.siblings.splice(insertIndex, 0, dragRef.node);

    setTreeData(cloned);
    onReorder?.({
      entityType: dragRef.node.nodeType,
      dragKey,
      dropKey,
      position: relativePosition <= 0 ? 'before' : 'after'
    });
  };

  return (
    <Card
      className={styles.card}
      title="Explorer Tree"
      bordered
      extra={
        <Space size={4} className={styles.toolbar}>
          <Tooltip title="Expand all nodes">
            <Button
              size="small"
              type="text"
              icon={<PlusSquareOutlined />}
              onClick={expandAll}
              aria-label="전체 노드 펼치기"
              className={styles.toolbarButton}
            />
          </Tooltip>
          <Tooltip title="Collapse all nodes">
            <Button
              size="small"
              type="text"
              icon={<MinusSquareOutlined />}
              onClick={collapseAll}
              aria-label="전체 노드 접기"
              className={styles.toolbarButton}
            />
          </Tooltip>
        </Space>
      }
    >
      <Input.Search
        placeholder="Search Item / Revision / Group / Routing"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        allowClear
        aria-label="Explorer 트리 검색"
        className={styles.search}
      />
      <p id={instructionsId} className={styles.assistive}>
        방향키로 노드를 이동하고 Enter 키로 세부 정보를 확인할 수 있습니다.
      </p>
      <div className={styles.treeContainer}>
        <Tree
          showLine
          virtual
          height={520}
          blockNode
          draggable={{
            icon: <HolderOutlined className={styles.dragIcon} />,
            nodeDraggable: (node) => {
              const typed = node as ExplorerTreeNode;
              return typed.nodeType === 'group' || typed.nodeType === 'routing';
            }
          }}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={filteredData}
          selectedKeys={selectedKey ? [selectedKey] : []}
          onExpand={(keys) => {
            setExpandedKeys(keys as string[]);
            setAutoExpandParent(false);
          }}
          onDrop={handleDrop}
          onSelect={(_, info) => {
            if (!onSelect) return;
            const key = info.node.key as string;
            const found = items
              .flatMap((item) => item.revisions)
              .flatMap((revision) => revision.routingGroups)
              .flatMap((group) => group.routings)
              .find((routing) => routing.id === key);
            if (found) {
              onSelect(key);
            } else if (!info.node.children || info.node.children.length === 0) {
              onSelect(null);
            }
          }}
          aria-label="Explorer routing tree"
          aria-describedby={instructionsId}
        />
      </div>
    </Card>
  );
}

