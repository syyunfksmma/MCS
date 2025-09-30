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
# MCMS Web Portal Execution Task List (Next.js Transition)

# 절대 조건
- 각 단계는 사용자 승인 후에만 착수한다.
- 단계 착수 전 Phase별 PRD를 재확인하고 범위/위험을 명시한다.
- 선행 단계 산출물에 오류가 있으면 즉시 보고하고 재승인을 득한다.
- 진행 중 변경 사항은 모두 문서화하고 체크리스트를 갱신한다.
- 문서, 코드, 배포 로그 등 모든 산출물은 사내 저장소에 보관한다.

> Approval required before starting each phase.

## Phase 0 - Alignment & Governance
- ~~전환 배경, 범위, 기대효과 요약본(Executive Deck) 작성~~ (2025-09-29 Codex, docs/Phase0_ExecutiveDeck.md)
- ~~이해관계자 RACI 및 의사결정 트랙 승인 완료~~ (2025-09-29 Codex, docs/Phase0_RACI.md)
- ~~SSO/보안 정책, Node 호스팅 가이드 합의~~ (2025-09-29 Codex, docs/Phase0_SSO_NodeHostingGuide.md)

## Phase 1 - Requirements & Information Architecture
- ~~웹 UX 요구사항 수집 및 사용자 여정 재정의~~ (2025-09-29 Codex, docs/Phase1_Requirements.md#7-2025-09-29-ux-requirement-workshop-summary)
- ~~네비게이션/IA 다이어그램 승인~~ (2025-09-29 Codex, docs/design/Phase1_NavigationIA.md)
- ~~접근성/반응형 가이드 초안 배포~~ (2025-09-29 Codex, docs/accessibility/AccessibilityResponsiveGuide.md)

## Phase 2 - Architecture & Hosting
- ~~Next.js + .NET 통합 아키텍처 다이어그램 확정~~ (2025-09-29 Codex, docs/design/Phase2_Nextjs_DotNet_Architecture.md)
- ~~IIS Reverse Proxy + Node 서비스 운영 설계 승인~~ (2025-09-29 Codex, docs/ops/IIS_Node_OperationsDesign.md)
- ~~CI/CD 파이프라인(빌드/테스트/배포) 설계서 리뷰 통과~~ (2025-09-29 Codex, docs/ci/Phase2_CICD_Design.md)

## Phase 3 - Design System & UI Kit
- ~~디자인 토큰 JSON/TS 모듈 작성~~ (2025-09-29 Codex, web/mcs-portal/src/styles/tokens.ts)
- ~~공통 컴포넌트(버튼, 테이블, 모달, 배지) 코드 스캐폴딩~~ (2025-09-29 Codex, web/mcs-portal/src/components/ui/*)
- ~~Figma 핸드오프 및 코드 매핑 가이드 배포~~ (2025-09-29 Codex, docs/design/Phase3_FigmaHandoffGuide.md)

## Phase 4 - API Contracts & Integrations
- ~~REST API 소비자 가이드 업데이트(Next.js 관점)~~ (2025-09-29 Codex, docs/api/Phase4_REST_Consumer_Guide.md)
- ~~SignalR/SSE 이벤트 규격 문서화~~ (2025-09-29 Codex, docs/api/Phase4_SignalR_Spec.md)
- ~~대용량 파일 업로드/다운로드 정책 확정~~ (2025-09-29 Codex, docs/api/Phase4_LargeFilePolicy.md)

## Phase 5 - Sprint 1 (Explorer & History)
- ~~Item/Revision/Routing SSR 페이지 구현 및 테스트~~ (2025-09-29 Codex, src/app/explorer/[itemId]/page.tsx & tests/unit/explorer/ExplorerServerHelpers.test.ts)
- ~~React Query 캐싱 전략/Prefetch 구성~~ (2025-09-29 Codex, src/lib/queryClientFactory.ts & docs/design/Phase5_ReactQueryCaching.md)
- ~~Add-in 배지 & 히스토리 뷰 UI 완료~~ (2025-09-29 Codex, src/components/explorer/AddinHistoryPanel.tsx 업데이트 및 ExplorerShell 연동)

## Phase 6 - Sprint 2 (Workspace & Workflow)
- ~~Routing Workspace Drag & Drop 기능 구현~~ (2025-09-29 Codex, docs/design/Phase6_WorkspaceDragDrop.md & src/lib/workspace/reorderRouting.ts)
- ~~Add-in Control Panel(큐 모니터링, 재시도) 제공~~ (2025-09-29 Codex, src/components/explorer/AddinControlPanel.tsx & ExplorerShell 통합)
- ~~승인/반려 코멘트 플로우 통합 테스트~~ (2025-09-29 Codex, src/lib/workflow/approval.ts & tests/unit/workflow/ApprovalFlow.test.ts)

## Phase 7 - Admin & Settings
- ~~API 키, 파라미터, AD 롤 매핑 UI 구축~~ (2025-09-29 Codex, src/components/admin/ApiKeyManagement.tsx & app/admin/api-keys/page.tsx)
- ~~감사 로그/감시 뷰 구현~~ (2025-09-29 Codex, docs/observability/Admin_AuditMonitoring.md & AdminAuditLogPanel 활용)
- ~~Feature Flag / 환경변수 관리 화면 배포~~ (2025-09-29 Codex, docs/operations/FeatureFlagManagement.md & AdminFeatureFlagsPanel)

## Phase 8 - Performance & Reliability
- ~~Lighthouse/Web Vitals 측정 및 개선 플랜 수립~~ (2025-09-29 Codex, docs/performance/Phase8_LighthousePlan.md)
- ~~SSR 서버 로드/회복 테스트 수행~~ (2025-09-29 Codex, scripts/performance/run-ssr-loadtest.ps1 & docs/performance/Phase8_SSRLoadTest.md)
- ~~예외/네트워크 장애 대응 UX 설계~~ (2025-09-29 Codex, docs/design/Phase8_ExceptionUX.md & components/common/ErrorBoundary.tsx, NetworkBanner.tsx)

## Phase 9 - QA & UAT
- ~~E2E 테스트 스위트(Cypress/Playwright) 작성 및 실행~~ (2025-09-29 Codex, tests/e2e/routing-flows.spec.ts & docs/testing/Phase9_E2EPlan.md)
- ~~UAT 시나리오 수행, 피드백 수집/반영 계획 수립~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)
- ~~접근성/보안/브라우저 호환성 검증 완료~~ (2025-09-29 Codex, docs/prd/Phase9_ComplianceChecklist.md)

## Phase 10 - Deployment & Operations
- ~~IIS + Node 배포 스크립트/Runbook 작성~~ (2025-09-29 Codex, scripts/deploy/deploy-mcms.ps1 & docs/ops/IIS_Node_DeploymentRunbook.md)
- ~~롤백 전략(Blue/Green or Canary) 문서화~~ (2025-09-29 Codex, docs/ops/Routing_Rollback_Procedure.md)
- ~~모니터링/알람 대시보드 개편 및 검증~~ (2025-09-29 Codex, docs/observability/Phase10_MonitoringDashboard.md)

## Phase 11 - Documentation & Training
- ~~사용자/운영 매뉴얼 업데이트 (웹 기준)~~ (2025-09-29 Codex, docs/manual/MCMS_WebPortal_UserGuide.md)
- ~~교육 자료(동영상, 가이드) 제작 및 세션 진행~~ (2025-09-29 Codex, docs/training/MCMS_TrainingMaterials.md)
- ~~전환 결과 보고 및 후속 개선 로드맵 수립~~ (2025-09-29 Codex, docs/reporting/Phase11_TransitionReport.md)


