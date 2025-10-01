import { getApiBaseUrl } from '@/lib/env';
import type { UserPermissions } from '@/types/userPermissions';

function normalizeBaseUrl(base: string): string {
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export async function fetchUserPermissions(): Promise<UserPermissions> {
  const base = getApiBaseUrl();
  if (!base) {
    return {
      canOpenExplorer: true,
      canReplaceSolidWorks: true,
      canManageRoutingVersions: true
    };
  }

  const baseUrl = normalizeBaseUrl(base);
  const response = await fetch(`${baseUrl}/api/users/me/permissions`, {
    credentials: 'include',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to load user permissions (${response.status}).`);
  }

  return response.json() as Promise<UserPermissions>;
}
