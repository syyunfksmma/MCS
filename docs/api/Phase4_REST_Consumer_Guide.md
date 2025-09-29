# REST API Consumer Guide (Next.js Integration)

## 1. Authentication
- Use MSAL in Next.js `app/api/auth` to obtain Azure AD access token with scope `MCMS.Routing.Read`/`Write`.
- Include `Authorization: Bearer <token>` header and `x-correlation-id` generated per request (use `crypto.randomUUID`).

## 2. Base URLs
| Environment | Base URL | Notes |
| --- | --- | --- |
| Dev | https://dev-api.mcms.local | Mock data allowed |
| Staging | https://stg-api.mcms.corp | Requires feature flag approvals |
| Production | https://api.mcms.corp | Enforced rate-limit 300 rpm |

## 3. Fetch Helpers
```ts
import { apiClient } from '@/lib/apiClient';

export async function getRouting(id: string) {
  return apiClient.get(`/routings/${id}`);
}
```
- `apiClient` wraps `fetch`, injects token and correlation id, retries idempotent calls twice.

## 4. Error Handling
- 401/403: redirect to `/auth/login` with returnUrl.
- 409: display toast with conflict message; include diff link.
- 5xx: escalate to Ops via `notifyDeploy` script.

## 5. Pagination & Filtering
- Use `page`, `size`, `filter` query params per `docs/api/contracts/routings.yaml`.
- React Query keys: `['routings', itemId, rev, filters]`.

## 6. Webhooks & Notifications
- Approval events posted to `/webhooks/approval` (internal). Documented in SignalR spec.

## 7. Testing
- Contract tests: `tests/api/routings.contract.ts` (to be scheduled in CI).
- Mock server: `npm run dev:api` uses MSW.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Next.js REST consumer guidance drafted for Phase4 checklist |
