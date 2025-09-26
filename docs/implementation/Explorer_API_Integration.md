# ExplorerShell Routing API Integration Plan

## Overview
- Goal: Replace the local-only ExplorerShell state with backend-backed mutations for Flow G/H tasks (group ordering, inline edit/soft delete, routing creation wizard).
- Backend target: `MCMS.API` with new endpoints under `/api/explorer`.

## Proposed Endpoints
| Endpoint | Verb | Payload | Notes |
|----------|------|---------|-------|
| `/api/explorer/groups/reorder` | PATCH | `{ groupId, dropSiblingId, position }` | Persists display order, returns refreshed Explorer payload. |
| `/api/explorer/groups/{id}` | PATCH | `{ name?, isDeleted? }` | Inline rename/soft delete toggle; audit logged. |
| `/api/explorer/groups/{id}/routings` | POST | `{ code, owner, status, sharedDriveReady, notes }` | Creates routing and returns Explorer fragment. |

### Contracts
- Response: `ExplorerResponse` maintains existing shape so frontend diff is minimal.
- Errors: 409 for conflicting display order, 422 for invalid routing code.
- Telemetry: Application Insights event `ExplorerMutation` with keys `mutation`, `latencyMs`, `queueWaitMs`.

## Sequence Flow (Routing Creation)
1. UI opens wizard (current UX).
2. On submit call `POST /api/explorer/groups/{id}/routings`.
3. API validates shared-drive readiness (`IRoutingService.EnsureSharedDrive`).
4. API returns new routing; frontend merges via `setItemsState` until server payload update is integrated.
5. When chunk upload completes, `meta_sla_history.csv` update triggered by existing scripts.

## Storage Considerations
- Add `RoutingGroups.DisplayOrder` column + index if missing.
- Introduce optimistic concurrency token (rowversion) to prevent lost updates.
- Inline rename/soft delete reuses `UpdatedBy`/`UpdatedAt` columns for audit.

## Telemetry & Alerts
- Use `FileStorageEventSource` counters for mutation-induced meta writes.
- Add custom metric `ExplorerMutation.latency_ms` capturing end-to-end API time.

## Implementation Checklist
1. Add DTOs + validators (`ExplorerReorderRequest`, `ExplorerRoutingCreateRequest`).
2. Extend `IRoutingService` with `CreateRoutingAsync` hooking shared-drive validation.
3. Update `ExplorerController` to expose new endpoints and maintain backward compatibility for GET.
4. Update `ExplorerShell` frontend to call APIs and reconcile state via server payload (remove temporary local clones post-rollout).
5. Extend Playwright plan (see `docs/testing/Sprint6_FlowG_H_Regressions.md`).
6. Document contract in `docs/api/openapi_mcs.yaml` (new operations).

## Rollout Strategy
- Phase 1: Deploy API endpoints behind feature flag `feature.explorer.mutations`.
- Phase 2: Frontend toggled to server-backed path in staging.
- Phase 3: Enable flag in production, monitor counters via new monitoring pipeline.
- Rollback: Toggle allows frontend to stay in local-only mode.

## Dependencies
- Shared-drive callback service for validation.
- Updated meta SLA dashboard (see FileStorage Event Monitoring Playbook).
- Esprit automation workflow delivering consistent Setup values post-routing creation.
