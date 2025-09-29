# Phase11 Operations Log & Metrics Bundle — 2025-09-29

## Targets
- Loki log snapshots (app, deploy, smoke, chunk upload)
- Prometheus dashboards (Portal SLA, Chunk Upload, Worker Queue, Web Vitals)
- Alertmanager policies

## Contents
| Artifact | Location | Notes |
| --- | --- | --- |
| Loki export (JSON) | `artifacts/observability/loki_export_20250929.json` | 24h window, filtered by env=internal. |
| Prometheus snapshot | `artifacts/observability/prom_snapshot_20250929.tar.gz` | Captured via `promtool snapshot`. |
| Alert rules | `monitoring/alerts/mcms_core.yaml` | Critical/warning thresholds for SLA + chunk upload. |
| Ops template addendum | `docs/templates/Ops_Comms_Template.md` | Links to Grafana + smoke logs. |

## Retention & Access
- Store artifacts for 30 days in `\\MCMS_SHARE\\observability\\Phase11`.
- Mirror summary to Confluence page `MCMS/Phase11/Observability`.
- On-call rotation receives email with bundle location (see Ops communication checklist).

## Verification
1. `promtool tsdb analyze` run against snapshot (report in `artifacts/observability/prom_snapshot_analysis.txt`).
2. Loki `logcli query --limit=20 '{app="run-smoke"}'` ensures smoke logs present.
3. Timeline updated with hand-off timestamp (2025-09-29 15:48 KST).

> 작성: 2025-09-29 Codex
