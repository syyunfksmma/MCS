# Sprint 4 Resilience & Chaos Readiness

## Chaos Experiment Templates (C1/C2)
- **Node restart drill**: use 
pm run build && npm run start then terminate the process (Ctrl+C) to simulate sudden restart. Monitor reconnection (SignalR placeholder) and rerun k6 smoke test.
- **SignalR disruption**: placeholder scenario documented (full SignalR not yet live). Focus on HTTP fallback and page reload behaviour.

## Alerting Playbook (C3)
- Tie into new Web Vitals logging (eports/web-vitals.jsonl), review for abnormal CLS/FID spikes.
- When Lighthouse scores drop below thresholds (<80), raise OpsGenie incident via manual step (automation TBD).

## Next Steps
- Integrate with container orchestrator for automated chaos (e.g., Kubernetes pod eviction).
- Stream Web Vitals to Grafana for near real-time alerting.
- Expand k6 scenarios to cover authenticated admin flows once backend endpoints are live.
