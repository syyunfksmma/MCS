# Sprint6 Flow G/H Regression Plan

## Scope
- Flow G: Routing group ordering, inline rename, soft delete.
- Flow H: Routing creation wizard end-to-end (shared drive ready, telemetry, audit).

## Test Matrix
| Scenario | Steps | Expected | Notes |
|----------|-------|----------|-------|
| G1-Order-01 | Drag Machining → before Quality, persist via API | Display order updated, API returns 200, EventCounter queue length spike < 5 | Validate via Explorer API + UI.
| G1-Order-02 | Reorder with stale token | API 409, UI rollback to previous state | Requires backend concurrency token.
| G2-Rename-01 | Rename group to `Finishing` | Explorer list updates, audit log entry created | Confirm `UpdatedBy` matches current operator.
| G2-SoftDelete-01 | Toggle soft delete | UI hides group, API sets `IsDeleted=true` | Ensure wizard prevents creation under deleted group.
| H1-Create-01 | Wizard success path | New routing returned, Setup push executed, Esprit event signalled | Validate Setup file diff + COM call.
| H1-Create-02 | Shared drive not ready | API 422, UI shows error toast, no Setup changes | Simulate by toggling flag in payload.

## Tooling
- **Playwright**: new spec `tests/e2e/explorer/group-flow.spec.ts` (drag-and-drop, inline rename).
- **API Tests**: `tests/integration/ExplorerMutationsTests.cs` covering reorder/rename/create.
- **Performance**: Re-run `monitor-meta-json.ps1` during H1-Create scenarios to observe counters.

## Logging
- Update `docs/sprint/Sprint6_Routing_Log.md` per execution with date/owner/observed metrics.
- Capture Esprit automation log output from `Apply-EspritEdgeWorkflow.ps1` for each test run.

## Exit Criteria
- All scenarios pass in staging.
- meta-json queue length p95 < 10 during peak reorders.
- No regression failures recorded in Playwright nightly run.
