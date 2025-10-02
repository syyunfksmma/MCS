import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ExplorerResponse } from "@/types/explorer";
import { vi } from "vitest";

vi.mock("@/components/providers/AuthProvider", () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    isLoading: false,
    account: { username: 'test.user@example.com' },
    roles: [],
    error: undefined,
    signIn: vi.fn(),
    signOut: vi.fn()
  })
}));

vi.mock("@/components/TreePanel", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect?: (id: string | null) => void }) => (
    <button data-testid="mock-tree" onClick={() => onSelect?.("routing-1")}>Select Routing</button>
  )
}));

vi.mock("@/components/features/FeatureGate", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock("@/components/explorer/RoutingCreationWizard", () => ({
  __esModule: true,
  default: () => null
}));

vi.mock("@/components/explorer/SearchFilterRail", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-filter">Filters</div>
}));

vi.mock("@/components/explorer/ExplorerRibbon", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-ribbon">Ribbon</div>
}));

vi.mock("@/components/workspace/WorkspaceUploadPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-upload">Upload Panel</div>
}));

vi.mock("@/components/explorer/AddinHistoryPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-history">History Panel</div>
}));

vi.mock("@/hooks/useExplorerData", () => ({
  useExplorerData: () => ({ data: undefined, isFetching: false, isError: false, error: null })
}));

const mutateAsync = vi.fn();

vi.mock("@/hooks/useRoutingSearch", () => ({
  useRoutingSearch: () => ({ mutateAsync, isPending: false })
}));

vi.mock("@/lib/featureFlags", () => ({
  isFeatureEnabled: () => true,
  setFeatureFlag: vi.fn()
}));

vi.mock("@/hooks/useNavigation", () => ({
  useNavigation: () => ({
    activeTab: "explorer",
    tabs: [],
    navigateToTab: vi.fn(),
    lastRoutingId: null,
    setLastRoutingId: vi.fn()
  })
}));

import ExplorerShell from "@/components/explorer/ExplorerShell";

const initialData: ExplorerResponse = {
  source: "mock",
  generatedAt: "2025-09-29T00:00:00.000Z",
  items: [
    {
      id: "item-1",
      code: "ITEM-1",
      name: "Sample Item",
      revisions: [
        {
          id: "rev-1",
          code: "REV-A",
          routingGroups: [
            {
              id: "group-1",
              name: "OP10",
              displayOrder: 1,
              routings: [
                {
                  id: "routing-1",
                  code: "R-001",
                  status: "PendingApproval",
                  camRevision: "CAM-5",
                  owner: "operator.one",
                  files: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

describe("ExplorerShell routing card", () => {
  let queryClient: QueryClient;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    queryClient = new QueryClient();
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ routing: null, history: [], uploads: [] })
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    queryClient.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.skip("shows placeholder then renders routing details after selection", async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <ExplorerShell initialData={initialData} />
      </QueryClientProvider>
    );

    expect(
      screen.getByText('Hover Quick Menu enabled')
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("mock-tree"));

    await waitFor(() => {
      expect(screen.getByText("R-001")).toBeInTheDocument();
    });
    expect(screen.getByText(/PendingApproval/)).toBeInTheDocument();
    expect(screen.getByText(/CAM-5/)).toBeInTheDocument();

  });
});




