'use client';

import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import type { GlobalTabKey } from '@/components/providers/NavigationProvider';

export default function GlobalTabs() {
  const { tabs, activeTab, navigateToTab } = useNavigation();

  const menuItems = useMemo(() => {
    return tabs.map((tab) => ({ key: tab.key, label: tab.label }));
  }, [tabs]);

  const handleClick: MenuProps['onClick'] = (event) => {
    if (event.key) {
      navigateToTab(event.key as GlobalTabKey);
    }
  };

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[activeTab]}
      onClick={handleClick}
      items={menuItems}
      style={{ borderBottom: '1px solid #eaeaea' }}
    />
  );
}
