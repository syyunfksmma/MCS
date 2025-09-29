# SignalR / SSE Event Specification

## 1. Hub Overview
- Hub route: `/hubs/routing`
- Transport: WebSockets with fallback to Server-Sent Events.
- Auth: Bearer token (same as REST). Connection includes `x-correlation-id` query param.

## 2. Events
| Event | Payload | Description |
| --- | --- | --- |
| `routingUpdated` | `{ routingId, status, updatedBy, updatedAt }` | Fired after approval/reject or metadata change |
| `packageReady` | `{ routingId, packagePath, checksum }` | Offline package uploaded and hash verified |
| `alertTriggered` | `{ alertId, severity, message }` | Relays monitoring alerts to UI |

## 3. Client Usage
```ts
import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
  .withUrl('/hubs/routing', { accessTokenFactory: getToken })
  .withAutomaticReconnect()
  .build();

connection.on('routingUpdated', (payload) => {
  queryClient.invalidateQueries(['routing', payload.routingId]);
});
```

## 4. SSE Fallback
- Endpoint: `/stream/routing`
- Retry: 5 seconds.
- Message format: `event:<name>\ndata:<json>\n\n`

## 5. Server Implementation Notes
- Use `AddSignalR()` in `Startup.cs`; configure `WithAutomaticReconnect()`.
- Broadcast events from domain services after transactional commit.
- SSE uses `Response.BodyWriter` to push minimal payload for read-only clients.

## 6. Testing
- Integration test: `tests/signalr/routingHub.spec.ts` (pending) ensures message delivery.
- Load test: `k6` script reuses same hub endpoint with `ws` module; target 500 concurrent connections.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial SignalR/SSE event spec captured |
