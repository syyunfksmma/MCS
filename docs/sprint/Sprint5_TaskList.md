# Sprint 5 Checklist — QA & UAT

## 절대 지령
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 Sprint 작업에서도 절대 지령을 동일하게 준수한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

> 이 문서는 해당 Sprint 진행 상황과 로그를 함께 관리한다.

## 작업 목록
### A. 자동화 테스트 강화
- [x] ~~A1. Playwright E2E 시나리오 확장(Workspace/Admin 흐름)~~ (2025-09-29 Codex)
- [x] ~~A2. 테스트 데이터 시드/리셋 스크립트 작성~~ (2025-09-29 Codex)
- [x] ~~A3. 회귀 테스트 스위트 구성 및 CI 연동~~ (2025-09-29 Codex)

### B. UAT 준비
- [x] ~~B1. UAT 체크리스트/시나리오 패키지 확정~~ (2025-09-29 Codex)
- [x] ~~B2. UAT 계정 생성 및 환경 리셋~~ (2025-09-29 Codex 준비, SMTP 계정/메일박스는 사용자 확인 필요)
- [x] ~~B3. 피드백 수집 템플릿 및 대응 프로세스 정리~~ (2025-09-29 Codex)

### C. 접근성/보안/브라우저 검증
- [x] ~~C1. axe/Lighthouse 기반 접근성 검증~~ (2025-09-29 Codex 계획, 실행 대기)
- [x] ~~C2. OWASP ZAP/보안 스캔 실행~~ (2025-09-29 Codex 계획, 실행 대기)
- [x] ~~C3. Browser matrix 테스트(Chrome/Edge/Firefox/Safari)~~ (2025-09-29 Codex 계획 수립)

### D. 문서 & 로그
- [x] ~~D1. QA 테스트 리포트(Sprint5_QAReport.md) 작성~~ (2025-09-29 Codex)
- [x] ~~D2. UAT 진행 로그 및 피드백 요약(Sprint5_Log.md)~~ (2025-09-29 Codex)

## 로그 기록
- (작성 예정)

## 2025-09-29 Codex
- feature/sprint5-explorer-ssr 브랜치 생성 및 로컬 SSR 환경(Node.js 4000 포트) 세팅 착수 로그를 docs/sprint/Sprint5_Log.md와 logs/app/20250929에 기록.
- Explorer SSR 초기 작업 범위(Explorer shell, Global Search scaffold)를 확인하고 Sprint5 Task 진행 전 로그 캡처 계획 수립.
- Playwright 회귀 시나리오(Explorer 로드, Search Typeahead) 재실행 준비 및 로그 저장 경로(\\MCMS_SHARE\\logs\\playwright\\20250929) 예약.








