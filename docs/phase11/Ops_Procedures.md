# Phase11 Operations Procedure & Observability Summary — 2025-09-29

## Daily Routine
| Time | Task | Owner |
| --- | --- | --- |
| 08:30 | Review Grafana dashboard `mcms-s6-core` (SLA/Chunk/Worker panels). | Ops On-call |
| 09:00 | Check smoke log ingest (`logcli query --limit=5 '{app="run-smoke"}'`). | Ops On-call |
| 13:00 | Verify Alertmanager queue (no stale alerts > 4h). | Ops Backup |
| 17:30 | Submit daily summary to Ops channel using template. | Codex |

## Incident Response Flow
1. Alert triggered → create incident ticket (OPS-INC-####).
2. Consult Routing Operations Runbook (folder path + FAQ).
3. If unresolved after 15 minutes, escalate to Tier2 (Codex) and attach latest logs.
4. Record resolution details in `docs/logs/Timeline_YYYY-MM-DD.md` and Ops Confluence page.

## Observability Hooks
- Application Insights custom events logged via `logRoutingEvent` helper.
- Loki labels standardized: `app`, `env`, `service`, enabling cross-panel filters.
- Prometheus metrics aligned to SLA: `routing_search_observed_ms`, `routing_upload_chunk_ms`.

## Deliverables
- ✅ Incident contact matrix appended to `docs/templates/Ops_Comms_Template.md`.
- ✅ Runbook + bundle stored in `\\MCMS_SHARE\\handoff\\Phase11_Operations`.
- ✅ Onboarding session scheduled with Ops (2025-09-30 16:00 KST).

> 작성: 2025-09-29 Codex
