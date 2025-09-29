# Audit Meta Events API Spec — Draft 2025-09-29

## Endpoint
`GET /api/audit/meta-events`

### Query Parameters
| Name | Type | Description |
| --- | --- | --- |
| `from` | string (ISO 8601) | Inclusive start timestamp. |
| `to` | string (ISO 8601) | Exclusive end timestamp. |
| `eventType` | string | Optional filter (`meta.json.write`, `routing.ready`, `routing.compare`). |
| `limit` | integer (default 100) | Maximum number of events returned (max 500). |

### Response
```
{
  "events": [
    {
      "id": "meta-evt-20250929-001",
      "eventType": "meta.json.write",
      "routingId": "routing_gt310001",
      "status": "Success",
      "durationMs": 432,
      "actor": "ops.user",
      "createdAt": "2025-09-29T05:12:30Z"
    }
  ],
  "nextCursor": "MjAyNS0wOS0yOVQwNToxMjozMFo="
}
```

### Errors
| Code | HTTP | Description |
| --- | --- | --- |
| `audit.invalidRange` | 400 | `from` later than `to`. |
| `audit.limitExceeded` | 400 | `limit` > 500. |
| `audit.unauthorized` | 403 | Missing admin scope. |

> 작성: 2025-09-29 Codex
