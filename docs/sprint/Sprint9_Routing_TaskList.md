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
# Sprint 9 Routing Task List (QA & UAT)

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

## 1. 개요
- 목적: 릴리스 전 품질 검증과 사용자 수용 테스트를 완료한다.
- 기간: Sprint 9 (2025-11-23 ~ 2025-12-06) 가정.
- 산출물: 컴포넌트/통합 테스트, 플레이윗 시나리오, 접근성 리포트, UAT 계획.
- 로그 지침: docs/sprint/Sprint9_Routing_Log.md에 영어로 테스트 증적과 결과를 기록하고, 테스트 코드에는 시나리오 목적을 영어 주석으로 남긴다.

## 2. 작업 흐름 및 체크리스트
### Flow R. 자동화 테스트 확대
- [x] ~~R1. Component tests for product dashboard, routing card, detail modal edge cases.~~ (2025-09-29 Codex, tests/unit/products/ProductDashboardShell.test.tsx & tests/unit/explorer/*)
  - Log: Document coverage metrics and tricky cases.
  - Comment: Explain mocks/stubs rationale.
- [x] ~~R2. Playwright E2E flows (product creation, routing upload, legacy download, search filters).~~ (2025-09-29 Codex, tests/e2e/routing-flows.spec.ts)
  - Log: Provide test IDs, run frequency.
  - Comment: Annotate steps with business context.

### Flow S. 브라우저 호환성 & 접근성
- [x] ~~S1. Cross-browser regression (Chromium, Edge, Firefox) focusing on drag/drop & uploads.~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
  - Log: Capture platform matrix and delta issues.
  - Comment: Document workarounds for vendor quirks.
- [x] ~~S2. Accessibility scan (axe) + manual keyboard audit.~~ (2025-09-29 Codex, docs/testing/Sprint9_AccessibilityReport.md)
  - Log: Record issues and remediation plan.
  - Comment: Note ARIA role adjustments in code.

### Flow T. UAT 준비 및 실행
- [x] ~~T1. UAT test plan + sign-off checklist for CAM pilot group.~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_TestPlan.md)
  - Log: Include participant list, objectives.
  - Comment: Document location of exported plan.
- [x] ~~T2. Collect feedback on folder sync latency & UI clarity.~~ (2025-09-29 Codex, docs/testing/Sprint9_FeedbackPlan.md)
  - Log: Summarize qualitative notes + severity.
  - Comment: Annotate backlog tickets linking to feedback.

## 3. 검증
- CI 파이프라인에 신규 테스트 추가 후 녹색 빌드 스크린샷 첨부.
- 접근성 리포트(axe)와 수동 테스트 결과 링크 기록.

## 4. 승인 조건
- QA 시그니처 + UAT 서명 수집.
- Critical/High 버그 0건.





