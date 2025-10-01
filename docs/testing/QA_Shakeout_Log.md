# QA Shakeout Log
- Created: 2025-09-30 (Codex)
- Purpose: Track defects and regression findings during accelerated Sprint 8~10 PoC window.

## Logging Template
| Date | Component | Issue | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |

> Update after each daily QA sweep. Strike through resolved issues, append retest results.

## Daily Smoke Checklist
- [ ] Playwright smoke: `npm run test:e2e -- --grep @smoke` (2025-10-01 실패 - @smoke 태그 미정의로 실행 불가)
- [ ] Vitest unit core: `npm run test:unit` (2025-10-01 실패 - jsdom `getComputedStyle` 미구현 및 clipboard mock 미호출)
- [ ] k6 SLA check: `npm run perf:k6 -- --vus 50 --duration 2m` (2025-10-01 실패 - scripts/performance/k6-workspace.js 15:26 구문 오류)
- [ ] Accessibility spot check: `npm run test:axe` (2025-10-01 실패 - Playwright 브라우저 다운로드 SSL 차단)
- [ ] Review SignalR reconnect logs (devtools console)

### 2025-09-30 Day0
| Date | Component | Issue | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| 2025-09-30 | Dashboard API | Aggregation 설계 초안 작성 완료, 구현 착수 대기 | 설계 완료 | Codex | docs/api/pending/Dashboard_Aggregation_API_Draft.md |
| 2025-09-30 | SignalR Presence | 허브/클라이언트 스펙 문서화 완료, 구현 착수 대기 | 설계 완료 | Codex | docs/api/pending/SignalR_Hub_Spec.md |
| 2025-09-30 | Ribbon/Filter | 정렬/토글/브랜딩 정합성 플랜 수립, 코드 구현 대기 | 설계 완료 | Codex | docs/frontend/Ribbon_Filter_Alignment.md |
| 2025-09-30 | 3D Viewer | 메뉴 확장/3D 뷰어 계획 수립, 구현 대기 | 설계 완료 | Codex | docs/frontend/Menu_Expansion_Implementation.md |

### 2025-10-01 Day1
| Date | Component | Issue | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| 2025-10-01 | Playwright Smoke | @smoke 태그 미정의로 테스트 수집 실패 | 실패 | Codex | `npm run test:e2e -- --grep "@smoke"` → No tests found. 태그 정의 필요 |
| 2025-10-01 | Vitest Core | jsdom `getComputedStyle` 미구현 및 clipboard mock 실패로 단위 테스트 실패 | 실패 | Codex | `npm run test:unit` → RoutingDetailModal, ProductDashboardShell 케이스 실패 |
| 2025-10-01 | k6 SLA | k6 스크립트 문법 오류로 실행 불가 | 실패 | Codex | `npm run perf:k6 -- --vus 50 --duration 2m` → line 15:26 syntax error |
| 2025-10-01 | Accessibility Axe | Playwright 브라우저 설치 SSL 차단 | 실패 | Codex | `npm run test:axe` → self-signed certificate 에러, `npx playwright install` 미완료 |
