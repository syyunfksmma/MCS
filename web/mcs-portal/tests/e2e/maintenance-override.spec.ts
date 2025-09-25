import { test, expect } from "@playwright/test";

const ADMIN_URL = process.env.PLAYWRIGHT_ADMIN_URL ?? "http://localhost:3000/admin";
const shouldSkip = process.env.PLAYWRIGHT_MAINTENANCE === "skip";

test.describe("Maintenance override", () => {
  test.skip(shouldSkip, "PLAYWRIGHT_MAINTENANCE=skip");

  test("displays gate and allows temporary override", async ({ page }) => {
    await page.goto(`${ADMIN_URL}?maintenance=force`);
    await expect(page.getByRole("heading", { name: "Scheduled maintenance in progress" })).toBeVisible();
    await page.getByRole("button", { name: "Temporary override" }).click();
    await expect(page.getByRole("heading", { name: "Admin Console" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Scheduled maintenance in progress" })).toHaveCount(0);
  });
});
