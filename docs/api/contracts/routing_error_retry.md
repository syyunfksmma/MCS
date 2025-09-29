# MCMS Routing API Error & Retry Policy

## Standard Error Payload
```
{
  "traceId": "6b5c3e0f8c2a43a",
  "code": "routing.conflict",
  "message": "Routing already approved",
  "details": "GT310001",
  "retryAfterSeconds": 120
}
```

## Error Codes
| Code | HTTP | Description | Client Action |
| --- | --- | --- | --- |
| routing.conflict | 409 | Routing state prevents operation | Refresh explorer data |
| routing.notFound | 404 | Routing missing or deleted | Show empty state |
| routing.validation | 400 | Missing required fields | Highlight form errors |
| routing.hashMismatch | 422 | Uploaded package hash mismatch | Prompt re-upload |
| server.unavailable | 503 | Temporary outage | Retry with backoff |

## Retry Policy
- Idempotent GET/POST (approve) operations: retry 2 times with exponential backoff (1s, 5s) when 5xx or network error.
- Non-idempotent uploads: no automatic retry; surface toast message.
- Include `Retry-After` header or payload when server suggests delay.

## Timeline Logging
- All retries log to `docs/logs/Timeline_YYYY-MM-DD.md` with correlation id when triggered manually.

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Draft error code & retry policy |
