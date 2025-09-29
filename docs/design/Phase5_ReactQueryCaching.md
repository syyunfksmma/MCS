# React Query Caching & Prefetch Strategy (Phase 5)

## 1. Defaults
- `staleTime`: 60 seconds for explorer queries to avoid redundant refetch.
- `gcTime`: 15 minutes to retain data when navigating between Explorer and Workspace.
- `refetchOnWindowFocus`: disabled to prevent jitter during CAM review sessions.

Implemented via `createQueryClient` factory (`src/lib/queryClientFactory.ts`).

## 2. Prefetching
- Explorer SSR prefetch (`app/explorer/page.tsx`) uses factory to create client and hydrate initial data.
- Item SSR route (`app/explorer/[itemId]/page.tsx`) shares same fetch logic through `getRoutingSummary`.

## 3. Query Keys
| Key | Description |
| --- | --- |
| `['explorer']` | Root explorer dataset |
| `['routing', routingId]` | Routing detail for modals |
| `['addin-jobs']` | Background job stream |

## 4. Mutation Strategy
- `retry: 1` for mutating operations; errors bubble to toast with correlation id.
- Pending routing updates invalidates `['explorer']` and `['routing', id]`.

## 5. Next Steps
- Add offline persistence (React Query persistQueryClient) for CAM laptop workflows.
- Capture query cache metrics in Grafana (custom gauge for cache size).

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial caching strategy documented & factory implemented |
