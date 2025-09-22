'use client';

import { Card, Input, Tag, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useMemo, useState } from 'react';
import { ExplorerItem } from '@/types/explorer';

interface TreePanelProps {
  items: ExplorerItem[];
  onSelect?: (routingId: string | null) => void;
}

function buildTreeNodes(items: ExplorerItem[]): DataNode[] {
  return items.map(item => ({
    title: (
      <span>
        {item.code} <Tag color="blue">{item.name}</Tag>
      </span>
    ),
    key: item.id,
    children: item.revisions.map(rev => ({
      title: rev.code,
      key: rev.id,
      children: rev.routings.map(routing => ({
        title: (
          <span>
            {routing.code}{' '}
            <Tag color={routing.status === 'Approved' ? 'green' : routing.status === 'PendingApproval' ? 'gold' : 'default'}>
              {routing.status}
            </Tag>
          </span>
        ),
        key: routing.id,
        children: routing.files.map(file => ({
          title: file.name,
          key: file.id
        }))
      }))
    }))
  }));
}

export default function TreePanel({ items, onSelect }: TreePanelProps) {
  const [search, setSearch] = useState('');
  const initialData = useMemo(() => buildTreeNodes(items), [items]);

  const treeData = useMemo(() => {
    if (!search.trim()) {
      return initialData;
    }
    const lower = search.toLowerCase();
    const filterNodes = (nodes: DataNode[]): DataNode[] =>
      nodes
        .map(node => {
          const titleText = typeof node.title === 'string' ? node.title : '';
          const match = titleText.toLowerCase().includes(lower) || String(node.key).includes(lower);
          const children = node.children ? filterNodes(node.children) : [];
          if (match || children.length) {
            return { ...node, children };
          }
          return null;
        })
        .filter(Boolean) as DataNode[];

    return filterNodes(initialData);
  }, [initialData, search]);

  return (
    <Card style={{ width: 320, maxHeight: 640, overflow: "hidden" }} title="Explorer" bordered>
      <Input.Search
        placeholder="Item/Revision/Routing 검색"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
        allowClear
      />
      <Tree
        showLine
        virtual
        height={520}
        defaultExpandAll
        treeData={treeData}
        onSelect={(_, info) => {
          if (!onSelect) return;
          const key = info.node.key as string;
          const found = items
            .flatMap(item => item.revisions)
            .flatMap(rev => rev.routings)
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
