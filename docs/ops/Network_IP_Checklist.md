# Network IP/FQDN Checklist — 2025-09-29

| Environment | FQDN | IP | Notes |
| --- | --- | --- | --- |
| DEV | mcms-dev.corp | 10.10.20.45 | VPN only, local testing. |
| STAGE | mcms-stage.corp | 10.10.30.52 | Mirrors PROD ACL, limited group. |
| PROD | mcms.corp | 10.10.40.60 | Load-balanced VIP. |
| API PROD | mcms-api.corp | 10.10.40.61 | Dedicated for Kestrel reverse proxy. |

## Validation Tasks
- DNS A record entries confirmed via `Resolve-DnsName`.
- Firewall ports 443/5100 opened between IIS and API tier.
- Update `docs/ops/Network_IP_Checklist.xlsx` monthly (Ops owner).

> 작성: 2025-09-29 Codex
