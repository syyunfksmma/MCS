import React from 'react';
import { render, screen } from "@testing-library/react";
import RoutingDetailModal from "@/components/explorer/RoutingDetailModal";
import type { ExplorerRouting } from "@/types/explorer";

type ModalProps = React.ComponentProps<typeof RoutingDetailModal>;

const baseRouting: ExplorerRouting = {
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

function renderModal(override: Partial<ModalProps>) {
  const props: ModalProps = {
    open: true,
    routing: baseRouting,
    activeTab: "summary",
    onClose: () => undefined,
    ...override
  } as ModalProps;

  return render(<RoutingDetailModal {...props} />);
}

describe("RoutingDetailModal", () => {
  it("renders placeholder when no routing is selected", () => {
    renderModal({ routing: null });

    expect(screen.getByText("Select a routing to view details")).toBeInTheDocument();
  });

  it("shows file empty state when routing has no files", () => {
    renderModal({ routing: { ...baseRouting, files: [] }, activeTab: "files" });

    expect(screen.getByText("No files uploaded")).toBeInTheDocument();
  });

  it("lists attached files when routing has entries", () => {
    renderModal({ routing: baseRouting, activeTab: "files" });

    expect(screen.getByText("program.esp")).toBeInTheDocument();
    expect(screen.getByText("fixture.gdml")).toBeInTheDocument();
  });
});
