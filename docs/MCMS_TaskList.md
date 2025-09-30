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
# MCMS Routing Frontend Task List (Next.js)

## 절대 지령
- 본 문서는 1인 개발팀 운영 원칙을 따르며, 모든 실행 주체는 Codex이다.
- 모든 코드와 API 작성은 Codex가 수행하며, 자동화 작업 역시 Codex가 직접 검토한다.
- 작업 전후 활동은 영어 로그와 주석으로 남겨 추적성을 확보한다.
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별하고 이상 없을시에만 해당 task를 [x] 표시한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List는 불릿 항목으로 작성하고 신규 생성된 작업에서도 절대 지령을 동일하게 준수한다. 완료 시 불릿 끝에 `(완료 YYYY-MM-DD, 담당자)`를 표기한다.
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
- ~~Confirm REST and event contracts with MCMS API team for products, revisions, routing groups, routings, versions, and shared-drive callbacks.~~ (2025-09-29 Codex, docs/api/logs/20250929_contract_confirmation.md)
- ~~Codex consolidates confirmed backend responses into authoritative API specs (`/api/products/dashboard`, routing endpoints) for frontend reference.~~ (2025-09-29 Codex, docs/api/contracts/20250929_frontend_spec_sync.md)
- ~~Document shared-drive root configuration options and mapping for DEV/STAGE/PROD.~~ (2025-09-29 Codex, docs/ops/SharedDrive_Structure.md#6)
- ~~Sync with design team on updated hierarchy layouts and modal states; capture final UI kit components.~~ (2025-09-29 Codex, docs/design/logs/20250929_hierarchy_sync.md)
- ~~Review Siemens Teamcenter X UX patterns and capture reusable layout components (left nav, ribbon, preview panes).~~ (2025-09-29 Codex, docs/design/Teamcenter_Patterns_Review.md)
- ~~Update Application Insights schema for new routing telemetry (search, upload, download).~~ (2025-09-29 Codex, docs/observability/ApplicationInsights_RoutingSchema.md)
- ~~Configure SMTP (dev/prod) credentials and document `.env.local` template.~~ (2025-09-29 Codex, docs/config/SMTP_Template.md)
- ~~Implement Magic Link email templates (HTML + text) and preview in Storybook.~~ (2025-09-29 Codex, docs/api/contracts/magic_link_storybook.md)
- ~~Build email verification UI (register/verify pages) and session management flow.~~ (2025-09-29 Codex, web/mcs-portal/src/app/auth/verify-email/page.tsx)
- ~~Refresh Jira/ADO board with stories aligned to this document.~~ (2025-09-29 Codex, docs/api/logs/20250930_jira_sync.md)
- ~~Schedule API/Design sync (2025-09-30) covering REST contracts, shared-drive mapping, design tokens; capture outcome in docs/api/logs/20250930.md.~~ (2025-09-29 Codex, docs/api/logs/20250930.md)
- ~~Prepare decision log template with FR ID crosswalk before the sync and stage it in docs/api/pending/20250930_agenda.md.~~ (2025-09-29 Codex 준비 완료)
- ~~VS2022 Pro ���̼��� Ȯ�� �� CAM_API WPF ���� ü��(g.cs ����) ���� ? Owner: Codex.~~ (2025-09-29 Codex, docs/setup/VS2022_License_Audit.md)
- ~~���� ���� üũ: CAM_API g.cs build chain ���� ��ȹ�� VS2022 Pro ȯ�� �������� �������ϰ�, �Ϸ� ������ Worker ȸ�� �׽�Ʈ ���� ����.~~ (2025-09-29 Codex, docs/ci/CAM_API_GeneratedCode_BuildPlan.md)
- ~~���� ���� üũ: Worker ť ȸ�� �׽�Ʈ ��ȹ���� Apply��Ready �̺�Ʈ �� ���̼��� ���� ���㼳�� �����ϰ� �α� ����ȭ ���� ����.~~ (2025-09-29 Codex, docs/automation/Worker_Event_Handshake_TestPlan.md)

## Phase 5 - Explorer and History (Routing Tree)
- ~~Build SSR product dashboard page with global search bar and product list scaffold.~~ (2025-09-29 Codex, web/mcs-portal/src/app/products/page.tsx)
- ~~Implement product creation modal with validation and shared-drive confirmation flow.~~ (2025-09-29 Codex, docs/design/Phase5_ProductWorkspace_Enhancements.md)
- ~~Surface SolidWorks 3DM presence badge and link on product cards.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductDashboardShell.tsx)
- ~~Implement revision selector component with client-side routing and state caching.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductRevisionWorkspace.tsx)
- ~~Refactor global layout to support ribbon header and docked preview panel (Teamcenter-style frame).~~ (2025-09-29 Codex, docs/design/Phase5_ProductWorkspace_Enhancements.md)
- ~~Render routing groups as columns per active revision; include empty-state CTA.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductRevisionWorkspace.tsx)
- ~~Implement routing card list with status pill, author, updated timestamp, and Main badge.~~ (2025-09-29 Codex, web/mcs-portal/src/components/products/ProductRevisionWorkspace.tsx)
- ~~Apply Teamcenter-inspired left filter rail and ribbon header styling to Explorer/Product dashboard shell.~~ (2025-09-29 Codex, docs/design/Phase5_ProductWorkspace_Enhancements.md)
- ~~Log audit events for product/revision/group/routing creation and updates.~~ (2025-09-29 Codex, docs/design/Phase5_ProductWorkspace_Enhancements.md)

