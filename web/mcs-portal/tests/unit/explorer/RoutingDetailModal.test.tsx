import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoutingDetailModal from "@/components/explorer/RoutingDetailModal";
import type { ExplorerRouting } from "@/types/explorer";

const sampleRouting: ExplorerRouting = {
  id: "routing-1",
  code: "ROUT-001",
  status: "PendingApproval",
  camRevision: "CAM-12",
  owner: "qa.engineer",
  files: [
    { id: "file-1", name: "program.esp", type: "esprit" },
    { id: "file-2", name: "fixture.gdml", type: "other" }
  ]
};

describe("RoutingDetailModal", () => {
  it("renders placeholder when no routing is selected", () => {
    render(
      <RoutingDetailModal open routing={null} onClose={() => undefined} />
    );

    expect(screen.getByText("라우팅을 선택하세요")).toBeInTheDocument();
  });

  it("shows file list and empty state correctly", async () => {
    const user = userEvent.setup();

    render(
      <RoutingDetailModal open routing={{ ...sampleRouting, files: [] }} onClose={() => undefined} />
    );

    await user.click(screen.getByRole("tab", { name: /files/i }));
    expect(screen.getByText("파일이 없습니다")).toBeInTheDocument();
  });

  it("lists attached files when routing has entries", async () => {
    const user = userEvent.setup();

    render(
      <RoutingDetailModal open routing={sampleRouting} onClose={() => undefined} />
    );

    await user.click(screen.getByRole("tab", { name: /files/i }));

    expect(screen.getByText("program.esp")).toBeInTheDocument();
    expect(screen.getByText("fixture.gdml")).toBeInTheDocument();
  });
});
