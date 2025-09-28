# Shared-drive Path & Permission Decisions

<!-- Configuration Reference: appsettings.json ▸ FileStorage -->

## Decision Summary
- **Final Path:** `\\fileserver01\MCMS_Routing`
- **Authority:** Approved by Ops Lead (H. Lee) on 2025-12-29 UTC.
- **Access Model:** Role-based security groups mapped to business units (Aero, Auto, Energy).
- **Fallback:** If network path unavailable, failover to `\\fileserver02\MCMS_Routing_Backup` within 15 minutes.

## Permission Matrix
| Role | Group | Access | Notes |
| --- | --- | --- | --- |
| Editor | `MCMS_Routing_Editors` | Modify | Requires MFA-enabled AD account. |
| Approver | `MCMS_Routing_Approvers` | Modify | Approvers inherit editor access for audit traceability. |
| Viewer | `MCMS_Routing_Viewers` | Read | Read-only for quality and audit team members. |
| Ops | `MCMS_Routing_Ops` | Full Control | Maintains share, rotates credentials quarterly. |

## Audit Controls
- Enable access auditing using Windows Advanced Security settings; log to `Security` channel.
- Quarterly review of membership documented in governance tracker `GOV-ROUT-ACCESS`.
- Document exceptions in ServiceNow change requests referencing ticket ID.

## Implementation Notes
- Ensure service account `svc_mcms_router` retains `Log on as a service` rights on MCMS hosts.
- Update FileStorageService configuration after each path change and restart worker service.
- Notify data protection officer prior to enabling backup share.

Record this decision in Sprint 11 log entry Z1 with the approval timestamp.
