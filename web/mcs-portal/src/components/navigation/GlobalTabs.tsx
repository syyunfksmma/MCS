'use client';

import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

const menuItems: MenuProps['items'] = [
  { key: '/dashboard', label: <Link href="/dashboard">Dashboard</Link> },
  { key: '/explorer', label: <Link href="/explorer">MCS</Link> },
  { key: '/server', label: <Link href="/server">Server</Link> },
  { key: '/option', label: <Link href="/option">Option</Link> }
];

export default function GlobalTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey = useMemo(() => {
    if (!pathname) {
      return '/dashboard';
    }

    const match = menuItems?.find((item) => pathname.startsWith(String(item?.key)));
    return (match?.key as string) ?? '/dashboard';
  }, [pathname]);

  const handleClick: MenuProps['onClick'] = (event) => {
    if (event.key && event.key !== selectedKey) {
      router.push(String(event.key));
    }
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onClick={handleClick}
      items={menuItems}
      style={{ borderBottom: '1px solid #eaeaea' }}
    />
  );
}
