# Routing Shared Drive Rollback Procedure

## Scope
Covers rollback when feature flags or deployments introduce faulty routing packages on `\\MCMS_SHARE`.

## Prerequisites
- Snapshot ID from pre-deployment (e.g., BG-20250929).
- Access to shared drive admin credentials.
- `scripts/automation/cleanup-offline-logs.ps1` available locally.

## Steps
1. Notify Ops via Teams #mcms-ops (template in Ops_Comms_Template.md) with reason for rollback.
2. Disable `feature.search-routing` and `feature.feedback-banner` via config service.
3. Use `scripts/automation/register-package-offline.ps1 -Mode Restore -SnapshotId <ID>`.
4. Validate restored packages: run `scripts/deploy/Compare-FileHash.ps1 -BaselineSnapshot <ID>`.
5. Purge cached offline logs using `scripts/automation/cleanup-offline-logs.ps1 -Scope Routing`.
6. Run `npm run test:e2e -- --project=chromium --grep "Routing E2E smoke"` to ensure UI stability.

## Verification Checklist
- [x] ~~Shared drive directories match snapshot manifest.~~ (2025-09-29 Codex, artifacts/deployments/snapshots/BG-20250929_manifest.json)
- [x] ~~Smoke CI passes post-restore.~~ (2025-09-29 Codex, docs/sprint/Sprint8_Log.md)
- [x] ~~Grafana alerts return to green within 10 minutes.~~ (2025-09-29 Codex, docs/observability/Phase10_MonitoringDashboard.md)

## Communication
- Postmortem entry in docs/sprint/Sprint10_Routing_Log.md (section W1).
- Email summary to SteerCo (template referenced in Ops_Comms_Template.md).

## References
- Snapshot manifest storage: `artifacts/deployments/snapshots/`.
- Automation scripts: `scripts/automation/register-package-offline.ps1`.
