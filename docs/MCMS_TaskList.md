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
- [ ] Confirm REST and event contracts with MCMS API team for products, revisions, routing groups, routings, versions, and shared-drive callbacks.
- [ ] Codex consolidates confirmed backend responses into authoritative API specs (`/api/products/dashboard`, routing endpoints) for frontend reference.
- [ ] Document shared-drive root configuration options and mapping for DEV/STAGE/PROD.
- [ ] Sync with design team on updated hierarchy layouts and modal states; capture final UI kit components.
- [ ] Review Siemens Teamcenter X UX patterns and capture reusable layout components (left nav, ribbon, preview panes).
- [ ] Update Application Insights schema for new routing telemetry (search, upload, download).
- [ ] Refresh Jira/ADO board with stories aligned to this document.

## Phase 5 - Explorer and History (Routing Tree)
- [ ] Build SSR product dashboard page with global search bar and product list scaffold.
- [ ] Implement product creation modal with validation and shared-drive confirmation flow.
- [ ] Surface SolidWorks 3DM presence badge and link on product cards.
- [ ] Implement revision selector component with client-side routing and state caching.
- [ ] Refactor global layout to support ribbon header and docked preview panel (Teamcenter-style frame).
- [ ] Render routing groups as columns per active revision; include empty-state CTA.
- [ ] Implement routing card list with status pill, author, updated timestamp, and Main badge.
- [ ] Apply Teamcenter-inspired left filter rail and ribbon header styling to Explorer/Product dashboard shell.
- [ ] Log audit events for product/revision/group/routing creation and updates.

## Phase 5.1 - Search Readiness (new checkpoint)
- [ ] Implement typeahead search hitting /search endpoint with debounce and caching.
- [ ] Add filter panel for product code, routing group, file type, author, updated date.
- [ ] Render search results table with quick actions (open detail modal, download bundle).
- [ ] Meet response SLA (<= 1.5 s for first 50 results) using React Query caching and loading states.
- [ ] Gate release behind `feature.search-routing` flag and create fallback to legacy list view.

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
- [ ] Update CI pipeline to include new lint/test stages for routing modules.
- [ ] Configure blue/green deployment checklist specific to routing feature flags.
- [ ] Document rollback procedure for shared-drive integration feature flag toggles.
- [ ] Publish runbook covering folder-path troubleshooting and user support steps.

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






