import ExplorerShell from '@/components/explorer/ExplorerShell';
import HydrateClient from '@/components/providers/HydrateClient';
import { fetchExplorerData } from '@/lib/explorer';
import { explorerKeys } from '@/lib/queryKeys';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export const metadata = {
  title: 'MCMS Explorer',
  description: 'CAM Item/Revision/Routing Explorer'
};

export default async function ExplorerPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: explorerKeys.list(),
    queryFn: fetchExplorerData
  });

  const dehydratedState = dehydrate(queryClient);
  const initialData = queryClient.getQueryData(explorerKeys.list());

  return (
    <HydrateClient state={dehydratedState}>
      <ExplorerShell initialData={initialData!} />
    </HydrateClient>
  );
}
