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
# Sprint 10 Routing Task List (Ribbon & Branding)

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
- ~~목적: 라우팅 기능 배포 및 운영 안정화 준비.~~ (변경 2025-09-30)
- 목적: 리본 액션 그룹, 필터 토글 로직, Siemens/Teamcenter 브랜딩 토큰을 완성하고 접근성/가이드라인을 확정한다.
- 기간: Sprint 10 (2025-12-07 ~ 2025-12-20) 가정.
- ~~산출물: CI 파이프라인 보강, 배포 체크리스트, 롤백 문서, 운영 런북.~~
- 산출물: 업데이트된 ExplorerRibbon/FilterRail, 승인/Queue 기능 API 통합, 테마 토큰 및 브랜딩 문서, 접근성 검증 결과.
- 로그 지침: docs/sprint/Sprint10_Routing_Log.md에 영어로 변경 사항을 기록하고, UI 코드에는 스타일/접근성 근거를 주석으로 남긴다.

### Scope Change 기록
- ~~Flow U/V/W(파이프라인, 배포, 런북)은 DevOps Epic으로 분리.~~ (2025-09-30 Codex)

## 2. 작업 흐름 및 체크리스트
### Flow R. Ribbon 액션 정렬
- R1. ExplorerRibbon 그룹 재구성: Routing(New/Duplicate/Archive), Approval(Request/Approve/Reject), Add-in(Queue/Retry/Cancel) 버튼 구현 및 API 핸들러 연결.
  - Log: Document API contract references.
  - Comment: Explain optimistic update vs server confirmation.
- R2. 승인/큐 작업 실패 시 토스트 및 롤백 처리, Telemetry 이벤트 발행.
  - Log: Capture error cases and instrumentation IDs.
  - Comment: Annotate telemetry helper usage.

### Flow F. Filter Rail & 토글 기능 정합성
- F1. `SearchFilterRail` 토글 상태를 `ExplorerShell`/React Query와 동기화, 최근 Routing/ SLA 초과 필터 서버 연동.
  - Log: Provide before/after UX capture.
  - Comment: Document query keys & cache policy.
- F2. 사용자별 최근 Routing 캐시 구현(Local IndexedDB + API fallback) 및 초기화 버튼 확장.
  - Log: Describe storage schema, eviction policy.
  - Comment: Annotate hooks for hydration.
- F3. SLA 배지 텍스트/언어 현지화 및 접근성 라벨 재검토.
  - Log: Attach i18n strings + axe report.
  - Comment: Explain ARIA adjustments.

### Flow B. Branding & Theme 적용
- B1. `theme/tokens.ts`에 Siemens/Teamcenter 팔레트 정의, globals.css와 Ribbon/버튼 스타일 업데이트.
  - Log: Capture design token diff.
  - Comment: Document mapping between brand guide and tokens.
- B2. Storybook 비주얼 리그레션/Theme switcher 추가, 브랜드 검수 체크리스트 작성.
  - Log: Include snapshot results & checklist path.
  - Comment: Annotate story configuration.
- B3. 접근성 검증: 대비, 포커스 링, 키보드 순서 검토 및 docs/accessibility/Sprint10_Report.md 작성.
  - Log: Summarize findings.
  - Comment: Note remediation code locations.

## 3. 검증
- Storybook screenshot diff, Playwright ribbon regression, axe 결과 첨부.
- 스타일 토큰 적용 전/후 비교 이미지 저장.

## 4. 승인 조건
- Ribbon/FilterRail 요구 버튼 및 토글 동작 100% 구현.
- 브랜딩 가이드를 충족하는 색상/폰트 적용 확인.
- 접근성 검사(axe + 수동) 통과.