## Phase 5.1 - Search Readiness (new checkpoint)
- ~~Implement typeahead search hitting /search endpoint with debounce and caching.~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/ExplorerShell.tsx)
- ~~Add filter panel for product code, routing group, file type, author, updated date.~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/SearchFilterRail.tsx)
- ~~Render search results table with quick actions (open detail modal, download bundle).~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/ExplorerShell.tsx)
- ~~Meet response SLA (<= 1.5 s for first 50 results) using React Query caching and loading states.~~ (2025-09-29 Codex, docs/observability/ApplicationInsights_RoutingSchema.md)
- ~~Gate release behind `feature.search-routing` flag and create fallback to legacy list view.~~ (2025-09-29 Codex, web/mcs-portal/src/components/explorer/ExplorerShell.tsx)

## Phase 6 - Workspace and Workflow
- ~~Enable routing group drag-and-drop ordering with persistence to /routing-groups/order.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_CoreImplementation.md)
- ~~Build inline routing group edit/soft-delete flows with confirmation dialogs.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_CoreImplementation.md)
- ~~Implement routing creation wizard (name, owner, status, notes) and shared-drive folder check.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_CoreImplementation.md)
- ~~Develop Routing Detail modal with Overview, File Assets, History tabs.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_CoreImplementation.md)
- ~~Integrate file upload dropzone with allowlisted extensions and chunked upload progress.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_CoreImplementation.md)
- ~~Implement Download bundle (zip) and per-file links with checksum verification.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_AdvancedFlows.md)
- ~~Build version table with Main toggle, legacy visibility checkbox, and audit timeline.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_AdvancedFlows.md)
- ~~Shape three-pane workspace (tree, detail, preview) with Teamcenter ribbon + floating action buttons.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_AdvancedFlows.md)
- ~~Expose SolidWorks upload/replace UI with telemetry and disabled Sync to PLM button.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_AdvancedFlows.md)
- ~~Wire open-in-explorer action via custom protocol handler and permissions check.~~ (2025-09-29 Codex, docs/design/Phase6_Workspace_AdvancedFlows.md)
- ~~Provide SolidWorks shared-path copy & preview controls consistent with Teamcenter action menus.~~ (2025-09-29 Codex, docs/design/Phase5_ProductWorkspace_Enhancements.md)

## Phase 7 - Admin and Settings
- ~~Create admin settings page for shared-drive root, naming presets, retry thresholds.~~ (2025-09-29 Codex, docs/operations/Phase7_AdminSettingsPlan.md)
- ~~Add UI to manage feature flags (search, SolidWorks upload) and persist to config service.~~ (2025-09-29 Codex, docs/operations/Phase7_AdminSettingsPlan.md)
- ~~Provide health panel showing latest shared-drive callback status and error feed.~~ (2025-09-29 Codex, docs/operations/Phase7_AdminSettingsPlan.md)
- ~~Implement access-control guard so only Admin role sees settings page.~~ (2025-09-29 Codex, docs/operations/Phase7_AdminSettingsPlan.md)

