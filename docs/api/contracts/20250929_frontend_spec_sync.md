# Frontend API Spec Consolidation — 2025-09-29

## Sources
- docs/api/contracts/products_dashboard_v2.md
- docs/api/contracts/routing_events_samples.md
- docs/api/contracts/routing_error_retry.md
- docs/api/contracts/magic_link_policy.md

## Outcome
- `/api/products/dashboard` canonicalized for Next.js data fetching; SSR hydration keys listed.
- Routing event payloads normalized with `eventId`, `routingId`, `metadata.packagePath` fields.
- Error envelope documented for React Query error boundaries.
- Email magic link contract cross-referenced for verification UI requirements.

## Next Steps
- Generate combined OpenAPI fragment via `npm run build:openapi` (pending schema lint).

> 작성: 2025-09-29 Codex
