# Phase 7 - 성능 및 신뢰성 계획

## 1. 주요 성능 지표
- Routing 목록 조회: 500건 이하 로딩 3초 이내.
- 파일 업로드 처리량: 동시 5건 처리 시 평균 10MB/s 이상 유지.
- Esprit 실행 큐 대기 시간: 2분 이내 시작.
- History 조회: CAM Rev 200개 기준 2초 이내.

## 2. 벤치마크 전략
- WebAPI 부하 테스트: k6 스크립트 작성(`k6/scripts/routing_list.js`).
- 파일 업로드 스트레스: PowerShell 병렬 업로드(`scripts/tests/Upload-Stress.ps1`).
- CMD 명령 처리: Worker 큐에 100개 명령 투입 후 처리 시간 측정.

## 3. 캐싱/튜닝 포인트
- DB: Routing/History 조회용 인덱스 (`ItemId+Rev`, `CamRev`, `ChangedAt`).
- API: Response Caching (Item/Rev 트리), ETag 사용.
- 클라이언트: 로컬 캐시 TTL 6시간, 변경 감지 시 무효화.
- Worker: MSMQ Prefetch 10건, Retry 3회.


## 3-1. SQL Server 엔터프라이즈 기능 활용
- History 테이블: Clustered Columnstore 인덱스 구성으로 압축 + 분석 조회 성능 확보, 주기적 `ALTER INDEX ... REORGANIZE` 자동화.
- 큐 테이블: 메모리 최적화(`MEMORY_OPTIMIZED = ON`) 테이블 + 네이티브 컴파일 프로시저로 Worker 지연 최소화, Durable 옵션은 SCHEMA_AND_DATA.
- Query Store 자동 계획 회귀 감지: `sp_query_store_force_plan` 절차와 `sys.query_store_plan` 모니터링, Azure Monitor/SQL Agent 알림과 연계.
- 장기 실행 쿼리 경고: Extended Events 세션으로 Columnstore/Memory-Optimized 관련 wait 추적.

## 4. 대용량 파일 처리

## 4. UI 성능
- 백그라운드 Prefetch: `VirtualizingCollectionView`의 `LoadMoreItemsAsync` 호출 전에 인접 페이지(±1) 비동기 미리 불러오기, UI 스레드는 `Dispatcher.InvokeAsync`로 최소화.
- 캐시 무효화 Hook: API WebSocket/SignalR 이벤트 수신 시 `IncrementalLoadingCollection.RefreshAsync` 호출하여 트리/그리드 바인딩 갱신.
- KPI: Item/Rev 트리 스크롤 1000건 기준 120ms 이하 프레임 유지, Routing 그리드 페이지 전환 200건 로드 < 500ms, 가상화 Hit Ratio 90% 이상.

## 5. 대용량 파일 처리

- Chunked Upload (업로드 시 100MB 조각) 옵션 검토.
- 다운로드는 Range 지원, 실패 시 재시도 안내.
- 파일 I/O 모니터링: Windows Performance Counter (SMB Sessions, Disk Queue).

## 6. 장애 대응
- Esprit/ SolidWorks 장애 시 재시도 로직 + 관리자 알림 이메일.
- Worker 다운 시 자동 재시작(Windows Service Recovery), 큐 메시지 보존.
- DB 장애 대비: SQL Server Log Shipping + Failover 문서화.

## 7. 테스트 일정
| 주차 | 항목 |
| --- | --- |
| Week 3 | 초기 부하 테스트, 캐시 튜닝 |
| Week 4 | 파일 스트리밍/업로드 성능 검증 |
| Week 5 | End-to-End 워크플로우 스트레스 테스트 |

## 8. 모니터링 대시보드
- Grafana/Elastic: API 응답시간, 오류율.
- Windows Server PerfMon 템플릿: Disk IO, Network.
- CmdHost 로그: 처리 건수, 실패율 시각화.

## 9. 남은 과제
- k6 실행 환경(내부망) 마련.
- Grafana vs Kibana 대시보드 선택.
- 자동 알림(Email/SMS) 채널 확정.

## 9. OpenTelemetry 계측 계획
- 범위: `MCMS.Api`(WebAPI), `MCMS.Workers`(큐 소비자), `MCMS.CmdHost`(원격 명령) 애플리케이션.
- 도입 단계: .NET OpenTelemetry SDK → OTLP Exporter → Collector → Backend(Grafana Tempo/Loki 또는 Elastic APM).

### 9.1 Trace 계측
- `MCMS.Api`: 주요 HTTP 엔드포인트(라우팅 목록, 파일 업로드, History 조회)에 Server Span 추가, `itemId`, `camRev` 태그 부여.
- `MCMS.Workers`: 큐 메시지 수신 시 Consumer Span, 외부 시스템 호출(DB, Esprit) 하위 Span 구성, 재시도 횟수/대기시간 기록.
- `MCMS.CmdHost`: 명령 수신/실행/결과 반환을 Span으로 분리, 호출자 AD 정보 태그 포함.
- Trace-Log 상관: 모든 Span Id를 구조적 로그 필드(`trace_id`, `span_id`)에 삽입하여 Kibana/Loki 조회 시 Trace jump 지원.

### 9.2 Metrics 계측
- 공통: OpenTelemetry Meter API로 `request.duration`, `queue.process.duration`, `command.execution.duration` Histogram 수집.
- `MCMS.Api`: 성공/오류 카운터, 요청 바이트/응답 바이트 Gauge.
- `MCMS.Workers`: 큐 길이 Gauge(`msmq.depth`), 처리 성공률 Counter, 재처리 카운터.
- `MCMS.CmdHost`: 명령별 처리 시간 Histogram, 실패 카운터, 동시 실행 수 Gauge.
- Metrics-Trace 연계: Span Attribute `operation.key`를 Metric tag로 사용해 대시보드 Drill-down 구성.

### 9.3 로그 상관
- Serilog/ILogger 구조 로그에 `trace_id`, `span_id`, `operation.key` 추가.
- 예외 로그는 Trace EventId와 Metrics의 `status=error` 태그를 공유하여 삼중 상관.
- 로그 샘플링: 정상 로그는 10% 샘플링, 오류/경고는 무조건 전송.

### 9.4 SLO 정의
- WebAPI 가용성: 99.5% (5분 단위로 `http.server.duration` 오류율 < 0.5%).
- WebAPI 응답시간: 95번째 백분위수 2초 이하(`routing/list`, `history` 엔드포인트).
- Worker 처리: 메시지 처리 성공률 99% 이상, 평균 대기시간 60초 이하(`queue.process.duration`).
- CmdHost 명령 성공률: 98% 이상, 실패 시 15분 내 알림 후 재처리.
- SLO 위반 시: Grafana Alert + Microsoft Teams Webhook, 2차 알림 SMS.
