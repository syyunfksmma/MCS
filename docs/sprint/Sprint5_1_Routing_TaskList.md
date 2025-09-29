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
# Sprint 5.1 Routing Task List (Search Readiness)

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
- 목적: FR-9 검색/필터 요구사항을 출시 전 검증한다.
- 기간: Sprint 5.1 (2025-10-05 ~ 2025-10-11) 가정.
- 산출물: 타입어헤드 검색, 필터 패널, SLA 검증, feature flag fallback.
- 로그 지침: 모든 활동은 docs/sprint/Sprint5_1_Routing_Log.md에 영어로 서술하고, 관련 코드에는 검색 성능/UX 의도 주석을 남긴다.

## 2. 작업 흐름 및 체크리스트
### Flow D. 검색 엔드포인트 연동
- [x] ~~D1. `/search` API 클라이언트 훅 구현 및 캐싱 정책 정의.~~ (2025-09-29 Codex)
  - Log: Describe debounce window, cache key format.
  - Comment: Explain fallback behavior when API throttles.
- [x] ~~D2. Typeahead UI + 키보드 네비게이션.~~ (2025-09-29 Codex, 350ms debounce 자동 검색)
  - UX: Use ribbon-aligned chips and iconography inspired by Teamcenter chat assistant.
  - Log: Outline accessibility handling and highlight tests.
  - Comment: Document highlight algorithm near render loop.

### Flow E. 필터 및 결과 화면
- [x] ~~E1. Facet Filter Panel (product code, routing group, file type, author, updated date).~~ (2025-09-29 Codex, Select + 초기화 버튼)
  - Log: Capture filter state model and URL sync decision.
  - Comment: Explain hooking to React Context vs props.
- [x] ~~E2. Search Results Table with quick actions (open modal, download bundle).~~ (2025-09-29 Codex, 열기/다운로드 버튼, 필터 연동)
  - Log: Summarize column definitions, virtualization choice.
  - Comment: Note security check before enabling download.

### Flow F. SLA & Feature Flag
- [x] ~~F1. 성능 측정 (첫 50건 1.5s 이하) 및 로그 저장.~~ (2025-09-29 Codex, SLA 요약/타깃 표시)
  - Log: Include raw timings and tooling (e.g., WebPageTest).
  - Comment: Document instrumentation snippet for metrics.
- [x] ~~F2. `feature.search-routing` 토글 + 레거시 뷰 폴백 구현.~~ (2025-09-29 Codex, FeatureGate onToggle + legacy fallback)
  - Log: Detail flag evaluation path and rollout plan.
  - Comment: Explain conditional rendering branch.

## 3. 검증
- E2E 테스트 케이스(검색 입력, 필터 조합)를 작성하고 로그에 테스트 경로와 결과 첨부.
- SLA 실패 시 대응 플랜(캐싱 조정, API 튜닝) 기록.

## 4. 승인 조건
- 모든 체크 리스트 완료 + 로그 및 주석 검증.
- PM/QA와 기능 플래그 동의 후 배포 준비.






