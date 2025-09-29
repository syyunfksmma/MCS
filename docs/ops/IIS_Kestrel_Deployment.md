# IIS + Kestrel Deployment Plan — 2025-09-29

## Architecture
- IIS (reverse proxy) listens on 443 (SNI cert `mcms.corp`).
- Backend Kestrel (MCMS.Api) hosted as Windows Service via `sc.exe`.
- Static assets served from `C:\MCMS\web` (Next.js SSR output).

## Steps
1. Install IIS role (`Web-Server`, `Web-WebSockets`, `Web-Http-Redirect`).
2. Create site `MCMS-Portal` binding to `mcms.corp:443`, enable ARR proxy to `http://localhost:5100`.
3. Configure application pool `MCMS.AppPool` (No Managed Code, identity `MCMS\svc-mcms`).
4. Register Kestrel service using `sc create MCMS.Api binPath= "C:\MCMS\api\MCMS.Api.exe" start=auto`.
5. Update `web.config` rewrite rules for SPA fallback.

## Health Checks
- `https://mcms.corp/healthz` returns 200.
- `netstat -ano | findstr 5100` confirms Kestrel listening.

> 작성: 2025-09-29 Codex
