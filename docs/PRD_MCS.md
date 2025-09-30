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
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
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
# MCMS Routing Frontend PRD (Next.js)


> Revised: 2025-09-23. This document specializes the MCMS frontend for the routing pipeline described in KSM Teamcenter Upgrade.pdf while remaining aligned with the platform assumptions captured in earlier MCMS PRDs.

## 0. References
- docs/MCMS_TaskList.md (MCMS Web Portal execution baseline)
- KSM Teamcenter Upgrade.pdf (routing hierarchy blueprint)
- Routing pipeline screenshot provided on 2025-09-23 (hierarchy and detail modal reference)

## 1. Absolute Directives
1. Mirror the hierarchy Product -> Revision -> Routing Group -> Routing exactly as shown in KSM Teamcenter Upgrade.pdf.
2. Every box in the hierarchy must be user-creatable from the UI and persisted through the MCMS API before success feedback is shown.
3. When a node is created, the frontend must wait for the shared-drive folder and seed files to be confirmed by the API before closing the modal.
4. The latest routing version must always be labeled Main; legacy versions remain accessible through an explicit "Show legacy versions" toggle.
5. Provide search across product code, routing names, and file metadata with a response time of <= 1.5 s for the first 50 results.
6. Never store routing artifacts locally beyond transient upload buffers; persistent artifacts must live on the shared drive through approved APIs.
7. Reuse the security, SSO, and non-functional baselines defined in the previous MCMS platform PRD and task list.
8. Ensure every sprint task references its dedicated sprint task list and produces English logbook entries plus descriptive code comments as specified in docs/sprint.

## 2. Purpose
- Deliver a routing-focused frontend that lets CAM engineers and reviewers create, organize, and discover routing groups and routings tied to product codes.
- Ensure routing artifacts (.esprit, .nc, .wp/.stl, SolidWorks .3dm) are versioned, downloadable, and backed by a consistent folder structure.
- Provide a foundation for future PLM or Teamcenter integrations while delivering immediate gains through automated shared-drive management.

## 3. Scope
### In Scope
- Next.js frontend screens that implement the hierarchy and routing detail modal.
- CRUD flows for product, revision, routing group, routing, and routing file bundles.
- Shared-drive orchestration via MCMS API calls, including folder-creation status handling.
- Search and filtering UI for product code, revision, routing, and file-type metadata.
- Version management UI and download packaging for routing artifacts.
- Surfacing SolidWorks 3DM assets stored under the product code.

### Out of Scope
- Backend service implementation (handled by the MCMS API team).
- Direct PLM or Teamcenter synchronization (placeholder hooks only).
- Native mobile layouts beyond responsive desktop and tablet breakpoints.
- CAD file editing or rendering inside the browser.

## 4. Personas
- CAM Engineer: creates and edits routing groups and routings, uploads files, requests approvals.
- Manufacturing Reviewer: reviews routing content, inspects version history, downloads artifacts.
- Admin or IT Operator: configures shared-drive roots, monitors folder health, manages permissions.

## 5. End-to-End Flow
| Step | Actor | Description | Shared Drive Artifact |
|---|---|---|---|
| 1 | CAM Engineer | Search or create Product by product code. | \\MCMS_SHARE\\<productCode>\\ |
| 2 | CAM Engineer | Add or select Revision (REV). | \\MCMS_SHARE\\<productCode>\\REV_<revId>\\ |
| 3 | CAM Engineer | Create Routing Group under the selected revision. | ...\\REV_<revId>\\GROUP_<groupSlug>\\ |
| 4 | CAM Engineer | Create Routing card with metadata. | ...\\GROUP_<groupSlug>\\ROUTING_<routingSlug>\\v<version>\\ |
| 5 | CAM Engineer | Upload files (.esprit, .nc, .wp/.stl) and link SolidWorks 3DM. | File set under routing version folder; SolidWorks in ...\\3DM\\<productCode>.3dm |
| 6 | Reviewer | Open routing detail modal to inspect metadata and download bundle. | Frontend requests zipped payload |
| 7 | All | Toggle Main version and view legacy versions by checkbox. | Updates version.json to flag main |

