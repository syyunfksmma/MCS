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
