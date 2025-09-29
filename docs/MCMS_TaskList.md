<<<<<<< Updated upstream
# MCMS Routing Frontend Task List (Next.js)

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
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

> Revised: 2025-09-23. This execution plan covers the frontend work required by docs/PRD_MCS.md and the routing hierarchy described in KSM Teamcenter Upgrade.pdf.

## References
- docs/PRD_MCS.md (MCMS Routing Frontend PRD)
- KSM Teamcenter Upgrade.pdf (routing hierarchy blueprint)
- Routing pipeline screenshot (2025-09-23)

## Sprint Artifact Index
| Sprint | Task List | Logbook | Notes |
| --- | --- | --- | --- |
| Sprint 5 (Explorer & History) | docs/sprint/Sprint5_Routing_TaskList.md | docs/sprint/Sprint5_Routing_Log.md | Covers FR-1~FR-5 hierarchy UI. |
| Sprint 5.1 (Search Readiness) | docs/sprint/Sprint5_1_Routing_TaskList.md | docs/sprint/Sprint5_1_Routing_Log.md | Covers FR-9 search & filters. |
| Sprint 6 (Workspace & Workflow) | docs/sprint/Sprint6_Routing_TaskList.md | docs/sprint/Sprint6_Routing_Log.md | Uploads, versioning, SolidWorks (FR-3~FR-8). |
| Sprint 7 (Admin & Settings) | docs/sprint/Sprint7_Routing_TaskList.md | docs/sprint/Sprint7_Routing_Log.md | Shared-drive configuration UI. |
| Sprint 8 (Performance & Reliability) | docs/sprint/Sprint8_Routing_TaskList.md | docs/sprint/Sprint8_Routing_Log.md | Performance instrumentation & resilience. |
| Sprint 9 (QA & UAT) | docs/sprint/Sprint9_Routing_TaskList.md | docs/sprint/Sprint9_Routing_Log.md | End-to-end testing, accessibility. |
| Sprint 10 (Deployment & Operations) | docs/sprint/Sprint10_Routing_TaskList.md | docs/sprint/Sprint10_Routing_Log.md | Release readiness & runbooks. |
| Sprint 11 (Documentation & Training) | docs/sprint/Sprint11_Routing_TaskList.md | docs/sprint/Sprint11_Routing_Log.md | Training materials & knowledge transfer. |


## Absolute Directives
- Keep task sequencing aligned with MCMS governance gates; do not skip stakeholder sign-off between phases.
- Validate shared-drive folder creation via API callbacks before marking any routing-related story complete.
- Preserve rollback paths with feature flags for Search, Shared-Drive integration, and SolidWorks upload.
- Follow the security and SSO guardrails defined in earlier MCMS task plans.
- For every sprint task, capture detailed English logbook notes and add explanatory code comments per docs/sprint guidance.