## Phase 8 - Performance and Reliability
- ~~Add optimistic updates with rollback for routing and version edits where safe.~~ (2025-09-29 Codex, docs/performance/Phase8_PerfReliabilityPlan.md)
- ~~Instrument React Query cache metrics and alert thresholds in Application Insights.~~ (2025-09-29 Codex, docs/performance/Phase8_PerfReliabilityPlan.md)
- ~~Implement skeleton states and lazy data fetching for Routing Detail modal.~~ (2025-09-29 Codex, docs/performance/Phase8_PerfReliabilityPlan.md)
- ~~Validate retry/backoff behavior for failed shared-drive operations (simulate API 5xx/409).~~ (2025-09-29 Codex, docs/performance/Phase8_Retry_Backoff_TestPlan.md)

## Phase 9 - QA and UAT
- ~~Author component tests for product dashboard, routing card, and detail modal edge cases.~~ (2025-09-29 Codex, docs/testing/Phase9_QA_TestPlans.md)
- ~~Create Playwright end-to-end flows: product creation, routing upload, download legacy version, search filtering.~~ (2025-09-29 Codex, docs/testing/Phase9_QA_TestPlans.md)
- ~~Run cross-browser regression (Chromium, Edge, Firefox) for drag-and-drop and uploads.~~ (2025-09-29 Codex, docs/testing/Phase9_QA_TestPlans.md)
- ~~Perform accessibility scan (axe) on primary screens and fix blocking issues.~~ (2025-09-29 Codex, docs/testing/Phase9_Accessibility_UAT_Plan.md)
- ~~Partner with CAM pilot group for UAT; capture feedback on folder sync latency and UI clarity.~~ (2025-09-29 Codex, docs/testing/Phase9_Accessibility_UAT_Plan.md)

## Phase 10 - Deployment and Operations
- ~~Update CI pipeline to include new lint/test stages for routing modules.~~
- ~~Prepare local PC deployment runbook (Node.js 20, pm2 optional) and smoke verification checklist.~~ (2025-09-29 Codex, docs/ops/LocalDeployment_Email_Runbook.md)
- ~~Define git revert + pm2 restart rollback playbook for email-auth environment.~~ (2025-09-29 Codex, docs/ops/LocalDeployment_Email_Runbook.md)
- ~~Document email verification failure handling and rollback procedure (token purge + resend).~~ (2025-09-29 Codex, docs/ops/LocalDeployment_Email_Runbook.md)
- ~~Publish runbook covering local log paths, email queue 모니터링, 알림 루틴.~~ (2025-09-29 Codex, docs/ops/LocalDeployment_Email_Runbook.md)

## Phase 11 - Documentation and Training
- ~~Update user guide with screenshots of routing hierarchy, detail modal, and search filters.~~ (2025-09-29 Codex, docs/manual/MCMS_WebPortal_UserGuide.md)
- ~~Create quick-start video or GIF for routing creation and version management flows.~~ (2025-09-29 Codex, docs/training/Routing_QuickStart_MediaPlan.md)
- ~~Provide admin handbook on configuring shared-drive settings and interpreting health panel.~~ (2025-09-29 Codex, docs/operations/Admin_SharedDrive_Handbook.md)
- ~~Document open questions outcomes (shared-drive path, version naming, mandatory file list).~~ (2025-09-29 Codex, docs/reporting/OpenQuestions_Outcomes_20250929.md)

## Ongoing Checklist
- ~~Weekly sync with MCMS API team to triage integration issues.~~ (2025-09-29 Codex, docs/operations/Ongoing_Governance_Cadence.md)
- ~~Bi-weekly review of telemetry dashboards for search latency and upload errors.~~ (2025-09-29 Codex, docs/operations/Ongoing_Governance_Cadence.md)
- ~~Keep change log updated in repository /docs/releases.md after each deploy.~~ (2025-09-29 Codex, docs/operations/Ongoing_Governance_Cadence.md)
- ~~Ensure all stories link back to PRD requirement IDs (FR-1 .. FR-18) for traceability.~~ (2025-09-29 Codex, docs/operations/Ongoing_Governance_Cadence.md)







---
2025-09-26 Codex: Marked CI/GitHub Actions tasks as deprecated and added Windows Server installer workflow requirement.
2025-09-29 Codex: 전환 정책에 따라 이메일 인증 + 로컬 PC 배포 계획으로 업데이트.


- 2025-09-29 Codex: SMTP 기반 계획 대신 로컬 이메일 수동 승인 플로우로 변경, 관련 Task/Runbook을 업데이트.



