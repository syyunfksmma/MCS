# IIS Reverse Proxy & Node Service Operations Design

## 1. Topology
- IIS 10 with Application Request Routing (ARR) on Windows Server 2019.
- Site MCMS-Web listens on 443, forwards / to Next.js upstream (http://localhost:3000).
- /api proxied to .NET backend (http://localhost:5000).
- Static assets cached via IIS output cache (60s) with cache-busting query parameters from Next.js build.

## 2. Configuration Snippet
`xml
<rule name="NextJsSSR" stopProcessing="true">
  <match url="^(?!api).*" />
  <action type="Rewrite" url="http://localhost:3000/{R:0}" />
</rule>
<rule name="DotNetApi" stopProcessing="true">
  <match url="^api/(.*)" />
  <action type="Rewrite" url="http://localhost:5000/{R:1}" />
</rule>
`
- Security headers enforced via web.config (HSTS, X-Content-Type-Options, CSP placeholder).

## 3. Operations Procedures
| Scenario | Action | Owner |
| --- | --- | --- |
| Planned deployment | Use estart-mcms-services.ps1 -Scope Web to drain, deploy, restart pm2 & IIS | DevOps |
| Emergency rollback | Run pm2 deploy ecosystem.config.js production revert 1 and iisreset /restart | DevOps |
| Health monitoring | Check /healthz endpoints; use Grafana dashboard MCMS-Web-Infra | Operations |
| Log review | Next.js logs via Loki, IIS logs shipped daily to shared drive (\\MCMS_SHARE\logs\iis) | Operations |

## 4. Approval
- Reviewed by IT Infrastructure Manager on 2025-09-28; matches corporate reverse proxy standards.
- Operations runbook cross-linked in docs/ops/Runbook.md (to be updated in Sprint 10 tasks).

## 5. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Documented IIS reverse proxy + Node operations design for Phase 2 checklist |
