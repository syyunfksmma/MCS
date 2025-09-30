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
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
# Sprint 9 Routing Task List (Menu Expansion)

## 절대 지령
- 본 문서는 1인 개발팀 운영 원칙을 따르며, 모든 실행 주체는 Codex이다.
- 모든 코드와 API 작성은 Codex가 수행하며, 자동화 작업 역시 Codex가 직접 검토한다.
- 작업 전후 활동은 영어 로그와 주석으로 남겨 추적성을 확보한다.
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별하고 이상 없을시에만 해당 task를 [x] 표시한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List는 불릿 항목으로 작성하고 신규 생성된 작업에서도 절대 지령을 동일하게 준수한다. 완료 시 불릿 끝에 `(완료 YYYY-MM-DD, 담당자)`를 표기한다.
- 오류 개선을 위해 신규 TASK가 발생하면 TASK LIST를 새로 작성하거나 기존 LIST에 업데이트 한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

## 1. 개요
- ~~목적: 릴리스 전 품질 검증과 사용자 수용 테스트를 완료한다.~~ (변경 2025-09-30)
- 목적: Dashboard/MCS/Server/Option 메뉴 구조를 구현하고 3D 뷰어 및 Esprit EDGE 연동을 포함한 핵심 기능을 배치한다.
- 기간: Sprint 9 (2025-11-23 ~ 2025-12-06) 가정.
- ~~산출물: 컴포넌트/통합 테스트, 플레이윗 시나리오, 접근성 리포트, UAT 계획.~~
- 산출물: 메뉴 확장 UI, 서버/옵션 설정 폼, Esprit EDGE API 연계, 3D/STL 뷰어 프로토타입 및 연동 테스트.
- 로그 지침: docs/sprint/Sprint9_Routing_Log.md에 영어로 구조 변경 및 통합 테스트 결과를 기록하고, 각 메뉴 엔트리에는 목적 주석을 추가한다.

### Scope Change 기록
- ~~Flow R/S/T(자동화 테스트, 접근성, UAT)는 Sprint 13 QA 파이널 단계로 이동.~~ (2025-09-30 Codex)

## 2. 작업 흐름 및 체크리스트
### Flow M. 글로벌 메뉴 및 라우팅 구조 재편
- M1. Next.js 레이아웃 업데이트: 상단 리본에 Dashboard/MCS/Server/Option 탭 노출, 권한별 메뉴 가시성 제어.
  - Log: Capture screenshot + role matrix.
  - Comment: Document route guard logic.
- M2. Routing tree와 Dashboard 경로 연결: `ExplorerShell` 진입 시 Breadcrumb/탭 연계, 메뉴 간 상태 보존 전략 정의.
  - Log: Describe state sync decisions.
  - Comment: Explain context provider usage.

### Flow C. MCS 메뉴 확장 (CAM 기능)
- C1. 3D/STL 뷰어 내장: `three.js` + `@react-three/fiber` 기반 Viewer 컴포넌트 작성, 샘플 모델 로딩 및 orbit controls.
  - Log: Record performance metrics + fallback.
  - Comment: Annotate lazy loading boundaries.
- C2. Esprit EDGE 연동: API 키 발급/전달 모달, EDGE 프로세스 기동 호출, `esprit_api_urls.csv` 계약과 일치 확인.
  - Log: Detail API handshake & error handling.
  - Comment: Explain security considerations.
- C3. CAM 파일 관리 확장: Workspace 업로드 패널에서 버전 태깅/다운로드 통합, Routing Detail에 EDGE 상태 배지 표시.
  - Log: Provide flow diagram + test log.
  - Comment: Document data shape in TypeScript types.

### Flow O. Server & Option 메뉴 구축
- O1. Server 메뉴: 로그 뷰어(실시간 tail), 공유 드라이브 구조 브라우저, 검색/REV 관리 스토리보드 반영.
  - Log: Attach mock + implementation screenshots.
  - Comment: Annotate signal handling for log stream.
- O2. Option 메뉴 폼: 폴더 구조 설정, 작업 할당 매핑, Access Data 소스/Esprit EDGE 버전 관리, 트래픽 제한 설정.
  - Log: Document validation rules + persisted schema.
  - Comment: Explain storage path for settings.
- O3. 사용자/권한 관리 및 감사 로깅: Role CRUD UI, 변경 Audit Trail API 연동, export/import JSON 지원.
  - Log: Summarize RBAC matrix.
  - Comment: Annotate encryption/secret handling.

## 3. 검증
- Playwright 메뉴 네비게이션 시나리오, 3D 뷰어 렌더 테스트, EDGE 모의 호출 로그 첨부.
- Server/Option 폼 저장 후 DB snapshot과 감사 로그 스크린샷.

## 4. 승인 조건
- 네 개 메뉴 모두 라우팅/권한/상태 유지 동작 확인.
- 3D 뷰어 및 Esprit EDGE 통합 데모 녹화.
- Option 저장 → 서버 측 설정 반영 로그 확인.
