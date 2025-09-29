# Phase6 Workspace Core Implementation Plan (2025-09-29)

## 1. Drag-and-Drop Ordering with Persistence
- API: `PUT /api/routing-groups/order` (payload: groupIds[]) 새 구조 정의.
- FE: `components/workspace/WorkspaceBoard.tsx`에서 `@dnd-kit` 활용, drop 이벤트마다 debounce 250ms 뒤 API 호출.
- 실패 시 Optimistic update 롤백 + 토스트 노출.
- Telemetry: `telemetry/workspace.ts`에 `routing_group_reordered` 이벤트 추가.

## 2. Inline Edit & Soft Delete 흐름
- 편집: 인라인 입력 후 `PATCH /api/routing-groups/{id}` 호출, Validation(중복 이름) 처리.
- Soft delete: `PUT /api/routing-groups/{id}/archive` 추가, confirm 모달(`WorkspaceConfirmDialog`).
- 감사 로그: `ApplicationInsights` custom event `routing_group_archived`.

## 3. Routing Creation Wizard
- Step 구성: 기본정보→Shared Drive 검사→요약/생성.
- Shared Drive 체크 API: `GET /api/shared-drive/validate?path=...` 응답 기반.
- Wizard 상태 관리: `zustand` store `useRoutingWizardStore` 도입.
- 완료 후 `POST /api/routings` + `router.replace`로 새 detail 모달 열기.

## 4. Routing Detail Modal
- 탭 구성: Overview, File Assets, History.
- Data fetch: `useQuery(['routing', id], fetchRoutingDetail)` + prefetch attachments.
- History: Timeline 컴포넌트 재사용(`components/history/Timeline.tsx`).
- 접근성: Tab key trap, ARIA labelledby 적용.

## 5. File Upload Dropzone (Chunked)
- Allowlist: `.esp,.nc,.stl,.mprj,.gdml,.json`.
- 클라이언트: `@uppy/core` + chunk 사이즈 5MB, 동시 업로드 3개.
- 서버: `POST /api/routings/{id}/files/chunk` → 완료시 `Finalize` API 호출.
- 진행률 표시: `UploadProgressPanel`에서 SSE 이벤트 연동, 실패 시 재시도 버튼.

## 테스트/검증
- 유닛: `tests/unit/workspace/WorkspaceBoard.test.tsx`, `RoutingWizard.test.tsx` 추가.
- E2E: Playwright `routing-workspace.spec.ts`에 drag/drop & upload 시나리오 포함.
- 로그: `docs/logs/Timeline_2025-09-29.md` Wave16 S21~S25에 기록.

## 후속 체크리스트
- API 계약 업데이트를 `docs/api/contracts/routing_workspace_v1.md`로 정리.
- UX 시안(팀센터 스타일) 반영하여 Stage 빌드 테스트 예정.
