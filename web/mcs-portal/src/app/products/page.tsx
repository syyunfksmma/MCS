import ProductDashboardShell from '@/components/products/ProductDashboardShell';
import { fetchProductDashboardData } from '@/lib/products';
import { fetchErpWorkOrders } from '@/lib/erp';

export const metadata = {
  title: 'Product Routing Dashboard',
  description:
    'Browse MCMS product revisions, routing groups, and SolidWorks linkage status'
};

export default async function ProductsPage() {
  const [dashboard, workOrders] = await Promise.all([
    fetchProductDashboardData(),
    fetchErpWorkOrders()
  ]);

  return (
    <ProductDashboardShell
      initialData={dashboard}
      initialWorkOrders={workOrders}
    />
  );
}
