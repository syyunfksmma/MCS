# Windows k6 Load Test Plan — 2025-09-29

## Scenario
- Script: `tests/k6/chunk_upload.js`
- Environment: Windows Server 2022, PowerShell 7.4, k6 v0.49
- Target API: `https://localhost:7229/api/routings/{id}/upload`

## Execution
```powershell
k6 run tests/k6/chunk_upload.js `
  --vus 5 `
  --duration 5m `
  --env API_BASE=https://localhost:7229 `
  --env FILE_PATH=artifacts/sample/5mb.bin
```

## Metrics Tracked
| Metric | Threshold |
| --- | --- |
| `chunk_upload_complete_ms{p(95)}` | < 20000 ms |
| `http_req_failed` | < 1% |
| `iteration_duration{p(95)}` | < 25000 ms |

## Output
- k6 summary JSON saved to `artifacts/perf/k6_windows_20250929.json`.
- k6 log forwarded to Loki via promtail (label `app="k6-chunk"`).

> 작성: 2025-09-29 Codex
