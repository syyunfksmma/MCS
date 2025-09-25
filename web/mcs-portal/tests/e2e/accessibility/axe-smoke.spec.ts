import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ADMIN_URL = process.env.PLAYWRIGHT_ADMIN_URL ?? "http://localhost:3000/admin";
const LANDING_URL = process.env.PLAYWRIGHT_LANDING_URL ?? "http://localhost:3000/";

const shouldSkip = process.env.PLAYWRIGHT_A11Y === "skip";

test.describe("Accessibility smoke", () => {
  test.skip(shouldSkip, "PLAYWRIGHT_A11Y=skip");

  test("admin dashboard has no critical accessibility violations", async ({ page }) => {
    await page.goto(ADMIN_URL);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const violationsSummary = accessibilityScanResults.violations
      .map(v => `${v.id}: ${v.nodes.length} nodes`)
      .join("\n");
    expect(accessibilityScanResults.violations, violationsSummary).toEqual([]);
  });

  test("landing page has no critical accessibility violations", async ({ page }) => {
    await page.goto(LANDING_URL);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const violationsSummary = accessibilityScanResults.violations
      .map(v => `${v.id}: ${v.nodes.length} nodes`)
      .join("\n");
    expect(accessibilityScanResults.violations, violationsSummary).toEqual([]);
  });
});
