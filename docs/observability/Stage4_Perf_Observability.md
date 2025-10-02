# Stage 4 Performance & Observability (2025-10-02)

## FileStorage Meta SLA Instrumentation
- Implemented `FileStorageEventSource` (`MCMS.FileStorage`) with counters:
  - `meta-json-queue-length` (PollingCounter) – current queue depth.
  - `meta-json-write-duration-ms` – per-write duration histogram.
  - `meta-json-queue-wait-ms` – queue latency prior to serialization.
  - `meta-json-writes-total` – per-minute throughput indicator.
- Hooked `FileStorageService` enqueue/dequeue pipeline to publish queue length on every state change and record write/wait metrics per operation.
- Queue disposals reset counters to zero to avoid stale Prometheus samples.

## Log Pipeline Updates
- Added Promtail job `mcms-meta` in `monitoring/promtail/config.mcms.yaml` to tail `logs/meta-json-counters.ndjson` and attach RFC3339 timestamps.
- `scripts/performance/monitor-meta-json.ps1` remains the capture entrypoint; NDJSON output is now Loki-ready.

## Alert Simulation
- Created `scripts/monitoring/amtool-smoke.ps1` to validate `monitoring/alerts/mcms_core.yaml` and optionally push/delete synthetic alerts against Alertmanager using `amtool`.
- Recommended usage:
  ```powershell
  ./scripts/monitoring/amtool-smoke.ps1 -AlertmanagerUrl http://localhost:9093
  ```

## Next Steps
- Wire `meta-json-queue-length` p95 to Alertmanager once target thresholds validated with k6 runs.
- Extend CI job `meta-sla.yml` to upload counter snapshots alongside CSV history (tracked in QA Shakeout TODO).
