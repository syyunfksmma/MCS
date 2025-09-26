# Sprint 8 Routing Task List (Performance & Reliability)

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
- 목적: 성능/안정성 요구사항을 충족하고 회복력을 강화한다.
- 기간: Sprint 8 (2025-11-09 ~ 2025-11-22) 가정.
- 산출물: 옵티미스틱 업데이트, 캐시 메트릭, 스켈레톤, 재시도 검증.
- 로그 지침: 모든 작업은 docs/sprint/Sprint8_Routing_Log.md에 영어로 기술하고, 코드 주석으로 튜닝 이유를 남긴다.

## 2. 작업 흐름 및 체크리스트
### Flow N. 옵티미스틱 업데이트
- [ ] N1. Routing/Version 편집 옵티미스틱 적용 범위 정의.
  - Log: Document operations covered and rollback triggers.
  - Comment: Explain boundary conditions near mutation hooks.
- [ ] N2. 실패 롤백 UX (토스트/바텀시트) 구현.
  - Log: Capture copywriting + localization.
  - Comment: Annotate error parser logic.

### Flow O. 모니터링 및 캐시 메트릭
- [ ] O1. React Query cache metrics instrumentation(Application Insights custom events).
  - Log: Describe metric schema and sampling rate.
  - Comment: Document instrumentation helper usage.
- [ ] O2. Alert threshold 설정 및 대시보드 갱신.
  - Log: Summarize alert rules, channels.
  - Comment: Explain why thresholds chosen.

### Flow P. UX 성능 개선
- [ ] P1. Routing Detail modal skeleton + lazy 데이터 패치.
  - Log: Provide before/after load metrics.
  - Comment: Document data prefetch boundaries.
- [ ] P2. 검색/워크스페이스 주요 경로에서 CLS/FID 재측정.
  - Log: Record metrics + testing tools.
  - Comment: Note code location controlling layout shifts.

### Flow Q. 재시도/백오프 검증
- [ ] Q1. 공유 드라이브 API 실패(5xx/409) 시뮬레이션.
  - Log: Include repro steps and outcome.
  - Comment: Explain test harness hooks.
- [ ] Q2. 재시도 정책 튜닝(지수 백오프 파라미터).
  - Log: Document parameter values and reasoning.
  - Comment: Annotate config constant file.

## 3. 검증
- Lighthouse/Web Vitals 리포트 링크를 로그에 첨부.
- 재시도 시나리오 스크린캐스트 또는 로그 캡처 추가.

## 4. 승인 조건
- 성능 목표 충족 (TTFB, CLS, FID) + 경보 설정 검토 완료.
- 회복력 테스트에서 중단 없이 동작.




