'use client';

import { Card, Input, Tag, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useEffect, useMemo, useState } from 'react';
import { ExplorerItem } from '@/types/explorer';

type ExplorerNodeType = 'item' | 'revision' | 'routing' | 'file';

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
  onSelect?: (routingId: string | null) => void;
  onReorder?: (payload: TreePanelReorderPayload) => void;
  selectedKey?: string | null;
}

const ROUTING_STATUS_COLOR: Record<string, string> = {
  Approved: 'green',
  PendingApproval: 'gold',
  Rejected: 'red',
  Draft: 'default'
};

const buildTreeNodes = (items: ExplorerItem[]): ExplorerTreeNode[] => {
  const buildFileNode = (
    file: ExplorerItem['revisions'][number]['routings'][number]['files'][number],
    parentKey: string
  ): ExplorerTreeNode => ({
    title: file.name,
    key: file.id,
    parentKey,
    nodeType: 'file',
    searchLabel: file.name.toLowerCase()
  });

  const buildRoutingNode = (
    routing: ExplorerItem['revisions'][number]['routings'][number],
    parentKey: string
  ): ExplorerTreeNode => ({
    title: (
      <span>
        {routing.code}{' '}
        <Tag color={ROUTING_STATUS_COLOR[routing.status] ?? 'default'}>{routing.status}</Tag>
      </span>
    ),
    key: routing.id,
    parentKey,
    nodeType: 'routing',
    searchLabel: `${routing.code} ${routing.status} ${routing.camRevision}`.toLowerCase(),
    children: routing.files.map(file => buildFileNode(file, routing.id))
  });

  const buildRevisionNode = (
    revision: ExplorerItem['revisions'][number],
    parentKey: string
  ): ExplorerTreeNode => ({
    title: revision.code,
    key: revision.id,
    parentKey,
    nodeType: 'revision',
    searchLabel: revision.code.toLowerCase(),
    children: revision.routings.map(routing => buildRoutingNode(routing, revision.id))
  });

  return items.map(item => ({
    title: (
      <span>
        {item.code} <Tag color="blue">{item.name}</Tag>
      </span>
    ),
    key: item.id,
    nodeType: 'item',
    searchLabel: `${item.code} ${item.name}`.toLowerCase(),
    children: item.revisions.map(revision => buildRevisionNode(revision, item.id))
  }));
};

const cloneNode = (node: ExplorerTreeNode): ExplorerTreeNode => ({
  ...node,
  children: (node.children as ExplorerTreeNode[] | undefined)?.map(child => cloneNode(child))
});

interface NodeRef {
  node: ExplorerTreeNode;
  parent: ExplorerTreeNode | null;
  siblings: ExplorerTreeNode[];
  index: number;
}

const findNode = (nodes: ExplorerTreeNode[], key: string): NodeRef | null => {
  const stack: { parent: ExplorerTreeNode | null; siblings: ExplorerTreeNode[] }[] = [
    { parent: null, siblings: nodes }
  ];

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
        stack.push({ parent: node, siblings: node.children });
      }
    }
  }

  return null;
};

export default function TreePanel({ items, onSelect, onReorder, selectedKey }: TreePanelProps) {
  const [search, setSearch] = useState('');
  const [treeData, setTreeData] = useState<ExplorerTreeNode[]>(() => buildTreeNodes(items));

  useEffect(() => {
    setTreeData(buildTreeNodes(items));
  }, [items]);

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return treeData;
    }
    const lower = search.toLowerCase();

    const filterNodes = (nodes: ExplorerTreeNode[]): ExplorerTreeNode[] => {
      const result: ExplorerTreeNode[] = [];
      nodes.forEach(node => {
        const children = node.children ? filterNodes(node.children as ExplorerTreeNode[]) : undefined;
        const matches = node.searchLabel.includes(lower);
        if (matches || (children && children.length)) {
          result.push({ ...node, children });
        }
      });
      return result;
    };

    return filterNodes(treeData);
  }, [treeData, search]);

  const handleDrop: TreeProps['onDrop'] = info => {
    if (!info.dropToGap) {
      return;
    }

    const dragKey = String(info.dragNode.key);
    const dropKey = String(info.node.key);
    const cloned = treeData.map(node => cloneNode(node));

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
    <Card style={{ width: 320, maxHeight: 640, overflow: 'hidden' }} title="Explorer" bordered>
      <Input.Search
        placeholder="Search Item / Revision / Routing"
        value={search}
        onChange={event => setSearch(event.target.value)}
        style={{ marginBottom: 12 }}
        allowClear
      />
      <Tree
        showLine
        virtual
        height={520}
        blockNode
        draggable
        defaultExpandAll
        treeData={filteredData}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onDrop={handleDrop}
        onSelect={(_, info) => {
          if (!onSelect) return;
          const key = info.node.key as string;
          const found = items
            .flatMap(item => item.revisions)
            .flatMap(revision => revision.routings)
            .find(routing => routing.id === key);
          if (found) {
            onSelect(key);
          } else if (!info.node.children || info.node.children.length === 0) {
            onSelect(null);
          }
        }}
      />
    </Card>
  );
}



