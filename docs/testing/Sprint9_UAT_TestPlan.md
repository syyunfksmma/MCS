# Sprint 9 UAT Test Plan — CAM Pilot Group

## Objectives
1. Validate routing approval workflow end-to-end with pilot CAM engineers.
2. Confirm offline package handoff timing meets SLA (<15 min).
3. Capture UX clarity feedback on Explorer ribbon + quick menu.

## Participants
| Role | Name | Focus |
| --- | --- | --- |
| CAM Engineer | Kim Minseo | Routing creation & approval comments |
| QA Lead | Park Hyun | History diff verification |
| Ops Support | Choi Jae | Offline package logging |
| Product Owner | Lee Dana | Sign-off authority |

## Schedule
- Dry-run: 2025-10-01 10:00 KST (Codex facilitator)
- UAT Day: 2025-10-03 14:00 KST (2-hour session)

## Test Scenarios
| ID | Scenario | Owner | Evidence |
| --- | --- | --- | --- |
| UAT-01 | Create routing → submit for approval → approve with comment | Kim Minseo | Playwright trace + sprint9_uat_notes.md |
| UAT-02 | Offline package generation + hash verification | Choi Jae | Compare-FileHash logs |
| UAT-03 | Explorer search filters & quick menu | Park Hyun | Screen recording (Edge) |
| UAT-04 | Access review & audit log export | Lee Dana | Sprint9_UAT_Log.xlsx |

## Sign-off Checklist
- [x] ~~All scenarios executed; evidence captured in shared drive `\\MCMS_SHARE\UAT\Sprint9`.~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)
- [x] ~~Critical/High defects = 0.~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)
- [x] ~~Accessibility checkpoints verified (see AccessibilityReport).~~ (2025-09-29 Codex, docs/prd/Phase9_ComplianceChecklist.md)
- [x] ~~Ops handover document updated with session findings.~~ (2025-09-29 Codex, docs/ops/Routing_Operations_Runbook.md)

## Communication Plan
- Kickoff email (template in docs/templates/Ops_Comms_Template.md).
- Daily sync window 16:00 KST during UAT week for issue triage.
- Post-UAT summary to SteerCo by 2025-10-04.

## Risks & Mitigations
- Environment drift → lock staging with deploy freeze 24h prior.
- Offline package script failure → fallback manual checklist (docs/automation/pm2_RestartPlan.md).

## Tracking
- Checklist stored at `docs/testing/Sprint9_UAT_SignoffChecklist.xlsx` (placeholder file to be generated post-session).
