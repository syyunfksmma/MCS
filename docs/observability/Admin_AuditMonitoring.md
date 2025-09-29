# Admin Audit & Monitoring View Plan

## 1. Dashboard Components
- **AdminAuditLogPanel**: searchable table with severity filters and routing context.
- **AdminMonitoringPanel**: displays smoke CI, chunk upload metrics, and alert status.

## 2. Enhancements Delivered
- Exposed `/admin/api-keys` route for role-specific settings.
- Added timeline export CSV support (AdminAuditLogPanel already renders `Export` button).
- Card layout integrated into Admin console via `AdminPageClient`.

## 3. Data Sources
| Source | Description |
| --- | --- |
| `/api/admin/audit` | Paginated audit log entries |
| `/api/admin/alerts` | Current alert snapshot (Loki + Grafana) |
| `/api/admin/status` | MCMS service health summary |

## 4. Alerting Hooks
- Audit view highlights `Critical` severity with red tag and `ExclamationCircleOutlined` icon.
- Monitoring panel surfaces smoke CI failures with retry link to `run-smoke-ci.ps1` logs.

## 5. Next Steps
- Wire to production API once endpoints go live.
- Add Playwright regression for audit filters (Sprint9 follow-up).

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Documented Admin audit/monitoring view implementation for Phase7 |
