import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useRef,
  useState
} from 'react';
import { isFeatureEnabled } from '@/lib/featureFlags';
import type {
  ExplorerItem,
  ExplorerRevision,
  ExplorerRouting,
  ExplorerRoutingGroup
} from '@/types/explorer';
import type { RoutingSearchResult } from '@/types/search';

type ExplorerSearchResult = RoutingSearchResult & { slaTargetMs?: number };

export type ExplorerWizardContext = {
  item: ExplorerItem;
  revision: ExplorerRevision;
  group: ExplorerRoutingGroup;
};

export type ExplorerLayoutState = {
  itemsState: ExplorerItem[];
  setItemsState: Dispatch<SetStateAction<ExplorerItem[]>>;
  selectedRouting: ExplorerRouting | null;
  setSelectedRouting: Dispatch<SetStateAction<ExplorerRouting | null>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchResult: ExplorerSearchResult | null;
  setSearchResult: Dispatch<SetStateAction<ExplorerSearchResult | null>>;
  lastSearchError: string | null;
  setLastSearchError: Dispatch<SetStateAction<string | null>>;
  wizardContext: ExplorerWizardContext | null;
  setWizardContext: Dispatch<SetStateAction<ExplorerWizardContext | null>>;
  productFilter: string | undefined;
  setProductFilter: Dispatch<SetStateAction<string | undefined>>;
  groupFilter: string | undefined;
  setGroupFilter: Dispatch<SetStateAction<string | undefined>>;
  statusFilter: string | undefined;
  setStatusFilter: Dispatch<SetStateAction<string | undefined>>;
  hoveredResultId: string | null;
  setHoveredResultId: Dispatch<SetStateAction<string | null>>;
  isSearchFeatureEnabled: boolean;
  setIsSearchFeatureEnabled: Dispatch<SetStateAction<boolean>>;
  legacyFilterTerm: string;
  setLegacyFilterTerm: Dispatch<SetStateAction<string>>;
  typeaheadTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
};

export function useExplorerLayout(
  initialItems: ExplorerItem[],
  initialSearchEnabled?: boolean
): ExplorerLayoutState {
  const [itemsState, setItemsState] = useState<ExplorerItem[]>(initialItems);
  const [selectedRouting, setSelectedRouting] =
    useState<ExplorerRouting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<ExplorerSearchResult | null>(
    null
  );
  const [lastSearchError, setLastSearchError] = useState<string | null>(null);
  const [wizardContext, setWizardContext] =
    useState<ExplorerWizardContext | null>(null);
  const [productFilter, setProductFilter] = useState<string | undefined>(
    undefined
  );
  const [groupFilter, setGroupFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [hoveredResultId, setHoveredResultId] = useState<string | null>(null);
  const [isSearchFeatureEnabled, setIsSearchFeatureEnabled] = useState(
    initialSearchEnabled ?? isFeatureEnabled('feature.search-routing')
  );
  const [legacyFilterTerm, setLegacyFilterTerm] = useState('');
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  return {
    itemsState,
    setItemsState,
    selectedRouting,
    setSelectedRouting,
    searchTerm,
    setSearchTerm,
    searchResult,
    setSearchResult,
    lastSearchError,
    setLastSearchError,
    wizardContext,
    setWizardContext,
    productFilter,
    setProductFilter,
    groupFilter,
    setGroupFilter,
    statusFilter,
    setStatusFilter,
    hoveredResultId,
    setHoveredResultId,
    isSearchFeatureEnabled,
    setIsSearchFeatureEnabled,
    legacyFilterTerm,
    setLegacyFilterTerm,
    typeaheadTimeoutRef
  };
}
