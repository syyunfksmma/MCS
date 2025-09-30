import ExplorerShell from '@/components/explorer/ExplorerShell';
import HydrateClient from '@/components/providers/HydrateClient';
import { fetchExplorerData } from '@/lib/explorer';
import { explorerKeys } from '@/lib/queryKeys';
import { dehydrate } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/queryClientFactory';
import type { ExplorerResponse } from '@/types/explorer';

export const metadata = {
  title: 'MCMS Explorer',
  description: 'CAM Item/Revision/Routing Explorer'
};

export default async function ExplorerPage() {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery({
    queryKey: explorerKeys.list(),
    queryFn: fetchExplorerData
  });

  const dehydratedState = dehydrate(queryClient);
  const initialData = queryClient.getQueryData<ExplorerResponse>(
    explorerKeys.list()
  );

  if (!initialData) {
    throw new Error('Failed to load explorer data');
  }

  return (
    <HydrateClient state={dehydratedState}>
      <ExplorerShell initialData={initialData} />
    </HydrateClient>
  );
}
