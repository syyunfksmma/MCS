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
# Phase5 Product & Explorer Enhancements (2025-09-29)

## 1. Product Creation Modal
- 단계: 기본정보 → 공유 드라이브 검증 → 요약.
- Validation: 제품 코드 중복, 필수 필드(담당자, 초기 상태) 확인.
- Shared Drive 확인: `GET /api/shared-drive/validate?path=...` 결과 실패 시 inline 경고.
- 성공 시 `POST /api/products` → Router push(`/products/{id}`) + 성공 토스트.
- 테스트: `tests/unit/products/ProductCreationModal.test.tsx`, Playwright 시나리오 `product-create.spec.ts`.

## 2. Ribbon Header & Docked Preview Layout
- 레이아웃 컴포넌트 `ProductWorkspaceLayout.tsx` 신설.
- CSS Grid: 리본 64px 고정, 콘텐츠 `grid-template-areas`로 tree/detail/preview 배치.
- Responsive: <1280px 시 preview 탭 전환, <960px 시 tree accordion.

## 3. Teamcenter-inspired Filter Rail & Styling
- Component: `ExplorerFilterRail.tsx` 확장, 리본과 색상 토큰(`teamcenterRibbon`) 적용.
- Sticky behavior: `position: sticky; top: 64px`.
- Token 업데이트: `styles/tokens.ts`에 Ribbon/Filter 색상 추가.

## 4. Audit Logging for CRUD Operations
- Hook `useRoutingAuditLogger` → creation/update 시 `POST /api/audit/log` 호출.
- 이벤트 스키마: entityType, entityId, action, userId, metadata.
- Storage: Application Insights custom event + `docs/observability/Audit_EventCatalog.md` 업데이트 예정.

## 5. SolidWorks Shared-Path Copy & Preview Controls
- UI: 카드/상세 모달에 `Copy Path` 버튼과 `Preview` 링크 추가.
- Copy 기능: `navigator.clipboard.writeText(path)` 실패 시 fallback modal.
- Preview: Stage에서 3DM viewer(iframe) 연결, 미지원 시 설명 팝업.
- Telemetry: `solidworks_path_copy` 이벤트 기록.

## 타임라인 & 체크리스트
- Wave17 S41~S45에서 문서화 완료 로그 기록.
- 구현 후 Storybook 예제 추가 (`ProductCreationModal.stories.tsx`).

