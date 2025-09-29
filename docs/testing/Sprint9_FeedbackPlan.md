# Sprint 9 Feedback Collection Plan — Folder Sync Latency & UI Clarity

## Channels
- Teams channel `#mcms-uat` with pinned form (Microsoft Forms) capturing latency observations.
- In-app feedback banner (storybook variant) pointing to `/feedback` route (feature flag `feature.feedback-banner`).

## Survey Questions
1. "How long did offline package sync take after approval?" (dropdown: <5m, 5-10m, >10m)
2. "Was the Explorer ribbon/quick menu self-explanatory?" (Likert 1-5)
3. Free-form comments (prompt for confusing labels, missing data).

## Data Handling
- Responses exported daily to `artifacts/testing/feedback/sprint9_feedback.csv` via script `scripts/automation/export-feedback.ps1` (to be scheduled nightly).
- Severity tagging: Codex triage within 24h; backlog items created in `MCMS_TaskList.md` (Phase 5+).

## Mapping to Backlog
| Feedback Area | Backlog Ticket | Status |
| --- | --- | --- |
| Offline package latency >10m | OPS-212 | Open |
| Ribbon label confusion | UX-189 | In review |

## Timeline
- Launch survey: 2025-10-03 alongside UAT session.
- Close survey: 2025-10-07.
- Summary deck for SteerCo: 2025-10-08.

## Owners
- Collection: Codex (automation + triage)
- Reviewers: Product Owner, Ops Support Lead
- Reporting: QA Lead consolidates into Sprint9_Log.md.
