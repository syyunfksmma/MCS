# Next.js + .NET Integration Architecture (Phase 2)

## 1. High-Level Diagram
`
Browser Clients
   │  (MSAL PKCE)
   ▼
Next.js Frontend (Node 20, pm2)
   │  ├─ API Routes (/api/* -> BFF)
   │  └─ SSR rendering
   ▼
IIS Reverse Proxy (ARR)
   │  ├─ TLS termination
   │  └─ /api proxy to .NET backend
   ▼
MCMS .NET Core API (Kestrel)
   │  ├─ Routing domain services
   │  ├─ SignalR hub (notifications)
   │  └─ Auth via Azure AD JWT
   ▼
SQL Server 2019 / Redis Cache
   │
   └─ File Storage Service -> Shared Drive (W:)
`

## 2. Integration Points
- **Session**: Next.js obtains Azure AD tokens; forwards bearer token to .NET API. Token validation via Microsoft.Identity.Web.
- **Data Fetching**: Explorer pages use SSR with React Query hydration; API gateway route /api/routings proxied through Next.js for caching.
- **SignalR**: SSR includes negotiated connection info; Next.js uses /api/signalr/negotiate to connect to .NET hub for live approvals.
- **File Operations**: .NET API delegates to FileStorage service (shared drive) and triggers offline packaging scripts via queue.

## 3. Observability
- Logging: Next.js writes to Loki via promtail; .NET uses Serilog (Elastic sink) with correlation IDs forwarded from Next.js.
- Metrics: Prometheus exporter on .NET (exposes /metrics), Next.js custom metrics via Telegraf.

## 4. Security Considerations
- Strict origin allow list in Next.js .env.production (internal domains only).
- API enforces scope MCMS.Routing.Read/Write; Next.js adds x-correlation-id header per request.
- Shared secrets stored in Azure Key Vault; .NET accesses via managed identity.

## 5. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Architecture diagram and integration points documented for Phase 2 checklist |
