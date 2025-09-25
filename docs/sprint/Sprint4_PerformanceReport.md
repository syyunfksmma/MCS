# Sprint 4 Performance Report

## Lighthouse
- Command: 
pm run perf:lighthouse
- Target pages:
  - / (landing)
  - /admin
- Report output: eports/lighthouse/lighthouse-*.json
- Thresholds (target): Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90.

## Web Vitals Snapshot
- Metrics persisted to eports/web-vitals.jsonl via /api/web-vitals.
- Capture CLS/FID/LCP for smoke navigation; review after deployments.

## Follow-up Actions
- Integrate HTML Lighthouse reports for easier visualization.
- Wire pipeline gate to fail when scores drop below thresholds.
- Stream Web Vitals to Grafana for long-term monitoring.
