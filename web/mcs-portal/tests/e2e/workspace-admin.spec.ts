import { test, expect } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3100";

const annotate = (name: string, description: string) => {
  test.info().annotations.push({ type: name, description });
};

test.describe("Workspace & Admin smoke flows", () => {
  const shouldRun = !!process.env.E2E_BASE_URL;

  test.beforeAll(() => {
    if (!shouldRun) {
      test.skip(true, "E2E_BASE_URL not configured");
    }
  });

  test.beforeEach(async ({ page }) => {
    annotate("environment", `baseUrl=${baseUrl}`);
    if (!shouldRun) {
      return;
    }
    await page.goto(baseUrl);
  });

  test("@smoke workspace upload placeholder", async ({ page }) => {
    await test.step("Explorer 진입", async () => {
      await expect(page).toHaveTitle(/MCMS Explorer/i);
    });
    await test.step("Workspace 패널 가시성 확인", async () => {
      const workspaceHeading = page.getByRole("heading", { name: /Workspace Uploads/i });
      await expect(workspaceHeading).toBeVisible();
    });
  });

  test("@smoke admin feature flag placeholder", async ({ page }) => {
    await test.step("Admin 메뉴 전환", async () => {
      const adminLink = page.getByRole("link", { name: /Admin/i });
      await adminLink.click();
      await expect(page).toHaveURL(/admin/);
    });
    await test.step("Feature flag 토글 UI 확인", async () => {
      const flagTable = page.getByRole("table", { name: /Feature Flags/i });
      await expect(flagTable).toBeVisible();
    });
  });
});