## 6. Information Architecture and Screens
1. **Product Dashboard**
   - Layout mirrors Siemens Teamcenter X search grid: persistent left filter rail, central card/thumbnail grid, and right-side preview/chat column for contextual guidance.
   - Global search bar, product list, create product modal.
   - Shows SolidWorks status badge and high-level KPI tiles (products, routing groups, SolidWorks linked).
2. **Revision Workspace**
   - Header: Product Name, Product Code, active REV selector with ribbon-style action bar (breadcrumbs + quick actions).
   - Left navigation tree for routing groups/routings, middle properties tabs, right 3D/notes preview consistent with Teamcenter X panels.
   - Routing cards display status badge, author, last updated, Main pill.
3. **Routing Detail Modal**
   - Tabs: Overview, File Assets, History.
   - File slots: .esprit, .nc, .wp/.stl, optional attachments.
   - Buttons: Upload new version, Mark as Main, Download bundle.
   - Checkbox Show legacy versions reveals previous version list with downloads.
4. **File Explorer Drawer**
   - Mirrors shared-drive tree; provides copy-path and open-in-explorer (Windows protocol handler).
5. **Admin Settings**
   - Configure shared-drive root, naming presets, and SolidWorks folder (default 3DM).
6. **Search Results View**
   - Faceted filters pinned on the left like Teamcenter X (category, owner, release state, date filters) with quick toggles.
   - Tile view with thumbnail cards and optional table mode; quick actions to open detail modal or download bundle.## 7. Functional Requirements
- **FR-1 Product Management**
  - Required fields: productCode, productName, optional description.
  - On create, call /products API; success occurs only after shared-drive root confirmation (rootPath, threeDmStatus).
  - Display SolidWorks 3DM presence as a link to 3DM/<productCode>.3dm when available.
- **FR-2 Revision Handling**
  - Support multiple revisions with auto-suggested IDs (alphanumeric).
  - Allow switching revisions without a full page reload.
  - Creating a revision triggers REV_<revId> folder creation and metadata update.
- **FR-3 Routing Group Management**
  - Inline add, edit, and soft delete with confirmation.
  - Drag reordering persisted via /routing-groups/order endpoint.
  - Metadata: name, description, owner, status (Draft, Ready, Released).
- **FR-4 Routing Cards**
  - Show routing name, author, last modified date, current version label.
  - Status colors: Draft (gray), Ready (blue), Released (green), Deprecated (red).
  - Clicking opens the Routing Detail modal.
- **FR-5 Routing Detail Modal**
  - Overview tab: metadata, revision, group, timestamps, notes, approval status.
  - File Assets tab: file slot rows with upload button, checksum, last uploader.
  - Provide Download bundle (zip) and per-file downloads.
  - History tab: timeline of creation, uploads, version changes.
- **FR-6 Versioning**
  - Only one Main version per routing; default is the latest successful upload.
  - Legacy versions hidden until Show legacy versions checkbox is enabled.
  - Version metadata stored in version.json; UI updates through /routings/{id}/versions endpoints.
- **FR-7 Shared-Drive Integration**
  - On each create or update, wait for API callback with folder status; show retry if it fails.
  - Display folder path with copy-to-clipboard; open-in-explorer for desktop clients.
  - Surface error banner when API reports permission or quota issues.
- **FR-8 SolidWorks Handling**
  - Show status of 3DM/<productCode>.3dm; allow upload or replace with version notes.
  - Provide placeholder Sync to PLM button (disabled) capturing telemetry for future integration.
- **FR-9 Search and Filters**
  - Global search bar with typeahead suggestions (product codes, routing names).
  - Filters by product code, routing group, file type (.esprit, .nc, .wp/.stl, .3dm), author, updated date range.
  - Saved searches scoped to user profile.
- **FR-10 Notifications and Audit**
  - Toast notifications for create or update, inline error states.
  - Audit trail list within Routing Detail (create, upload, mark main, delete).
  - Log downloads for .nc and .esprit files for traceability.

## 8. Data and Storage Design
- Shared-drive root configurable (default \\MCMS_SHARE\\Routing).
- Folder schema:

