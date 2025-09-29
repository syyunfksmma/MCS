# Exception & Network Failure UX Design

## 1. Failure Scenarios
- API 5xx or timeout while loading Explorer data.
- SignalR disconnect resulting in stale routing status.
- Offline package verification failure (Compare-FileHash).

## 2. UX Guidelines
- Show inline `Alert` with retry button; include correlation id (`traceId`).
- Provide `Report issue` link opening Teams channel `#mcms-ops` with prefilled template.
- For network loss, display persistent banner with countdown to auto-retry (5s).

## 3. Components
- `ErrorBoundary` (new) captures React errors, renders fallback with details toggle.
- `NetworkBanner` listens to `navigator.onLine`, surfaces offline indicator.

## 4. Recovery Actions
- Retry button triggers React Query `refetch`.
- For SignalR, call `connection.start()` with exponential backoff (2s, 5s, 10s).

## 5. Accessibility
- Alerts use `role="alert"`, focus moves to banner.
- Provide keyboard accessible `Retry` and `View logs` buttons.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Exception/네트워크 장애 UX 설계 문서 작성 |
