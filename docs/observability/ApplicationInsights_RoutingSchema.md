# Application Insights Schema Update — Routing Telemetry (2025-09-29)

## New Custom Events
| Event Name | Properties | Description |
| --- | --- | --- |
| routing.search.executed | term, resultCount, observedClientMs, slaTargetMs | Fired after typeahead search completes. |
| routing.upload.chunk | routingId, fileType, chunkIndex, chunkSize | Emitted per chunk upload to monitor throughput. |
| routing.feature.flag | flagKey, previousState, nextState, actor | Audit for feature toggles (search-routing). |

## Metrics
- `routing_search_observed_ms`: stores observed client SLA per search invocation.
- `routing_upload_chunk_ms`: duration per chunk upload, aggregated for p95.

## Implementation Notes
- Logged via `logRoutingEvent` helper (web/mcs-portal/src/lib/telemetry/routing.ts) using Application Insights JS SDK.
- Sampling rate 50% for search events until GA.

> 작성: 2025-09-29 Codex
