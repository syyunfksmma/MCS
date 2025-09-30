# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
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