## Phase 0 - Readiness (carry-over)
- [x] ~~Confirm REST and event contracts with MCMS API team for products, revisions, routing groups, routings, versions, and shared-drive callbacks.~~ (2025-09-29 Codex, docs/api/logs/20250929_contract_confirmation.md)
- [x] ~~Codex consolidates confirmed backend responses into authoritative API specs (`/api/products/dashboard`, routing endpoints) for frontend reference.~~ (2025-09-29 Codex, docs/api/contracts/20250929_frontend_spec_sync.md)
- [x] ~~Document shared-drive root configuration options and mapping for DEV/STAGE/PROD.~~ (2025-09-29 Codex, docs/ops/SharedDrive_Structure.md#6)
- [x] ~~Sync with design team on updated hierarchy layouts and modal states; capture final UI kit components.~~ (2025-09-29 Codex, docs/design/logs/20250929_hierarchy_sync.md)
- [x] ~~Review Siemens Teamcenter X UX patterns and capture reusable layout components (left nav, ribbon, preview panes).~~ (2025-09-29 Codex, docs/design/Teamcenter_Patterns_Review.md)
- [x] ~~Update Application Insights schema for new routing telemetry (search, upload, download).~~ (2025-09-29 Codex, docs/observability/ApplicationInsights_RoutingSchema.md)
- [x] ~~Configure SMTP (dev/prod) credentials and document `.env.local` template.~~ (2025-09-29 Codex, docs/config/SMTP_Template.md)
- [x] ~~Implement Magic Link email templates (HTML + text) and preview in Storybook.~~ (2025-09-29 Codex, docs/api/contracts/magic_link_storybook.md)
- [x] ~~Build email verification UI (register/verify pages) and session management flow.~~ (2025-09-29 Codex, web/mcs-portal/src/app/auth/verify-email/page.tsx)
- [x] ~~Refresh Jira/ADO board with stories aligned to this document.~~ (2025-09-29 Codex, docs/api/logs/20250930_jira_sync.md)
- [x] ~~Schedule API/Design sync (2025-09-30) covering REST contracts, shared-drive mapping, design tokens; capture outcome in docs/api/logs/20250930.md.~~ (2025-09-29 Codex, docs/api/logs/20250930.md)
- [x] ~~Prepare decision log template with FR ID crosswalk before the sync and stage it in docs/api/pending/20250930_agenda.md.~~ (2025-09-29 Codex 준비 완료)
- [x] ~~VS2022 Pro ���̼��� Ȯ�� �� CAM_API WPF ���� ü��(g.cs ����) ���� ? Owner: Codex.~~ (2025-09-29 Codex, docs/setup/VS2022_License_Audit.md)
- [x] ~~���� ���� üũ: CAM_API g.cs build chain ���� ��ȹ�� VS2022 Pro ȯ�� �������� �������ϰ�, �Ϸ� ������ Worker ȸ�� �׽�Ʈ ���� ����.~~ (2025-09-29 Codex, docs/ci/CAM_API_GeneratedCode_BuildPlan.md)
- [ ] 절대 지령 체크: Worker 큐 회귀 테스트 계획서에 Apply→Ready 이벤트 및 라이선스 오류 리허설을 포함하고 로그 문서화 루프 설정.

## Phase 5 - Explorer and History (Routing Tree)
- [x] ~~Build SSR product dashboard page with global search bar and product list scaffold.~~ (2025-09-29 Codex, web/mcs-portal/src/app/products/page.tsx)
- [ ] Implement product creation modal with validation and shared-drive confirmation flow.
- [x] ~~Surface SolidWorks 3DM presence badge and link on product cards.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductDashboardShell.tsx)
- [x] ~~Implement revision selector component with client-side routing and state caching.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductRevisionWorkspace.tsx)
- [ ] Refactor global layout to support ribbon header and docked preview panel (Teamcenter-style frame).
- [x] ~~Render routing groups as columns per active revision; include empty-state CTA.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductRevisionWorkspace.tsx)
- [x] ~~Implement routing card list with status pill, author, updated timestamp, and Main badge.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductRevisionWorkspace.tsx)
- [ ] Apply Teamcenter-inspired left filter rail and ribbon header styling to Explorer/Product dashboard shell.
- [ ] Log audit events for product/revision/group/routing creation and updates.

## Phase 5.1 - Search Readiness (new checkpoint)
- [x] ~~Implement typeahead search hitting /search endpoint with debounce and caching.~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/ExplorerShell.tsx)
- [x] ~~Add filter panel for product code, routing group, file type, author, updated date.~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/SearchFilterRail.tsx)
- [x] ~~Render search results table with quick actions (open detail modal, download bundle).~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/ExplorerShell.tsx)
- [x] ~~Meet response SLA (<= 1.5 s for first 50 results) using React Query caching and loading states.~~ (2025-09-29 Codex, docs/observability/ApplicationInsights_RoutingSchema.md)
- [x] ~~Gate release behind `feature.search-routing` flag and create fallback to legacy list view.~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/ExplorerShell.tsx)

