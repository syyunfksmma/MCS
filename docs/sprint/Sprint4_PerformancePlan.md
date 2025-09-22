# Sprint 4 Performance Automation

## Lighthouse CI Workflow
- Script: web/mcs-portal/scripts/performance/run-lighthouse.mjs.
- Uses production 
ext start on port 3000 and captures JSON reports under web/mcs-portal/reports/lighthouse.
- Run via 
pm run perf:lighthouse (builds, launches server, executes Lighthouse for landing & admin pages).
- Designed for CI usage; reports are JSON (HTML can be enabled later).

## Web Vitals Collection
- Client hook: src/app/reportWebVitals.ts posts metrics to /api/web-vitals using sendBeacon.
- API route: src/app/api/web-vitals/route.ts appends metrics to eports/web-vitals.jsonl.
- Each entry includes metric detail, pathname, timestamp, and receivedAt ISO time.
- Data can feed dashboards or baseline comparisons.

## Follow-ups
- Integrate HTML Lighthouse reports (optional) and threshold checks.
- Wire WebPageTest to scripted credentials (documented in Phase8 plan).
- Consider pushing Web Vitals to telemetry store (Grafana/Influx) when infra ready.
