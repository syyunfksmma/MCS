# MCMS Next.js Transition Executive Summary Deck

## 1. Program Background
- Legacy MCMS Explorer UI couples WinForms front-end with CAM add-ins, increasing change lead time and causing audit gaps.
- Production support relies on manual package transfers and inconsistent offline procedures.
- Stakeholders approved a web-first migration (Next.js + .NET) to align with manufacturing digital twin roadmap.

## 2. Scope Snapshot (Sprint 0 Baseline)
| Domain | In Scope | Out of Scope (For Now) |
| --- | --- | --- |
| Explorer UX | Item/Revision/Routing browsing, history timeline, search filters, quick actions | CAD authoring; full 3D preview beyond lightweight STL |
| Workflow | Approve/Reject with comments, SLA tracking, routing rollbacks | ERP work-order sync automation |
| File Delivery | Offline package generation, checksum verification, shared drive mirroring | Legacy FTP mirrors |
| Monitoring | Smoke CI, auth monitoring, Grafana dashboards | SAP integration KPIs |

## 3. Expected Outcomes (12-week horizon)
1. Cut CAM program release lead time by **30%** via automated packaging and approvals.
2. Reduce routing version mismatch incidents to **zero** through hash validation and runbook controls.
3. Provide on-call visibility with unified smoke/auth dashboards, decreasing recovery time to **<15 minutes**.

## 4. Decision & Dependency Highlights
- Exec Sponsor (Manufacturing GM) endorses phased rollout; SteerCo cadence: monthly.
- Requires IT security sign-off on SSO, TLS, and Node hosting policies.
- Needs cross-team agreement on shared drive taxonomy (resolved in Sprint 8 deliverables).

## 5. Milestone Roadmap Overview
| Wave | Focus | Target Completion |
| --- | --- | --- |
| Wave 1 | Phase 0-2 governance, architecture baselines | 2025-10-03 |
| Wave 2 | Explorer + Workflow MVP (Sprints 5-7) | 2025-10-31 |
| Wave 3 | QA/UAT (Sprints 8-9) | 2025-11-21 |
| Wave 4 | Deployment & Training (Sprints 10-12) | 2025-12-19 |

## 6. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial executive summary deck drafted for Phase 0 checkbox completion |