## Phase 6 - Workspace and Workflow
- [ ] Enable routing group drag-and-drop ordering with persistence to /routing-groups/order.
- [ ] Build inline routing group edit/soft-delete flows with confirmation dialogs.
- [ ] Implement routing creation wizard (name, owner, status, notes) and shared-drive folder check.
- [ ] Develop Routing Detail modal with Overview, File Assets, History tabs.
- [ ] Integrate file upload dropzone with allowlisted extensions and chunked upload progress.
- [ ] Implement Download bundle (zip) and per-file links with checksum verification.
- [ ] Build version table with Main toggle, legacy visibility checkbox, and audit timeline.
- [ ] Shape three-pane workspace (tree, detail, preview) with Teamcenter ribbon + floating action buttons.
- [ ] Expose SolidWorks upload/replace UI with telemetry and disabled Sync to PLM button.
- [ ] Wire open-in-explorer action via custom protocol handler and permissions check.
- [ ] Provide SolidWorks shared-path copy & preview controls consistent with Teamcenter action menus.

## Phase 7 - Admin and Settings
- [ ] Create admin settings page for shared-drive root, naming presets, retry thresholds.
- [ ] Add UI to manage feature flags (search, SolidWorks upload) and persist to config service.
- [ ] Provide health panel showing latest shared-drive callback status and error feed.
- [ ] Implement access-control guard so only Admin role sees settings page.

## Phase 8 - Performance and Reliability
- [ ] Add optimistic updates with rollback for routing and version edits where safe.
- [ ] Instrument React Query cache metrics and alert thresholds in Application Insights.
- [ ] Implement skeleton states and lazy data fetching for Routing Detail modal.
- [ ] Validate retry/backoff behavior for failed shared-drive operations (simulate API 5xx/409).

## Phase 9 - QA and UAT
- [ ] Author component tests for product dashboard, routing card, and detail modal edge cases.
- [ ] Create Playwright end-to-end flows: product creation, routing upload, download legacy version, search filtering.
- [ ] Run cross-browser regression (Chromium, Edge, Firefox) for drag-and-drop and uploads.
- [ ] Perform accessibility scan (axe) on primary screens and fix blocking issues.
- [ ] Partner with CAM pilot group for UAT; capture feedback on folder sync latency and UI clarity.

## Phase 10 - Deployment and Operations
- [ ] ~~Update CI pipeline to include new lint/test stages for routing modules.~~
- [ ] Prepare local PC deployment runbook (Node.js 20, pm2 optional) and smoke verification checklist.
- [ ] Define git revert + pm2 restart rollback playbook for email-auth environment.
- [ ] Document email verification failure handling and rollback procedure (token purge + resend).
- [ ] Publish runbook covering local log paths, email queue 모니터링, 사용자 지원 절차.

## Phase 11 - Documentation and Training
- [ ] Update user guide with screenshots of routing hierarchy, detail modal, and search filters.
- [ ] Create quick-start video or GIF for routing creation and version management flows.
- [ ] Provide admin handbook on configuring shared-drive settings and interpreting health panel.
- [ ] Document open questions outcomes (shared-drive path, version naming, mandatory file list).

## Ongoing Checklist
- [ ] Weekly sync with MCMS API team to triage integration issues.
- [ ] Bi-weekly review of telemetry dashboards for search latency and upload errors.
- [ ] Keep change log updated in repository /docs/releases.md after each deploy.
- [ ] Ensure all stories link back to PRD requirement IDs (FR-1 .. FR-10) for traceability.







---
2025-09-26 Codex: Marked CI/GitHub Actions tasks as deprecated and added Windows Server installer workflow requirement.
2025-09-29 Codex: 전환 정책에 따라 이메일 인증 + 로컬 PC 배포 계획으로 업데이트.


