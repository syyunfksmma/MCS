# QA Shakeout Log
- Created: 2025-09-30 (Codex)
- Purpose: Track defects and regression findings during accelerated Sprint 8~10 PoC window.

## Logging Template
| Date | Component | Issue | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |

> Update after each daily QA sweep. Strike through resolved issues, append retest results.

## Daily Smoke Checklist
- [ ] Playwright smoke: `npm run test:e2e -- --grep @smoke`
- [ ] Vitest unit core: `npm run test:unit`
- [ ] k6 SLA check: `npm run perf:k6 -- --vus 50 --duration 2m`
- [ ] Accessibility spot check: `npm run test:axe`
- [ ] Review SignalR reconnect logs (devtools console)

### 2025-09-30 Day0
| Date | Component | Issue | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| 2025-09-30 | Dashboard API | Aggregation 설계 초안 작성 완료, 구현 착수 대기 | 설계 완료 | Codex | docs/api/pending/Dashboard_Aggregation_API_Draft.md |
| 2025-09-30 | SignalR Presence | 허브/클라이언트 스펙 문서화 완료, 구현 착수 대기 | 설계 완료 | Codex | docs/api/pending/SignalR_Hub_Spec.md |
| 2025-09-30 | Ribbon/Filter | 정렬/토글/브랜딩 정합성 플랜 수립, 코드 구현 대기 | 설계 완료 | Codex | docs/frontend/Ribbon_Filter_Alignment.md |
| 2025-09-30 | 3D Viewer | 메뉴 확장/3D 뷰어 계획 수립, 구현 대기 | 설계 완료 | Codex | docs/frontend/Menu_Expansion_Implementation.md |
