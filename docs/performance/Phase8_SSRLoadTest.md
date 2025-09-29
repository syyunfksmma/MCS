# SSR Load & Recovery Test Plan

## 1. Script
- `scripts/performance/run-ssr-loadtest.ps1` fires 50 sequential requests to `/explorer` and records durations.
- Threshold: average response < 800 ms, max < 1500 ms.

## 2. Recovery Scenario
- Simulate process restart (pm2 reload) then rerun script.
- Expected downtime < 30 seconds; first request may fail, script logs warning but continues.

## 3. Metrics Capture
- Record summary in Grafana dashboard `MCMS-SSR-Load`.
- Export CSV to `artifacts/performance/ssr-load/YYYYMMDD.csv`.

## 4. Follow-up
- Automate via Azure pipeline stage `ssr_load_test` after staging deploy.
- Extend script with parallel requests (PowerShell jobs) for stress testing.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial SSR load/recovery plan captured |