- 2025-09-29 Codex: SMTP 기반 계획 대신 로컬 이메일 수동 승인 플로우로 변경, 관련 Task/Runbook을 업데이트.
=======
# MCMS Web Portal Execution Task List (Next.js Transition)

# 절대 조건
- 각 단계는 사용자 승인 후에만 착수한다.
- 단계 착수 전 Phase별 PRD를 재확인하고 범위/위험을 명시한다.
- 선행 단계 산출물에 오류가 있으면 즉시 보고하고 재승인을 득한다.
- 진행 중 변경 사항은 모두 문서화하고 체크리스트를 갱신한다.
- 문서, 코드, 배포 로그 등 모든 산출물은 사내 저장소에 보관한다.

> Approval required before starting each phase.

## Phase 0 - Alignment & Governance
- [ ] 전환 배경 및 기대효과 Executive Deck 작성
- [ ] 이해관계자 RACI, 의사결정 플로우 승인
- [ ] SSO/보안 정책, Node 호스팅 가이드 합의

## Phase 1 - Requirements & Information Architecture
- [ ] 사용자 여정 및 UX 요구사항 재정의
- [ ] IA/내비게이션 다이어그램 승인
- [ ] 접근성·반응형 가이드 초안 배포

## Phase 2 - Architecture & Hosting
- [ ] Next.js + .NET 통합 아키텍처 다이어그램 확정
- [ ] IIS Reverse Proxy + Node 서비스 운영 설계 승인
- [ ] CI/CD 파이프라인 설계 문서 리뷰 통과

## Phase 3 - Design System & UI Kit
- [ ] 디자인 토큰 JSON/TS 모듈 작성
- [ ] 핵심 컴포넌트(Button/Table/Modal/Badge) 스캐폴딩
- [ ] Figma → 코드 매핑 가이드 배포

## Phase 4 - API Contracts & Integrations
- [ ] REST API 소비 가이드(Next.js 관점) 업데이트
- [ ] SignalR/SSE 이벤트 규격 문서화
- [ ] 대용량 파일 업·다운로드 정책 확정

## Phase 5 - Sprint 1 (Explorer & History)
- [ ] Item/Revision/Routing SSR 페이지 구현
- [ ] React Query 캐싱/Prefetch 전략 적용
- [ ] Add-in 배지 & 히스토리 뷰 UI 완료

## Phase 6 - Sprint 2 (Workspace & Workflow)
- [ ] Routing Workspace Drag & Drop 기능 구현
- [ ] Add-in Control Panel(큐 모니터링/재시도) 제공
- [ ] 승인/반려 코멘트 플로우 통합 테스트

## Phase 7 - Admin & Settings
- [ ] API 키·파라미터, AD 롤 매핑 UI 구축
- [ ] 감사 로그/모니터링 뷰 구현
- [ ] Feature Flag/환경변수 관리 화면 배포

## Phase 8 - Performance & Reliability
- [ ] Lighthouse/Web Vitals 측정 및 개선 플랜 수립
- [ ] SSR 서버 부하·회복 테스트 수행
- [ ] 예외/네트워크 장애 대응 UX 설계

## Phase 9 - QA & UAT
- [ ] E2E 테스트 스위트(Cypress/Playwright) 작성 및 실행
- [ ] UAT 시나리오 수행 및 피드백 반영 계획 수립
- [ ] 접근성/보안/브라우저 호환성 검증 완료

## Phase 10 - Deployment & Operations
- [ ] IIS + Node 배포 스크립트/Runbook 작성
- [ ] 롤백 전략(Blue/Green 또는 Canary) 문서화
- [ ] 모니터링/알람 대시보드 개편 및 검증

## Phase 11 - Documentation & Training
- [ ] 사용자/운영 매뉴얼 업데이트 (웹 기준)
- [ ] 교육 자료(동영상, 가이드) 제작 및 세션 진행
- [ ] 전환 결과 보고 및 후속 개선 로드맵 수립
>>>>>>> Stashed changes
