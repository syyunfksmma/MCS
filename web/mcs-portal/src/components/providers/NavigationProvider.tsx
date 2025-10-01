'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';

type Role = string;

export type GlobalTabKey = 'dashboard' | 'explorer' | 'server' | 'option';

export interface NavigationTab {
  key: GlobalTabKey;
  label: string;
  href: string;
}

interface NavigationContextValue {
  activeTab: GlobalTabKey;
  tabs: NavigationTab[];
  navigateToTab: (tab: GlobalTabKey) => void;
  lastRoutingId: string | null;
  setLastRoutingId: (id: string | null) => void;
}

const TAB_CONFIG: Array<NavigationTab & { roles: Role[] }> = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', roles: ['admin', 'engineer', 'reviewer', 'planner', 'qa', 'local-dev'] },
  { key: 'explorer', label: 'MCS', href: '/explorer', roles: ['admin', 'engineer', 'planner', 'local-dev'] },
  { key: 'server', label: 'Server', href: '/server', roles: ['admin', 'reviewer', 'ops', 'local-dev'] },
  { key: 'option', label: 'Option', href: '/option', roles: ['admin', 'local-dev'] }
];

const TAB_ROUTE_MAP: Record<GlobalTabKey, string> = {
  dashboard: '/dashboard',
  explorer: '/explorer',
  server: '/server',
  option: '/option'
};

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

function normaliseRoles(roles: Role[]): Role[] {
  return roles.map((role) => role.toLowerCase());
}

function resolveTabFromPath(pathname: string | null): GlobalTabKey | null {
  if (!pathname) {
    return null;
  }

  if (pathname === '/') {
    return 'dashboard';
  }

  if (pathname.startsWith('/dashboard')) {
    return 'dashboard';
  }

  if (pathname.startsWith('/explorer')) {
    return 'explorer';
  }

  if (pathname.startsWith('/server')) {
    return 'server';
  }

  if (pathname.startsWith('/option')) {
    return 'option';
  }

  return null;
}

function filterTabsByRole(roles: Role[]): NavigationTab[] {
  const normalised = normaliseRoles(roles);
  const allowAll = normalised.includes('local-dev');
  const available = TAB_CONFIG.filter((tab) =>
    allowAll || tab.roles.some((role) => normalised.includes(role))
  );

  if (available.length > 0) {
    return available.map(({ key, label, href }) => ({ key, label, href }));
  }

  // Fallback: ensure at least Dashboard is present.
  const dashboard = TAB_CONFIG.find((tab) => tab.key === 'dashboard');
  return dashboard ? [{ key: dashboard.key, label: dashboard.label, href: dashboard.href }] : [];
}

export default function NavigationProvider({ children }: { children: ReactNode }) {
  const { roles } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = useMemo(() => filterTabsByRole(roles), [roles]);

  const [activeTab, setActiveTab] = useState<GlobalTabKey>(() => {
    const resolved = resolveTabFromPath(pathname);
    if (resolved && tabs.some((tab) => tab.key === resolved)) {
      return resolved;
    }
    return tabs[0]?.key ?? 'dashboard';
  });
  const [lastRoutingId, setLastRoutingIdState] = useState<string | null>(null);

  useEffect(() => {
    const resolved = resolveTabFromPath(pathname);
    if (resolved && tabs.some((tab) => tab.key === resolved)) {
      if (resolved !== activeTab) {
        setActiveTab(resolved);
      }
      return;
    }

    if (tabs.length === 0) {
      return;
    }

    const fallback = tabs[0];
    if (activeTab !== fallback.key) {
      setActiveTab(fallback.key);
    }

    const target = TAB_ROUTE_MAP[fallback.key];
    if (pathname && !pathname.startsWith(target)) {
      router.replace(target);
    }
  }, [pathname, tabs, router, activeTab]);

  const navigateToTab = useCallback(
    (tab: GlobalTabKey) => {
      const target = tabs.find((candidate) => candidate.key === tab);
      if (!target) {
        return;
      }

      setActiveTab(tab);
      const href = TAB_ROUTE_MAP[tab];
      if (href && pathname !== href) {
        router.push(href);
      }
    },
    [pathname, router, tabs]
  );

  const setLastRoutingId = useCallback((id: string | null) => {
    setLastRoutingIdState(id);
  }, []);

  const value = useMemo(
    () => ({
      activeTab,
      tabs,
      navigateToTab,
      lastRoutingId,
      setLastRoutingId
    }),
    [activeTab, tabs, navigateToTab, lastRoutingId, setLastRoutingId]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationContext(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('NavigationContext is unavailable outside of NavigationProvider.');
  }
  return context;
}

export { NavigationContext };
