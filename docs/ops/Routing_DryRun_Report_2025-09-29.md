# Routing Deployment Dry-Run Report (2025-09-29)

## Steps
1. Executed `scripts/deploy/routing-green.ps1 -DryRun` against staging slot.
2. Triggered Playwright smoke suite (`npm run test:e2e -- --project=chromium --grep "Routing E2E smoke"`).
3. Observed Grafana dashboard `Routing-Stage` for 15 minutes post swap simulation.

## Metrics Snapshot
| Metric | Value | Threshold |
| --- | --- | --- |
| HTTP 5xx rate | 0.2% | <1% |
| Next.js memory usage | 420MB | <512MB |
| Smoke CI duration | 6m12s | <8m |

## Observations
- `feature.search-routing` toggled successfully via config service; audit log recorded at 2025-09-29 12:45 KST.
- No elevated latency detected; promtail scraped logs without backlog.

## Follow-up
- Automate dry-run via nightly pipeline (create stage `routing_dryrun` referencing this script).
- Share Grafana snapshot links with Ops (ticket OPS-214).

## Evidence
- Logs: `artifacts/deployments/dry-run/2025-09-29/`
- Grafana snapshot: `grafana-snapshots/routing-dryrun-20250929.json`
