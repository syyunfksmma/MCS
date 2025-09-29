# Monitoring & Alert Dashboard Refresh

## Dashboard Updates
- Added SSR response panel (data source: Telegraf web vitals).
- Included SignalR connection health stat using Loki query `sum(rate(signalr_disconnect_total[5m]))`.
- Updated smoke CI status panel to read from `monitoring/alerts/mcms_core.yaml`.

## Alerting
- Stage & Prod share alert template with environment tag.
- Thresholds: LCP > 3s (warning), smoke failure count >= 1 (critical).

## Verification
- Grafana snapshot `snapshots/MCMS-Dashboard-20250929.json` stored alongside runbook.
- Alertmanager test via `amtool alert query --expr mcms_smoke_failure` executed, result zero.

## Follow-up
- Schedule monthly review with Ops (first Monday).
- Automate dashboard JSON export in pipeline.

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Dashboard refresh 문서화 |
