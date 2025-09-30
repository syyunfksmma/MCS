# Ribbon & Filter Alignment Plan (2025-09-30)
- 작성: Codex
- 대상: Sprint 10 Flow R/F/B (ExplorerRibbon, SearchFilterRail 토글, 브랜딩).

## 1. Ribbon 그룹 재구성 (Flow R1)
| 그룹 | 버튼 | API | 비고 |
| --- | --- | --- | --- |
| Routing | New, Duplicate, Archive | POST /api/routings, POST /api/routings/{id}/duplicate, POST /api/routings/{id}/archive | Duplicate → 신규 코드 입력 모달 |
| Approval | Request, Approve, Reject | POST /api/routings/{id}/approval/request, /approve, /reject | 역할 제한: Reviewer 이상 |
| Add-in | Queue Job, Retry, Cancel | POST /api/addin/jobs, POST /api/addin/jobs/{id}/retry, POST /api/addin/jobs/{id}/cancel | 상태 배지와 연동 |

- Optimistic update: Mutation 성공 시 Explorer 데이터 invalidate.
- 실패 시 토스트 + rollback (React Query mutation.onError 활용).

## 2. Filter Rail 토글 동기화 (Flow F1/F2)
- 상태 소스: React Query 필터 쿼리(['search','filters']).
- recentOnly → IndexedDB recent_routings 저장 50개.
- slaOnly → 서버 쿼리 파라미터 slaExceeded=true.
- Reset: 로컬 캐시/파라미터 초기화, Shakeout Log 체크.
- SLA 배지 텍스트: i18n key ilters.slaBadge, 값 SLA {value}ms / 목표 {target}ms.

## 3. 브랜딩 & 접근성 (Flow B)
- 색상 토큰: theme/tokens.ts → primary #0078A6, secondary #22B8CF, accent #FACC15.
- 글꼴: Siemens Sans (Fallback: Segoe UI, Noto Sans KR).
- Ribbon 버튼 스타일: 높이 40px, radius 6px, hover 색상 #0F8DC6.
- 포커스 링: outline 2px solid #FACC15, offset 2px.
- Storybook: 테마 스위처, 시각 회귀 스냅샷.
- 접근성: axe + 수동 키보드 탭 순서, 결과 docs/accessibility/Sprint10_Report.md 기록.

## 4. 구현 순서
1. Ribbon 버튼 맵 재정의 및 RibbonAction enum 분리.
2. 신규 API 핸들러 훅(useRoutingActions, useApprovalActions, useAddinActions) 작성.
3. FilterRail props 확장(recentOnly, slaOnly) 및 ExplorerShell 상태 관리.
4. Theme 토큰 적용 후 CSS 모듈 업데이트.
5. Storybook + Playwright 회귀 테스트 실행.

## 5. TODO
- [ ] ExplorerRibbon 버튼/그룹 재작성.
- [ ] Approval/Add-in API 통합 및 토스트 처리.
- [ ] SearchFilterRail ↔ ExplorerShell 상태 동기화.
- [ ] IndexedDB recentRouting 캐시 구현.
- [ ] 테마 토큰/스토리북 업데이트.
- [ ] 접근성 리포트 작성.
