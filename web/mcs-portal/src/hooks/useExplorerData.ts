'use client';

import { useQuery } from '@tanstack/react-query';
import { explorerKeys } from '@/lib/queryKeys';
import { ExplorerResponse } from '@/types/explorer';

async function fetchExplorer(): Promise<ExplorerResponse> {
  const res = await fetch('/api/explorer');
  if (!res.ok) throw new Error('Explorer API error');
  return (await res.json()) as ExplorerResponse;
}

export function useExplorerData(initialData?: ExplorerResponse) {
  return useQuery({
    queryKey: explorerKeys.list(),
    queryFn: fetchExplorer,
    initialData,
    staleTime: 30 * 1000
  });
}
