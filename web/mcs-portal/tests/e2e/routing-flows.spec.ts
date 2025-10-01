import { test, expect } from "@playwright/test";

const baseUrl = process.env.MCMS_E2E_BASE_URL ?? "http://localhost:3000";

// NOTE: These flows assume seeded mock data (scripts/testing/seed-test-data.mjs).
// They are tagged smoke so CI can schedule them independently.

test.describe.parallel("Routing E2E smoke", () => {
  test("@smoke product creation wizard to approval queue", async ({ page }) => {
    test.skip(process.env.CI !== "true", "Requires seeded Playwright Docker compose env");

    await page.goto(`${baseUrl}/products`);
    await page.getByRole("button", { name: /create product/i }).click();
    await page.getByLabel(/item code/i).fill("ITEM-E2E-001");
    await page.getByLabel(/revision/i).fill("REV-A");
    await page.getByRole("button", { name: /next/i }).click();
    await page.getByRole("button", { name: /submit for approval/i }).click();

    await expect(page.getByText(/approval request submitted/i)).toBeVisible();
    await page.goto(`${baseUrl}/workflow/approvals`);
    await expect(page.getByRole("row", { name: /ITEM-E2E-001/i })).toBeVisible();
  });

  test("@smoke routing upload legacy download + search filters", async ({ page }) => {
    test.skip(process.env.CI !== "true", "Requires seeded Playwright Docker compose env");

    await page.goto(`${baseUrl}/explorer`);
    await page.getByPlaceholder("Search item or routing").fill("ITEM-100");
    await page.getByPlaceholder("Search item or routing").press("Enter");
    await expect(page.getByRole("button", { name: /열기/i })).toBeVisible();
    await page.getByRole("button", { name: /열기/i }).click();

    await page.getByRole("tab", { name: /files/i }).click();
    await expect(page.getByText(/program\.esp/i)).toBeVisible();

    await page.getByRole("button", { name: /legacy download/i }).click();
    await expect(page.getByText(/download triggered/i)).toBeVisible();

    await page.getByRole("button", { name: /filter status/i }).click();
    await page.getByRole("menuitemcheckbox", { name: /pending/i }).check();
    await expect(page.getByRole("listitem", { name: /PendingApproval/i })).toBeVisible();
  });
});

