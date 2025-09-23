# Sprint 5 Routing Task List (Explorer & History)

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

## 1. 개요
- 목적: PRD FR-1~FR-4 요구사항을 충족하는 제품/라우팅 탐색 UI를 구축한다.
- 시간범위: Sprint 5 (2025-09-24 ~ 2025-10-04) 예정.
- 산출물: 제품 대시보드 SSR 페이지, Revision Workspace 컬럼 뷰, 감사 로그 연동.
- 기록 지침: 모든 작업자는 docs/sprint/Sprint5_Routing_Log.md 파일에 영어로 세부 로그를 남기고, 코드에는 기능 목적이 드러나는 영어 주석을 추가해야 한다.

## 2. 작업 흐름 및 체크리스트
### Flow A. 제품 계층 초기화
- [x] A1. SSR Product Dashboard 골격 구현 (`app/products/page.tsx`).
  - Log: Sprint5_Routing_Log.md > 섹션 A1 (Include route, caching strategy, data mocks).
  - Code Comment: Explain data-fetching rationale near React Query `useQuery` setup.
- [x] A2. Global Search Bar + Product card grid styled like Teamcenter X (`ProductSearchBar`, `ProductList`).
  - Log: Document accessibility considerations and keyboard shortcuts.
  - Design: Implement left filter rail + ribbon header to mirror Teamcenter X patterns.
  - Code Comment: Comment on debounce interval justification.
- [x] A3. SolidWorks 3DM 상태 배지 렌더링.
  - Log: Capture contract with `/products/{code}/3dm/status` endpoint.
  - UX: Add copy-to-clipboard control for shared drive path, matching Teamcenter action menus.
  - Code Comment: Note mapping between API status and badge colors.

### Flow B. Revision Workspace 구성
- [x] B1. Revision Selector 컴포넌트 구현 (client-side state + URL sync).
  - Log: Describe state management choice and fallback behavior.
  - Code Comment: Document how stale queries are invalidated.
- [x] B2. Routing Group 컬럼 레이아웃 (drag placeholder 없음) 및 빈 상태 메시지.
  - Log: Outline CSS grid decisions and responsive breakpoints.
  - Code Comment: Explain data structure for group ordering.
- [x] B3. Routing 카드 컴포넌트 (상태 pill, Main 배지, author/time stamp).
  - Log: Summarize prop typing and formatting utilities.
  - Code Comment: Note logic for Main badge vs legacy.

### Flow C. 감사 이벤트 파이프라인
- [x] C1. Product/Revision/Group/Routing 생성 시 감사 이벤트 트리거 연동.
  - Log: Sprint5_Routing_Log.md -> 2025-09-23 C1/C2 기록에 mock payload/telemetry 정보 기록.
  - Code Comment: ExplorerShell.tsx logTelemetry 함수 주석으로 Flow C telemetry bridge 설명.
- [x] C2. Telemetry 대시보드(Insights)에서 필터 가능한 이벤트 네이밍 협의.
  - Log: Sprint5_Routing_Log.md -> 2025-09-23 C1/C2 로 naming/telemetry 정의 정보 추가.
  - Code Comment: ExplorerShell.tsx logTelemetry 함수 노출으로 instrumentation 추진.

## 3. 검증
- SSR 렌더 성능 측정 (TTFB <= 2s) 결과를 로그 파일에 링크한다.
- 주요 사용자 시나리오(제품 생성, Revision 전환)를 데모 동영상으로 캡처하여 첨부 링크 기재.

## 4. 승인 조건
- 모든 체크 항목 완료 + 로그/주석 증빙 확인.
- Design/QA sign-off 후 Sprint 리뷰에서 데모.





