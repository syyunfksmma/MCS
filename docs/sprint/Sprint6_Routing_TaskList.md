# Sprint 6 Routing Task List (Workspace & Workflow)

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
- 목적: FR-3~FR-8을 충족하는 워크스페이스 경험을 구축한다.
- 기간: Sprint 6 (2025-10-12 ~ 2025-10-25) 가정.
- 산출물: 라우팅 그룹 관리, 상세 모달, 업로드/버전 관리, SolidWorks 처리, Explorer 연동.
- 로그 지침: 모든 활동은 docs/sprint/Sprint6_Routing_Log.md에 영어로 작성하고, 복잡한 로직에는 영어 주석을 삽입한다.

## 2. 작업 흐름 및 체크리스트
### Flow G. 라우팅 그룹 관리
- [x] G1. Drag-and-drop ordering with `/routing-groups/order` persistence.
  - UX: Match Teamcenter ribbon + selection indicators in the routing tree.
  - Log: Sprint6_Routing_Log.md -> 2025-09-23 G1 entry (mock API payload & rollback notes).
  - Comment: ExplorerShell.tsx handleReorder 주석으로 optimistic update + rollback 전략 명시.
- [ ] G2. Inline edit & soft delete 패턴 도입.
  - Log: Describe modal/inline validations.
  - Comment: Explain soft delete state flags.

### Flow H. 라우팅 생성 플로우
- [ ] H1. Routing Creation Wizard (name, owner, status, notes, shared-drive check).
  - Log: Outline multi-step UI and API handshake.
  - Comment: Note concurrency handling for folder creation.
- [ ] H2. Routing Detail Modal (Overview/File Assets/History 탭).
  - Layout: Maintain three-pane structure (tree, detail, preview) consistent with Teamcenter X.
  - Log: Summarize component structure and state segregation.
  - Comment: Document tab prefetch strategy.

### Flow I. 파일 업로드 및 버전 관리
- [ ] I1. Allowlisted drag/drop uploader with chunking + progress.
  - Log: Report chunk size, retry policy, and server response codes.
  - Comment: Explain chunk assembly logic.
- [ ] I2. Download bundle + per-file download with checksum verification.
  - Log: Note bundling endpoint and checksum algorithm.
  - Comment: Document guardrails for incomplete downloads.
- [ ] I3. Version table (`Main` toggle, legacy visibility checkbox, audit timeline).
  - Log: Detail version metadata structure (`version.json`).
  - Comment: Explain UI state transitions when toggling.

### Flow J. SolidWorks & Explorer 연동
- [ ] J1. SolidWorks upload/replace UI with telemetry & disabled Sync to PLM button.
  - UX: Include Teamcenter-style action menu with Copy Path and Preview toggles.
  - Log: Describe telemetry fields and disabled state reason.
  - Comment: Annotate placeholder button with future integration note.
- [ ] J2. Open-in-explorer protocol handler wiring + permission check.
  - Log: Record protocol scheme, environment guard.
  - Comment: Explain security prompt handling.

## 3. 검증
- Chunked upload failure 시나리오 재현 및 로그에 대응 전략 기록.
- Routing Detail modal에 대한 Playwright regression 테스트 링크 첨부.

## 4. 승인 조건
- QA 확인: 업로드/다운로드/버전 토글 실패 없이 동작.
- 보안 리뷰: 프로토콜 핸들러 및 파일 확장자 허용 목록 확인.