```
\\MCMS_SHARE\\Routing\\<productCode>\\
+-- REV_<revId>\\
|   +-- GROUP_<groupSlug>\\
|       +-- ROUTING_<routingSlug>\\
|           +-- v001\\
|               +-- <routingSlug>.esprit
|               +-- <routingSlug>.nc
|               +-- <routingSlug>.wp
|               +-- <routingSlug>.stl
|               +-- metadata.json
|           +-- version.json
+-- 3DM\\
|   +-- <productCode>.3dm
+-- logs\\ (optional API telemetry)
```

- Frontend never writes directly to the share; all operations go through MCMS API endpoints.
- Upload endpoints return checksum and storage path; UI verifies checksum before success state.

## 9. Integration and Future Proofing
- PLM or Teamcenter: expose disabled Sync to PLM button with tooltip; emit analytics event when clicked.
- ESPRIT Add-in: maintain compatibility with existing file retrieval API contract documented in earlier PRDs.
- CNC template automation: optional call to /templates/solid-edge to pre-fill .esprit templates during upload.

## 10. UX and Visual Guidelines
- Reuse Tailwind tokens and design system from the baseline MCMS PRD (primary #2F6FED, secondary #22B8CF, accent #FACC15) while extending palettes to match Siemens Teamcenter X ribbon blues (#0078A6), white workspaces, and neutral greys.
- Adopt Siemens Teamcenter X visual cues: teal ribbon header (#0078A6), white content canvas, high-contrast icons, and soft-shadow cards for novice friendliness.
- Responsive rules:
  - >= 1600px: maintain three-pane layout (navigation tree, detail panel, preview/chat) similar to Teamcenter X.
  - 1200px to 1599px: collapse preview into tab while keeping ribbon + tree visible.
  - <= 1199px: stack panels vertically with persistent action ribbon.

- Accessibility: keyboard navigation, ARIA labels for uploads, focus rings meeting WCAG AA.

## 11. Performance and Analytics
- Product dashboard initial load <= 2 s using cached API responses.
- Routing detail modal fetch <= 500 ms excluding file download time.
- React Query cache stale time 60 s; invalidate on create or update.
- Instrument Application Insights events: page views, search queries, uploads, downloads, errors.

## 12. Security and Compliance
- Enforce Azure AD SSO (msal-browser) and MCMS JWT tokens.
- Role-based permissions: CAM Engineer (create and edit), Reviewer (read and download), Admin (configure settings).
- File upload allowlist: .esprit, .nc, .wp, .stl, .3dm, .json.
- Display virus-scan pending status until backend marks the file as safe.

## 13. Release Strategy
- Align delivery with phases already captured in docs/MCMS_TaskList.md:
  - Phase 5 refreshes Explorer and History with the routing hierarchy UI (see docs/sprint/Sprint5_Routing_TaskList.md & Sprint5_Routing_Log.md).
  - Phase 6 covers Workspace and Workflow (drag and drop, versioning, uploads) (see docs/sprint/Sprint6_Routing_TaskList.md & Sprint6_Routing_Log.md).
  - Phase 7 extends Admin and Settings to include shared-drive configuration (see docs/sprint/Sprint7_Routing_TaskList.md & Sprint7_Routing_Log.md).
  - Insert Phase 5.1 checkpoint for search GA readiness before broad release (see docs/sprint/Sprint5_1_Routing_TaskList.md & Sprint5_1_Routing_Log.md).
  - Phases 8-11 rely on docs/sprint/Sprint8_Routing_TaskList.md through Sprint11_Routing_TaskList.md (paired logbooks capture English evidence for performance, QA, deployment, and training).
- Feature flags for Search (FR-9) and SolidWorks upload (FR-8) to allow staged rollout.

## 14. Risks and Mitigations
- Shared-drive latency or failures -> implement retries with exponential backoff; show degraded state.
- Concurrency on folder creation -> require idempotent API endpoints; retry after HTTP 409.
- Large file uploads (>500 MB) -> chunked uploads with resume and progress indicators.

## 15. Open Questions
- Confirm canonical shared-drive root path and permission model for production.
- Define naming convention for routing versions (numeric vs timestamp vs semantic).
- Clarify whether .wp and .stl files are mandatory or optional per routing.
- Establish SLA for backend folder-creation acknowledgements returned to the frontend.


















---
2025-09-26 Codex: Updated deployment/auth assumptions for internal Windows Server install model and Windows Integrated Authentication.

