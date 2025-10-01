import { notFound } from "next/navigation";
import { getRoutingSummary } from "@/lib/explorerServer";
import ExplorerItemClient from "./ExplorerItemClient";

interface ExplorerItemPageProps {
  params: {
    itemId: string;
  };
}

export async function generateMetadata({ params }: ExplorerItemPageProps) {
  const summary = await getRoutingSummary(params.itemId);
  if (!summary) {
    return {
      title: `MCMS Explorer | ${params.itemId}`
    };
  }
  return {
    title: `MCMS Explorer | ${summary.item.code}`,
    description: `Routing overview for ${summary.item.name}`
  };
}

export default async function ExplorerItemPage({ params }: ExplorerItemPageProps) {
  const summary = await getRoutingSummary(params.itemId);
  if (!summary) {
    notFound();
  }
  return <ExplorerItemClient summary={summary} />;
}
