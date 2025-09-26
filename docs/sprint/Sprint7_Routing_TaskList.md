# Sprint 7 Routing Task List (Admin & Settings)

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
- 목적: 공유 드라이브 설정과 피처 플래그 관리를 위한 Admin UI를 구축한다.
- 기간: Sprint 7 (2025-10-26 ~ 2025-11-08) 가정.
- 산출물: 설정 페이지, 플래그 관리, 상태 패널, 접근 제어.
- 로그 지침: 모든 작업자는 docs/sprint/Sprint7_Routing_Log.md에 영어로 활동 로그 작성, 코드에는 설정 의도와 보안 고려 사항을 영어 주석으로 남긴다.

## 2. 작업 흐름 및 체크리스트
### Flow K. 설정 페이지
- [ ] K1. Shared-drive root & naming preset 설정 폼.
  - Log: Capture validation rules and environment defaults.
  - Comment: Document how values hydrate from backend.
- [ ] K2. Retry threshold/timeout 설정 UI.
  - Log: Summarize slider/dropdown decisions.
  - Comment: Explain mapping to API payload.

### Flow L. 피처 플래그 관리
- [ ] L1. Feature flag 목록 및 토글 (`feature.search-routing`, `feature.solidworks-upload`).
  - Log: Record audit requirement and flag history endpoint.
  - Comment: Note dependency injection for flag client.
- [ ] L2. Flag 변경 감사 로그 보기 + 롤백 버튼.
  - Log: Document log entry format and retention.
  - Comment: Explain guard before rollback triggers.

### Flow M. 상태 패널 & 접근 제어
- [ ] M1. Shared-drive callback health 패널.
  - Log: Outline metrics displayed and color thresholds.
  - Comment: Document subscription to health feed.
- [ ] M2. Admin role gate + unauthorized flow.
  - Log: Detail RBAC check integration with auth provider.
  - Comment: Explain fallback view for non-admin users.

## 3. 검증
- Admin 페이지 접근 테스트(권한 있는/없는 사용자) 결과를 로그에 기재.
- Feature flag 변경 시나리오에 대한 QA 체크리스트 작성.

## 4. 승인 조건
- 보안 리뷰 통과 (RBAC, 감사 로그).
- 운영팀 동의: 설정 변경 프로세스 문서화.




