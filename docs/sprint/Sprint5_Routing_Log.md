# Sprint 5 Routing Logbook (Explorer & History)

## 절대 지령
- 본 문서는 1인 개발팀 운영 원칙을 따르며, 모든 실행 주체는 Codex이다.
- 모든 코드와 API 작성은 Codex가 수행하며, 자동화 작업 역시 Codex가 직접 검토한다.
- 작업 전후 활동은 영어 로그와 주석으로 남겨 추적성을 확보한다.
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별하고 이상 없을시에만 해당 task를 [x] 표시한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 신규 생성된 작업에서도 절대 지령을 동일하게 준수한다.
- 오류 개선을 위해 신규 TASK가 발생하면 TASK LIST를 새로 작성하거나 기존 LIST에 업데이트 한다.
- PoC 기준은 1인 기업 관점으로 계획한다.

> 작성 지침: 모든 항목은 영어로 작성한다. 로그는 날짜 오름차순으로 추가하고, 관련 PR/커밋/스크린샷 링크를 반드시 포함한다.

## Log Template
| Date (UTC) | Owner | Task ID | Summary (English) | Code Comments Added | Evidence Links |
| --- | --- | --- | --- | --- | --- |

## Sections
- **A1** Product dashboard skeleton
- **A2** Global search + list
- **A3** SolidWorks badge
- **B1** Revision selector
- **B2** Routing group columns
- **B3** Routing card component
- **C1** Audit event wiring
- **C2** Telemetry naming

> Example entry:
> | 2025-09-24 | Codex | B2 | Refactored grid layout to 4-column CSS Grid, added ARIA roles | `// explain responsive breakpoints` in `RoutingGroupColumn.tsx` | PR #123, screenshot link |




| 2025-09-23 | Codex | A1 | Created SSR product dashboard scaffold with mock data hydration and search shell | Referenced comment in src/components/products/ProductDashboardShell.tsx noting future API wiring | src/app/products/page.tsx, src/lib/products.ts, src/components/products/ProductDashboardShell.tsx |
| 2025-09-23 | Codex | A2 | Implemented Teamcenter-style ribbon, filter rail, and product search card grid while keeping client-side filtering only | Added comment on deferring API wiring in ProductDashboardShell.tsx | PR link TBD, screenshots in docs/extracted_images/PROLIM_TC13x_Presentation_v02 |
| 2025-09-23 | Codex | A3 | Added SolidWorks shared-path section with copy-to-clipboard control and spec-ready path fields | Commented on placeholder API handoff in ProductDashboardShell.tsx and updated ProductSummary types | PR link TBD, verify mock data in src/lib/products.ts |
| 2025-09-23 | Codex | B1/B2/B3 | Created revision workspace route with ribbon selector, Teamcenter-style routing columns, and status cards | Added comments on future group management and query sync in ProductRevisionWorkspace.tsx | PR link TBD, see src/app/products/[productCode]/workspace/page.tsx & src/components/products/ProductRevisionWorkspace.tsx |
| 2025-09-23 | Codex | B1/B2/B3 Notes | Recorded CSS grid breakpoints for group columns, URL sync fallback for revisions, and placeholder Main badge logic | Comments embedded in ProductRevisionWorkspace.tsx to explain layout + query handling | src/components/products/ProductRevisionWorkspace.tsx |
| 2025-09-23 | Codex | C1/C2 | Wired audit event seeding + SignalR telemetry mocks into Explorer Flow C data model | Added Flow C telemetry bridge comment near logTelemetry in web/mcs-portal/src/components/explorer/ExplorerShell.tsx | web/mcs-portal/src/types/explorer.ts, web/mcs-portal/src/lib/explorer.ts, web/mcs-portal/src/components/explorer/ExplorerShell.tsx |
