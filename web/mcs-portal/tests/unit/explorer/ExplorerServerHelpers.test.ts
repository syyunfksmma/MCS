import { describe, expect, it } from "vitest";
import { getRoutingSummary } from "@/lib/explorerServer";

describe("getRoutingSummary", () => {
  it("returns mock data for known item", async () => {
    const summary = await getRoutingSummary("Item_A");
    expect(summary).not.toBeNull();
    expect(summary?.item.code).toBe("Item_A");
    expect(summary?.routingCount).toBeGreaterThan(0);
  });

  it("returns null for unknown item", async () => {
    const summary = await getRoutingSummary("UNKNOWN_ITEM");
    expect(summary).toBeNull();
  });
});
