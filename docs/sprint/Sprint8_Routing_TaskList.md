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
# Sprint 8 Routing Task List (Dashboard & SignalR)

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
- ~~목적: 성능/안정성 요구사항을 충족하고 회복력을 강화한다.~~ (변경 2025-09-30)
- 목적: 대시보드 KPI 파이프라인 구축과 SignalR 기반 실시간 Presence/파일 트리 동기화를 완료한다.
- 기간: Sprint 8 (2025-11-09 ~ 2025-11-22) 가정.
- ~~산출물: 옵티미스틱 업데이트, 캐시 메트릭, 스켈레톤, 재시도 검증.~~
- 산출물: Dashboard Aggregation API, Next.js Dashboard UI, SignalR Hub/클라이언트, 실시간 성능 검증 리포트.
- 로그 지침: 모든 작업은 docs/sprint/Sprint8_Routing_Log.md에 영어로 기록하고, 대시보드/SignalR 코드에는 변경 이유를 영어 주석으로 남긴다.

### Scope Change 기록
- ~~Flow N/P/Q(옵티미스틱 업데이트, 캐시 메트릭, 재시도 검증)은 Sprint 12 이후로 이관.~~ (2025-09-30 Codex)

## 2. 작업 흐름 및 체크리스트
### Flow D. Dashboard KPI & UI 구축
- D1. Aggregation API 설계 및 구현: products_dashboard_v2 스키마 기준으로 SQL View/Stored Procedure 추출, ASP.NET Core endpoint `/api/dashboard/summary` 작성.
  - Log: Document schema, latency, fallback 전략.
  - Comment: Explain caching/invalidations in controller/service.
- D2. Next.js Dashboard Page 제작: `src/app/dashboard/page.tsx`에서 Ant Design Cards + Charts로 KPI(미할당/할당/완료, 주간/월간 그래프) 렌더링, Suspense Skeleton 및 empty states 포함.
  - Log: Record layout screenshots & accessibility notes.
  - Comment: Annotate data-fetch hooks with purpose.
- D3. 테스트/모니터링: Vitest unit, Playwright smoke, k6 P95<=1.5s 측정 후 docs/testing/Sprint8_Dashboard_Report.md 추가.
  - Log: Capture coverage, k6 summary.
  - Comment: Document test data seed usage.

### Flow S. SignalR 기반 실시간 기능
- S1. Hub 초기화: `/hubs/presence`와 `/hubs/tree` 설계, 인증/권한 정책 명시, 이벤트 payload(사용자 Presence, 파일 트리 변경) 정의.
  - Log: Describe hub methods and security review.
  - Comment: Explain negotiation/transport settings.
- S2. 프론트엔드 연동: `useExplorerData`에 SignalR 클라이언트를 추가하고 reconnect/backoff 전략을 구현하며 연결 상태 배너를 노출.
  - Log: Provide GIF/log of live updates.
  - Comment: Explain cleanup logic to avoid memory leaks.
- S3. 부하/회복성 시험: 50 동시 접속 사용자 시뮬레이션(k6 + Signal-McsEvent.ps1), SLA 지표 기록 및 경보 임계치 정의.
  - Log: Attach load test commands/results.
  - Comment: Annotate config constants.

## 3. 검증
- Dashboard API latency log + Next.js Lighthouse 보고.
- SignalR load test 결과와 reconnect 실패 시뮬레이션 스크린샷.

## 4. 승인 조건
- Dashboard KPI 가시화 + P95 응답 1.5s 이내.
- SignalR Presence/트리 업데이트 동작 확인, 재연결 시나리오 통과.
