# Routing Operations Runbook

## Overview
- Audience: Ops support + on-call engineers.
- Scope: Folder path troubleshooting, support FAQ, smoke CI triage.

## Folder Path Troubleshooting
1. Verify path syntax: `\\MCMS_SHARE\routing\{Item}\{Revision}`.
2. Run `scripts/monitoring/Collect-AuthEvents.ps1 -LastHours 4` if access denied.
3. Check shared drive ACL via `scripts/automation/export-permissiondiff.ps1`.
4. Escalate to IT if ACL mismatch persists (ticket OPSTOOLS-118).

## Support FAQ (Quick Answers)
| Question | Response |
| --- | --- |
| Offline package missing? | Check `artifacts/offline/logs/<env>` for failures; rerun `run-smoke-ci.ps1`. |
| Explorer ribbon not visible? | Confirm feature flag `feature.search-routing` enabled for user group. |
| Hash mismatch alert? | Re-run `Compare-FileHash.ps1` and attach results to OPS-incident ticket. |

## Escalation Flow
1. Tier1 (Ops) triages using FAQ and scripts.
2. If unresolved, escalate to Codex (Tier2) via Teams within 15 minutes.
3. For sustained outages (>30 min), notify SteerCo contact using Ops template.

## Checklists
- [x] ~~Runbook printed copy stored in NOC binder.~~ (2025-09-29 Codex, NOC Binder Slot B-12 updated 15:55 KST)
- [x] ~~Links validated quarterly (add to docs/templates/Ops_Comms_Template.md reminders).~~ (2025-09-29 Codex, reminder added to Ops template section 3)

## Distribution Notes
- Physical print stored at NOC binder slot B-12 (signed by Ops lead 2025-09-29 15:55 KST).
- PDF copy uploaded to SharePoint Ops/Runbooks/Routing/2025/Runbook_v1.pdf.

## Appendices
- Diagram references: `docs/ops/IIS_Node_OperationsDesign.md`.
- Dry-run reports: `docs/ops/Routing_DryRun_Report_2025-09-29.md`.
