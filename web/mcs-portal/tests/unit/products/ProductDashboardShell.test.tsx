import React from 'react';
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductDashboardShell from "@/components/products/ProductDashboardShell";
import type { ProductDashboardResponse } from "@/types/products";
import { message } from "antd";
import { vi } from "vitest";
import type { SpyInstance } from "vitest";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

describe("ProductDashboardShell", () => {
  const mockWarning = vi.fn();
  const mockSuccess = vi.fn();
  const mockError = vi.fn();
  let clipboardWrite: SpyInstance;
  let useMessageSpy: SpyInstance;

  const renderDashboard = (override?: Partial<ProductDashboardResponse>) => {
    const base: ProductDashboardResponse = {
      source: "api",
      generatedAt: "2025-09-29T01:23:45.000Z",
      total: 2,
      items: [
        {
          id: "p1",
          code: "ITEM-100",
          name: "Turning Assembly",
          latestRevision: "REV02",
          revisionCount: 3,
          routingGroupCount: 2,
          routingCount: 5,
          solidWorksPath: "\\\\MCMS_SHARE\\models\\ITEM-100\\REV02\\assembly.sldasm",
          solidWorksStatus: "present",
          updatedAt: "2025-09-28T05:00:00.000Z",
          owner: "cam.lead"
        },
        {
          id: "p2",
          code: "ITEM-200",
          name: "Milling Fixture",
          revisionCount: 1,
          routingGroupCount: 1,
          routingCount: 1,
          solidWorksStatus: "missing",
          updatedAt: "2025-09-27T03:12:00.000Z"
        }
      ]
    };

    const initialData: ProductDashboardResponse = {
      ...base,
      ...override,
      items: override?.items ?? base.items,
      total: override?.total ?? base.total,
      source: override?.source ?? base.source,
      generatedAt: override?.generatedAt ?? base.generatedAt
    };

    return render(<ProductDashboardShell initialData={initialData} />);
  };

  beforeEach(() => {
    useMessageSpy = vi.spyOn(message, "useMessage").mockReturnValue([
      {
        warning: mockWarning,
        success: mockSuccess,
        error: mockError
      } as unknown as ReturnType<typeof message.useMessage>[0],
      <div data-testid="message-context" key="message" />
    ]);

    clipboardWrite = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    useMessageSpy.mockRestore();
    clipboardWrite.mockRestore();
    mockWarning.mockReset();
    mockSuccess.mockReset();
    mockError.mockReset();
  });

  it("shows empty state when query yields no matches", async () => {
    renderDashboard();
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText("Search by product code or name");
    await act(async () => {
      await user.clear(searchInput);
      await user.type(searchInput, "Z999");
    });

    expect(
      await screen.findByText("No products match your search.")
    ).toBeInTheDocument();
  });

  it("warns when attempting to copy missing SolidWorks path", async () => {
    renderDashboard();
    const user = userEvent.setup();

    const card = screen.getByText("ITEM-200").closest("article");
    expect(card).not.toBeNull();
    const copyButton = within(card as HTMLElement).getByRole("button", { name: /copy/i });

    await act(async () => {
      await user.click(copyButton);
    });

    expect(mockWarning).toHaveBeenCalledWith("SolidWorks path not provided yet.");
    expect(mockSuccess).not.toHaveBeenCalled();
  });

  it("copies SolidWorks path, reports success, and handles failure fallback", async () => {
    renderDashboard();
    const user = userEvent.setup();

    const card = screen.getByText("ITEM-100").closest("article");
    expect(card).not.toBeNull();
    const copyButton = within(card as HTMLElement).getByRole("button", { name: /copy/i });

    await act(async () => {
      await user.click(copyButton);
    });

    expect(clipboardWrite).toHaveBeenCalledWith("\\\\MCMS_SHARE\\models\\ITEM-100\\REV02\\assembly.sldasm");
    expect(mockSuccess).toHaveBeenCalledWith("Copied SolidWorks shared path.");

    clipboardWrite.mockRejectedValueOnce(new Error("denied"));

    await act(async () => {
      await user.click(copyButton);
    });

    expect(mockError).toHaveBeenCalledWith("Copy failed. Please copy manually.");
  });
});
