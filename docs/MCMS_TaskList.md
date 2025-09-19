# MCMS Execution Task List\n\n# 절대 조건\n- 각 단계는 승인 후에만 진행한다.\n- 단계 착수 전 해당 단계 전체 범위를 리뷰하고 오류를 선제적으로 파악한다.\n- 오류가 발견되면 수정 전에 재승인을 득한다.\n- 이전 단계에 오류가 없음을 확인한 뒤 다음 단계 승인을 요청한다.\n- 모든 단계 작업은 백그라운드로 수행한다.\n- 문서나 웹뷰어 점검이 필요한 경우 반드시 승인 후 진행한다.\n- Task list 체크박스를 하나씩 업데이트하면서 문서를 업데이트 한다.\n- 모든 작업은 문서로 남긴다.\n\n> Approval required before starting each phase.\n## Phase 0 - Alignment & Governance
- [x] Confirm stakeholders, decision cadence, and approval flow for MCMS roadmap
- [x] Validate PRD scope, success metrics, and pilot item list with stakeholders
- [x] Define environment constraints (network drive W:\, ESPRIT/SolidWorks versions, user roles)

## Phase 1 - Detailed Requirements & Data Modeling
- [x] Decompose user journeys (Main, Routing, Mapper, History, Admin) into detailed use cases
- [x] Elaborate CRUD rules and validation for Item, Routing, FileMapper, History entities
- [x] Specify permission matrix (view/edit/approve) and escalation paths
- [x] Finalize network folder taxonomy and metadata schema (align with diagrammed structure)
- [x] Draft API contracts (REST/gRPC) including payloads for SolidWorks/Esprit integrations

## Phase 2 - Solution Architecture & Infrastructure
- [x] Decide client architecture (WPF vs. React+Electron) with trade-off analysis
- [x] Define backend topology (service decomposition, .NET vs. FastAPI boundaries)
- [x] Select primary DB (SQL Server vs. PostgreSQL) and outline replication/backup plan
- [x] Design file-storage integration (W:\ mount, caching layer, streaming strategy)
- [x] Plan deployment model (Windows Server roles, CI/CD pipeline, test environments)

## Phase 3 - Backend Implementation
- [x] Scaffold backend project(s) and shared libraries
- [x] Implement authentication/authorization middleware and role enforcement
- [x] Build Item & Routing service modules with revisioning logic
- [x] Implement FileMapper service with file path resolution and metadata persistence
- [x] Add History logging service (automatic change capture, auditing endpoints)
- [x] Integrate SolidWorks API hooks for item/Rev matching workflows
- [x] Integrate Esprit API triggers for program generation and status reporting
- [x] Implement background workers for large-file streaming, caching, and cleanup
- [x] Create automated tests (unit/integration) for core services and data access

## Phase 4 - Client Application
- [x] Establish UI design system (pastel palette, typography, accessibility standards)
- [x] Build Main window (Item/Rev tree, routing summary, SolidWorks link status)
- [x] Develop Routing editor (process grid, file upload/download, Esprit launch control)
- [x] Implement Mapper management UI (link routing IDs to actual filenames)
- [x] Create History viewer with timeline, filters, and diff views
- [x] Add permission-aware controls (disabled states, approval workflows)
- [x] Wire client to backend APIs with error handling and retry policies
- [x] Implement local caching and progressive loading for large datasets
- [x] Author UI tests / smoke tests for critical flows

## Phase 5 - File & Network Workflow
- [x] Script automated folder creation per Item/Rev/Routing (W:\ structure)
- [x] Build file ingestion pipeline (validation, checksum, version tagging)
- [x] Implement meta.json generation/consumption for routing packages
- [x] Add machine package handling (mprj, gdml) with storage policies
- [x] Ensure NC file streaming/downloading respects performance targets

## Phase 6 - Security & Compliance
- [x] Conduct threat modeling (file tampering, unauthorized access)
- [x] Implement secure credential storage and API key management
- [x] Apply logging/monitoring for access attempts and file operations
- [x] Validate audit trails meet "no-loss history" requirement

## Phase 7 - Performance & Reliability
- [x] Benchmark file I/O, caching effectiveness, and Esprit trigger latency
- [x] Optimize DB queries (indexes, pagination for history)
- [x] Stress-test NC file streaming and concurrent routing edits
- [x] Establish fallback/rollback procedures for Esprit or SolidWorks outages

## Phase 8 - Pilot Data & Migration
- [x] Collect pilot items (2-3) and associated revs/routings
- [x] Import existing CAM/NC files into MCMS structure with metadata
- [x] Validate data integrity and history reconstruction for pilot set

## Phase 9 - QA & UAT
- [x] Prepare comprehensive test plan (functional, integration, regression)
- [x] Execute automated and manual test suites; document findings
- [x] Facilitate UAT sessions with target operators; gather feedback
- [x] Iterate on usability issues (junior-friendly UI adjustments)

## Phase 10 - Deployment & Operations
- [x] Package client for easy deployment (installer/script, dependency checks)
- [x] Configure production Windows Server, DB instance, and file share permissions
- [x] Stand up internal-network CMD service host for operations and secure remote commands
- [x] Document CMD service access controls, monitoring, and fallbacks
- [x] Set up CI/CD pipeline, release management, and rollback strategy
- [x] Develop installation/rollback guides for client PCs
- [x] Train support team; establish incident response playbook
- [x] Plan post-go-live monitoring and first-week hypercare

## Phase 11 - Documentation & Handoff
- [x] Document system architecture, API contracts, and data model
- [x] Produce admin and end-user manuals (routing creation, history review)
- [x] Record onboarding/tutorial materials for junior operators
- [x] Finalize maintenance backlog and future enhancement roadmap





