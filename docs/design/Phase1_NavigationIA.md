# Navigation & Information Architecture Approval Summary (Phase 1)

## 1. Sitemap Overview
`
MCMS Web Portal
├─ Dashboard
│  ├─ SLA Overview
│  └─ Smoke CI Status
├─ Explorer
│  ├─ Item Search
│  ├─ Revision Tree
│  └─ Routing Detail
│     ├─ Files & Checksums
│     ├─ History Timeline
│     └─ Quick Actions (Approve/Reject, Offline Package)
├─ Workflow
│  ├─ Approval Queue
│  └─ Comments Archive
├─ Administration
│  ├─ Feature Flags
│  ├─ Roles & Permissions
│  └─ System Health
└─ Support
   ├─ Runbooks
   └─ Training
`

## 2. Navigation Principles
- Primary navigation uses left rail with collapsible sections; Explorer defaults on login for CAM users.
- Contextual ribbon (ExplorerRibbon) exposes quick filters; SearchFilterRail anchors to right side for advanced queries.
- Breadcrumbs reflect Item › Revision › Routing hierarchy to support deep linking.

## 3. IA Decision Log
| Decision | Outcome | Notes |
| --- | --- | --- |
| Dashboard MVP scope | Include SLA + smoke cards only | Prevent clutter pre-UAT; align with Sprint5 SLA UI |
| Explorer detail layout | Retain dual-column design with file metadata + action pane | Validated with CAM & QA stakeholders |
| Workflow module | Integrate approvals + comment history, postpone task assignment matrix | Dependency on future ERP sync |

## 4. Approval Record
- Workshop date: 2025-09-28
- Participants: Product Owner, UX Designer, QA Lead, Operations Lead
- Artifacts: Figma file MCMS_Web_Nav_v2.fig stored in design share; exported PNG saved at rtifacts/design/MCMS_Web_Nav_v2.png.

## 5. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Documented IA sitemap and approval notes for Phase 1 checklist |
