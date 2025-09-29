# SSO & Node Hosting Policy Guide (MCMS Web Transition)

## 1. Authentication & Security Policy
- Identity Provider: Azure AD (Hybrid) with conditional access policy MCMS_Web_Tier applied.
- Token Flow: Next.js frontend uses MSAL (PKCE) to acquire tokens; .NET backend validates via Azure AD B2E endpoints.
- Session Lifetime: 60 minutes access token, 8 hour refresh token window. Enforced via PersistentAuth disabled for shared kiosks.
- MFA: Required for all Approver/Admin roles; enforced through Azure AD conditional access.
- TLS: Terminated at IIS reverse proxy with TLS 1.2 minimum, AES-256-GCM suites only; certificates rotated every 6 months (IT Infra owned).

## 2. Node Hosting Standards
| Item | Requirement | Owner |
| --- | --- | --- |
| Runtime | Node.js 20 LTS (managed via nvs), hardened baseline with Windows Defender exclusions documented |
| Process Manager | pm2 service with auto-start (pm2 startup powershell), logs shipped to Loki via promtail |
| Windows Service Wrapper | MCMS-Nextjs service created through NSSM for failover restart |
| Health Checks | /healthz endpoint proxied via IIS Application Request Routing, 30s interval |
| Resource Limits | pm2 ecosystem config sets max_memory_restart: 1024M, cluster mode disabled |

## 3. Deployment Controls
- Release gates require security sign-off to confirm TLS certificate validity and SSO policy compliance.
- Smoke CI run (run-smoke-ci.ps1) must pass before promoting to staging.
- Offline package scripts validated against SHA256 (Compare-FileHash.ps1) prior to distribution.

## 4. Approval Record
| Date | Approver | Notes |
| --- | --- | --- |
| 2025-09-28 | IT Security Lead | Confirmed SSO flow with conditional access mappings |
| 2025-09-28 | IT Infrastructure Manager | Node hosting standards reviewed; pm2 + NSSM approach approved |

## 5. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial policy/hosting guide captured for Phase 0 checklist |
