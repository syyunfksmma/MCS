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
- [ ] R1. Component tests for product dashboard, routing card, detail modal edge cases.
  - Log: Document coverage metrics and tricky cases.
  - Comment: Explain mocks/stubs rationale.
- [ ] R2. Playwright E2E flows (product creation, routing upload, legacy download, search filters).
  - Log: Provide test IDs, run frequency.
  - Comment: Annotate steps with business context.

### Flow S. 브라우저 호환성 & 접근성
- [ ] S1. Cross-browser regression (Chromium, Edge, Firefox) focusing on drag/drop & uploads.
  - Log: Capture platform matrix and delta issues.
  - Comment: Document workarounds for vendor quirks.
- [ ] S2. Accessibility scan (axe) + manual keyboard audit.
  - Log: Record issues and remediation plan.
  - Comment: Note ARIA role adjustments in code.

### Flow T. UAT 준비 및 실행
- [ ] T1. UAT test plan + sign-off checklist for CAM pilot group.
  - Log: Include participant list, objectives.
  - Comment: Document location of exported plan.
- [ ] T2. Collect feedback on folder sync latency & UI clarity.
  - Log: Summarize qualitative notes + severity.
  - Comment: Annotate backlog tickets linking to feedback.

## 3. 검증
- CI 파이프라인에 신규 테스트 추가 후 녹색 빌드 스크린샷 첨부.
- 접근성 리포트(axe)와 수동 테스트 결과 링크 기록.

## 4. 승인 조건
- QA 시그니처 + UAT 서명 수집.
- Critical/High 버그 0건.




