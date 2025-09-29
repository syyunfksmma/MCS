import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  getApiBaseUrl: () => process.env.NEXT_PUBLIC_API_BASE_URL
}));

import { submitApprovalDecision } from "@/lib/workflow/approval";

describe("submitApprovalDecision", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("returns mocked result when API base URL is absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const result = await submitApprovalDecision("routing-1", {
      approve: true,
      comment: "Looks good"
    });
    expect(result).toEqual({ success: true, mocked: true });
  });

  it("posts to API when base URL provided", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.test");
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    global.fetch = fetchSpy as unknown as typeof global.fetch;

    const result = await submitApprovalDecision("routing-2", {
      approve: false,
      comment: "Needs change"
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.test/api/routings/routing-2/approve",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(result).toEqual({ success: true });
  });
});
