import { notFound } from 'next/navigation';
import ProductRevisionWorkspace from '@/components/products/ProductRevisionWorkspace';
import { fetchExplorerData } from '@/lib/explorer';
import type { ExplorerResponse } from '@/types/explorer';

interface PageParams {
  productCode: string;
}

interface ProductWorkspacePageProps {
  params: PageParams;
  searchParams: Record<string, string | string[] | undefined>;
}

export const metadata = {
  title: 'Product Revision Workspace',
  description: 'Inspect routing revisions and files'
};

export default async function ProductWorkspacePage({
  params,
  searchParams
}: ProductWorkspacePageProps) {
  const data: ExplorerResponse = await fetchExplorerData();
  const product = data.items.find(
    (item) => item.code.toLowerCase() === params.productCode.toLowerCase()
  );

  if (!product) {
    notFound();
  }

  return (
    <ProductRevisionWorkspace
      product={product}
      generatedAt={data.generatedAt}
      source={data.source}
      searchParams={searchParams}
    />
  );
}
