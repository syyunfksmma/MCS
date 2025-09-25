import ProductDashboardShell from "@/components/products/ProductDashboardShell";
import { fetchProductDashboardData } from "@/lib/products";

export const metadata = {
  title: "Product Routing Dashboard",
  description: "Browse MCMS product revisions, routing groups, and SolidWorks linkage status"
};

export default async function ProductsPage() {
  const dashboard = await fetchProductDashboardData();

  return <ProductDashboardShell initialData={dashboard} />;
}
