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
