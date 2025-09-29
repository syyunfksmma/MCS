import { fetchExplorerData } from "@/lib/explorer";
import type { ExplorerItem } from "@/types/explorer";

export async function getExplorerItemByCode(itemCode: string): Promise<ExplorerItem | null> {
  const data = await fetchExplorerData();
  const normalizedCode = itemCode.toLowerCase();
  return (
    data.items.find((item) => item.code.toLowerCase() === normalizedCode) ?? null
  );
}

export async function getRoutingSummary(itemCode: string) {
  const item = await getExplorerItemByCode(itemCode);
  if (!item) {
    return null;
  }
  const revisions = item.revisions.map((revision) => ({
    revisionId: revision.id,
    revisionCode: revision.code,
    routingGroups: revision.routingGroups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      routingCount: group.routings.length
    }))
  }));

  const routingCount = revisions.reduce((acc, rev) => {
    return (
      acc +
      rev.routingGroups.reduce((sum, group) => sum + group.routingCount, 0)
    );
  }, 0);

  return {
    item,
    revisions,
    routingCount
  };
}
