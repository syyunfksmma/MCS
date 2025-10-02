import { test, expect } from "@playwright/test";
import { cloneWorkspaceSmokeFixture, workspaceSmokeFixture } from "../../fixtures/workspace-smoke";
import type { SmokeFixture } from "../../fixtures/workspace-smoke";

const smokeEnabled = process.env.PLAYWRIGHT_SMOKE === "true";

let sessionState: SmokeFixture;

const jsonResponse = (data: unknown) => ({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify(data)
});

test.describe("@smoke workspace gating", () => {
  test.skip(!smokeEnabled, "PLAYWRIGHT_SMOKE=true 환경에서만 스모크 테스트를 실행합니다.");
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ context }) => {
    sessionState = cloneWorkspaceSmokeFixture();

    await context.route("**/api/explorer", async (route) => {
      await route.fulfill(jsonResponse(sessionState.explorer));
    });

    await context.route(/\/api\/routings\/([^/]+)$/i, async (route) => {
      if (route.request().method() !== "GET") {
        await route.fallback();
        return;
      }

      const url = new URL(route.request().url());
      const segments = url.pathname.split("/");
      const routingId = segments[3];
      const payload = sessionState.routingDetail[routingId];
      if (!payload) {
        await route.fulfill({ status: 404 });
        return;
      }
      await route.fulfill(jsonResponse(payload));
    });

    await context.route(/\/api\/routings\/([^/]+)\/versions$/i, async (route) => {
      if (route.request().method() !== "GET") {
        await route.fallback();
        return;
      }
      const url = new URL(route.request().url());
      const segments = url.pathname.split("/");
      const routingId = segments[3];
      const versions = sessionState.routingVersions[routingId] ?? [];
      await route.fulfill(jsonResponse(versions));
    });

    await context.route(/\/api\/routings\/([^/]+)\/versions\/([^/]+)$/i, async (route) => {
      if (route.request().method() !== "PATCH") {
        await route.fallback();
        return;
      }

      const url = new URL(route.request().url());
      const segments = url.pathname.split("/");
      const routingId = segments[3];
      const versionId = segments[5];
      const versions = sessionState.routingVersions[routingId] ?? [];
      const body = route.request().postDataJSON?.() ?? {};

      const updatedVersions = versions.map((version) => {
        if (version.versionId === versionId) {
          return {
            ...version,
            isPrimary: body.isPrimary ?? true,
            updatedAt: new Date().toISOString()
          };
        }
        if (body.isPrimary && version.isPrimary) {
          return { ...version, isPrimary: false };
        }
        return version;
      });

      sessionState.routingVersions[routingId] = updatedVersions;
      const next = updatedVersions.find((version) => version.versionId === versionId);
      await route.fulfill(jsonResponse(next ?? versions.find((version) => version.versionId === versionId)));
    });

    await context.route(/\/api\/routings\/([^/]+)\/solidworks$/i, async (route) => {
      if (route.request().method() !== "GET") {
        await route.fallback();
        return;
      }
      const url = new URL(route.request().url());
      const routingId = url.pathname.split("/")[3];
      const link = sessionState.solidworks[routingId] ?? null;
      await route.fulfill(jsonResponse(link));
    });

    await context.route(/\/api\/routings\/([^/]+)\/solidworks\/replace$/i, async (route) => {
      if (route.request().method() !== "POST") {
        await route.fallback();
        return;
      }
      const url = new URL(route.request().url());
      const routingId = url.pathname.split("/")[3];
      const existing = sessionState.solidworks[routingId];
      const body = route.request().postDataJSON?.() as Record<string, unknown> | undefined;

      const modelPath = typeof body?.modelPath === "string" && body.modelPath.trim().length
        ? (body.modelPath as string)
        : existing?.modelPath ?? "\\\\plm\\smoke\\GT310001\\assembly.sldasm";

      const configuration = typeof body?.configuration === "string" && body.configuration.trim().length
        ? (body.configuration as string)
        : existing?.configuration ?? "DEFAULT";

      const now = new Date().toISOString();

      const nextLink = {
        ...(existing ?? workspaceSmokeFixture.solidworks[routingId]),
        modelPath,
        configuration,
        updatedAt: now,
        lastSyncedAt: now,
        updatedBy: "cam.jane",
        isLinked: true
      };

      sessionState.solidworks[routingId] = nextLink;
      await route.fulfill(jsonResponse(nextLink));
    });
  });

  test("@smoke Explorer selection → routing promotion → SolidWorks replace", async ({ page }) => {
    await test.step("Explorer 대시보드 접근", async () => {
      await page.goto("/explorer");
      await expect(page.locator("#explorer-summary-card")).toBeVisible();
      await expect(page.getByRole("tree")).toBeVisible();
    });

    await test.step("Smoke Routing 선택", async () => {
      const routingNode = page.locator(".ant-tree-node-content-wrapper").filter({ hasText: "GT310001" }).first();
      await expect(routingNode).toBeVisible();
      await routingNode.click();
    });

    await test.step("Routing 상세 모달 열기", async () => {
      const openButton = page.getByRole("button", { name: "선택한 Routing 열기" });
      await expect(openButton).toBeEnabled();
      await openButton.click();
      await expect(page.getByRole("dialog", { name: /Routing: GT310001/ })).toBeVisible();
    });

    await test.step("Routing Version 승격", async () => {
      await page.getByRole("tab", { name: "Versions" }).click();
      const promoteButton = page.getByRole("button", { name: "Primary로 지정" }).first();
      await expect(promoteButton).toBeVisible();
      await promoteButton.click();
      await expect(page.getByText("Primary version updated.")).toBeVisible();
      const detailModal = page.getByRole("dialog", { name: /Routing: GT310001/ });
      await expect(detailModal).toBeVisible();
      await detailModal.getByRole("button", { name: "Close" }).click();
      await detailModal.waitFor({ state: "hidden" });
    });

    await test.step("SolidWorks 모델 교체", async () => {
      const replaceButton = page.getByRole("button", { name: "모델 교체" });
      await expect(replaceButton).toBeEnabled();
      await replaceButton.click();
      const confirmDialog = page.getByRole("dialog", { name: "SolidWorks 모델 교체" });
      await expect(confirmDialog).toBeVisible();
      await confirmDialog.getByRole("button", { name: "교체" }).click();
      await expect(page.getByText("SolidWorks model updated.")).toBeVisible();
    });
  });
});













