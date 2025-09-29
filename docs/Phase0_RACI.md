# Stakeholder RACI & Decision Track (MCMS Web Transition)

## 1. RACI Matrix
| Deliverable | Sponsor (Manufacturing GM) | Product Owner (CAM Lead) | Technical Lead (IT Infra) | Data Governance | Operations Support | Quality Assurance |
| --- | --- | --- | --- | --- | --- | --- |
| Phase approvals & funding | A | C | I | I | I | I |
| UX requirements & backlog | C | R | C | I | I | A |
| Architecture & hosting | I | C | R | C | C | I |
| Automation & CI scripts | I | C | R | I | C | C |
| QA/UAT sign-off | I | C | C | I | C | R |
| Deployment & rollout | A | C | R | I | R | C |
| Operations runbook | I | C | C | I | R | C |

Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed.

## 2. Decision Track & Governance Cadence
- **SteerCo (Monthly)** — Sponsor + Product Owner + Technical Lead. Approves scope changes, budget adjustments, and release gates.
- **Working Group (Weekly)** — Product Owner, Technical Lead, Operations, QA. Reviews sprint commitments, risk burn-down, and monitors automation health.
- **Change Advisory (Ad-hoc, ≤48h notice)** — Technical Lead chairs; focuses on emergency fixes, SSO/runtime configuration changes.
- **Post-Launch Review (Quarterly)** — Sponsor leads; measures KPI outcomes, decides investment for future phases.

## 3. Sign-off Status
| Item | Status | Notes |
| --- | --- | --- |
| RACI Matrix | Approved | Endorsed by SteerCo on 2025-09-28 (email ref: STEER-20250928-01) |
| Governance cadence | Approved | Change advisory integrated with IT CAB calendar |
| Decision authority map | Approved | Stored in PMO Confluence (link mirrored in docs/Phase0_Alignment.md) |

## 4. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial RACI + decision track compiled for Phase 0 checklist |
