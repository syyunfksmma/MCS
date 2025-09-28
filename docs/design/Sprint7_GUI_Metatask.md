# Sprint7 GUI Design Brief

## 배경
- 메타 파일 생성 SLA(≤1 s)에 맞춰 백엔드에서 추가된 로그(`Meta JSON write ...`, `Routing meta generation ...`)가 신규로 출력됨.
- GUI 단계에서는 업로드 진행 상황, 메타 생성 상태, SLA 위반 시 알림 UX가 필요.
- 기존 ExplorerShell/DetailModal에서 제공하지 않던 메타 지표를 Surfacing하여 운영팀이 즉시 파악 가능하도록 설계.

## 핵심 목표
1. 업로드 완료 이후 메타 대기 구간을 시각화하여 1초 SLA 초과 시 사용자에게 경고.
2. 로그 포맷(`Meta JSON write completed in {WriteMs} ms` / `Routing meta generation exceeded SLA ({ElapsedMs} ms)`)을 UI Telemetry overlay에서도 동일 키 값으로 노출.
3. SLA 위반 이벤트를 History 패널과 ExplorerShell Notification Center 양쪽 모두에 남겨 추후 감사 추적을 돕는다.

## UX 요구사항 (Log ↔ UI 매핑)
| 로그 키워드 | UI 요소 | 요구사항 |
|-------------|---------|----------|
| `Meta JSON write exceeded SLA` | ExplorerShell Notification Center | 경고 토스트 + "자세히" 클릭 시 SLA 리포트 모달 오픈 |
| `Meta JSON write completed` | RoutingDetailModal > Files 탭 헤더 | 최근 메타 생성 소요 시간(밀리초)을 초록색 배지로 표기 |
| `Routing meta generation exceeded SLA` | HistoryTimeline(신규) | 타임라인에 빨간 마커 표시, 상세 패널에는 original log message 원문 노출 |
| `meta_generation_wait_ms` (k6 trend) | Performance Insights 패널 | 최근 k6 측정치 탭에 최신 p95, p99 수치를 로드 |

## 화면 레이아웃 개요
1. **RoutingDetailModal**
   - Files 탭 상단에 "Meta Generation" 배지 추가: `성공 0.62 s` 형식.
   - SLA 초과 시 배지 색상 빨간색으로 변경하고 툴팁에 최근 로그 메시지 출력.
2. **Notification Center**
   - 업로드 완료 시 `metaLatency` 값이 SLA 이상이면 즉시 경고 배너 표시.
   - 경고 배너 클릭 시 History Timeline 뷰로 스크롤.
3. **Performance Insights 패널 (신규)**
   - k6 스크립트에서 산출된 `meta_generation_wait_ms` Trend를 그래프로 표현 (마지막 20회 측정).
   - `chunk_upload_complete_ms`와 비교해 SLA 준수 여부를 시각적으로 보여줌.

## 데이터 & 텔레메트리
- Frontend는 백엔드 로그 메시지를 `GET /api/routings/{id}/files` 응답에 포함된 `latestHistoryId`를 통해 조회.
- 새 메타 생성 이벤트가 발생하면 `HistoryService`에 기록된 `HistoryEntryDto`를 기반으로 UI에 전달.
- k6 측정치는 `tests/k6/chunk_upload.js` 실행 후 생성되는 JSON Summary를 수집하여 Insights 패널에 반영.

## 진행 상황
- 2025-09-25: 작업 착수. 기존 Sprint6 로그에 기재된 SLA 로그를 바탕으로 UX 요구사항 세부화 계획 수립.
- 2025-09-25: Docker 기반 SLA 재측정 결과(p95≈20.7s) 확보, UI 경고 흐름 우선순위 상향.

## 후속 작업
1. Notification Center 컴포넌트에 SLA 경고 상태 추가 (`StatusBadge` 재사용).
2. HistoryTimeline 생성 및 로그 메시지 바인딩.
3. k6 결과를 저장하는 CI 단계 추가 및 Performance Insights API 스텁 구현.
4. SLA 위반 시 Slack Webhook 발송 옵션 조사.

## 수정 이력
- 2025-09-25 Codex: 초기 버전 작성, meta SLA 로그 반영.
- 2025-09-25 Codex: 작업 착수 기록 추가.
- 2025-09-25 Codex: SLA 재측정 데이터 반영.




## 업데이트 기록 (2025-09-25)

- 2025-09-25 Codex: ~~Notification Center wireframe TBD~~ docs/design/wireframes/Sprint7/Notification_Performance.md 초안 작성, 참고 자료: docs/extracted_images/ 폴더.
- 2025-09-25 Codex: ~~SLA 알림 문구만 정의~~ Notification Center/Performance Insights 상호작용 흐름과 meta_generation_wait_ms KPI 요구사항 구체화.
- 2025-09-25 Codex: k6 재측정 결과(meta_generation_wait_ms p95=6534.8 ms, chunk_upload_complete_ms p95=3358.7 ms)를 Performance Insights 초기 수치로 반영하도록 문서에 기록.
## 업데이트 기록 (2025-09-26)
- 2025-09-26 Codex: Documented script_bug flag for meta SLA dashboard (0 ms baseline ignored in Performance Insights).
- 2025-09-26 Codex: scripts/performance/run-meta-sla.ps1 자동 측정 스크립트와 meta_sla_history.csv 로그를 Performance Insights 시각화에 연동 예정.

- 2025-09-26 Codex: ~~Sprint7 주간 마일스톤~~ 2025-09-26 하루 집중 추진 일정으로 재정렬, Notification Center·Performance Insights 산출물 병행 준비.

- 2025-09-26 Codex: ~~SLA 초기값 6534.8 ms 유지~~ JsonWorkerCount/MaxParallelJsonWrites 조정(6/6 → 8/8 → 4/4 → 6/2) 결과를 Performance Insights 데이터 시트에 추가, 각 측정 meta_generation_wait_ms p95 = 2553.5 / 6035.0 / 10668.3 / 11135.2 ms (모두 SLA ≤ 1 s 미달).
- 2025-09-26 Codex: k6 자동 측정 스크립트(scripts/performance/run-meta-sla.ps1) 작성, meta_sla_history.csv에 누적 기록하도록 구성.

## Milestone Plan

| Milestone | 기간 (KST) | 주요 작업 | 산출물 |
|-----------|------------|-----------|--------|
| M1 | ~~2025-09-29 ~ 10-03~~ 2025-09-26 | Notification Center 와이어프레임 확정, SLA 이벤트 페이로드 계약 | 최종 와이어프레임, API 계약서 |
| M2 | ~~2025-10-06 ~ 10-10~~ 2025-09-26 | Performance Insights 탭 UI, 목 데이터 연동 | KPI 카드 & 라인 차트, 임시 API |
| M3 | ~~2025-10-13 ~ 10-17~~ 2025-09-26 | SLA 경고 플로우, HistoryTimeline 딥링크 | 상호작용 프로토타입 |
| M4 | ~~2025-10-20 ~ 10-24~~ 2025-09-26 | 접근성/테마 검수, 사용자 피드백 수집 | A11y 체크리스트, 테마 가이드 |
| M5 | ~~2025-10-27 ~ 10-31~~ 2025-09-26 | 성능/QA 검증, 문서화 & 배포 준비 | 테스트 리포트, 배포 체크리스트 |

- 절대 지령: 모든 업무 지시는 문서에 기록하고 기존 지시는 취소선으로 남긴다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강




