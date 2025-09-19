'use client';

import { Card, Tree, Input, Tag } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useMemo, useState } from 'react';

const initialData: DataNode[] = [
  {
    title: (
      <span>
        Item_A <Tag color="blue">Active</Tag>
      </span>
    ),
    key: 'item_a',
    children: [
      {
        title: 'Rev01',
        key: 'item_a_rev01',
        children: [
          {
            title: (
              <span>
                GT310001 <Tag color="green">승인</Tag>
              </span>
            ),
            key: 'item_a_rev01_gt310001',
            children: [
              { title: 'espritfile.esp', key: 'file_esp' },
              { title: 'ncfile.nc', key: 'file_nc' },
              { title: 'meta.json', key: 'file_meta' }
            ]
          }
        ]
      }
    ]
  }
];

export default function TreePanel() {
  const [search, setSearch] = useState('');

  const treeData = useMemo(() => {
    if (!search.trim()) {
      return initialData;
    }
    const lower = search.toLowerCase();
    // 단순 필터링: 검색어가 있는 노드만 표시 (추후 개선)
    const filterNodes = (nodes: DataNode[]): DataNode[] =>
      nodes
        .map(node => {
          const titleText = typeof node.title === 'string' ? node.title : '';
          const match = titleText.toLowerCase().includes(lower) || String(node.key).includes(lower);
          if (!node.children) {
            return match ? node : null;
          }
          const children = filterNodes(node.children);
          if (match || children.length) {
            return { ...node, children };
          }
          return null;
        })
        .filter(Boolean) as DataNode[];

    return filterNodes(initialData);
  }, [search]);

  return (
    <Card style={{ width: 320 }} title="품목 트리" bordered>
      <Input.Search
        placeholder="품목/라우팅 검색"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <Tree showLine treeData={treeData} defaultExpandAll />
    </Card>
  );
}
