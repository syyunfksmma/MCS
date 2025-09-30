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
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

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
# FileStorage Event Monitoring Playbook

## 목표
- `MCMS.FileStorage` EventSource에서 노출하는 EventCounter(`meta-json-queue-length`, `meta-json-write-duration-ms`, `meta-json-queue-wait-ms`)를 주기적으로 수집한다.
- 수집된 데이터를 NDJSON으로 저장하고, Promtail/Logstash 등을 통해 Grafana 대시보드에 반영한다.
- meta SLA 변화가 감지되면 Sprint6 로그(`docs/sprint/Sprint6_Routing_Log.md`)에 p95 추이를 기록한다.

## 구성 요소
1. **Collector Script**: `scripts/performance/monitor-meta-json.ps1`
   - `dotnet-counters monitor --format json`을 사용해 EventCounter를 스트리밍 수집.
   - PID를 직접 지정하거나 기본값(`MCMS.API`) 프로세스를 자동 탐색.
   - 키보드 `Q` 입력 또는 설정 시간(`-DurationSeconds`) 이후 자동 종료.
   - 결과는 NDJSON (`timestamp`, `processId`, `counters`) 형태로 저장.

2. **Uploader (선택)**
   - NDJSON 파일을 Promtail, Azure Monitor, Splunk 등의 수집 에이전트 경로로 이동.
   - 예: Promtail에서 `pipeline_stages`를 사용해 `counters` 필드를 flatten한 후 Grafana Loki에 전송.

3. **Dashboard Wiring**
   - Grafana에서 `meta-json-queue-length`의 p50/p95/p99, `write-duration`의 이동 평균, `queue-wait`의 SLA 초과 건수를 패널로 작성.
   - NDJSON이 Loki에 저장되어 있다면 `counters['MCMS.FileStorage']['meta-json-queue-length']['Mean']` 식으로 접근.

## 실행 절차
```powershell
# 5분 동안 수집 (PID 자동 탐색)
./scripts/performance/monitor-meta-json.ps1 `
    -ProcessName 'MCMS.API' `
    -DurationSeconds 600 `
    -RefreshIntervalSeconds 5 `
    -OutputPath 'logs/meta-json-counters.ndjson'
```
- 수집 중 `Q` 입력 시 즉시 종료.
- 실패 시 stderr 로그를 확인하고 `dotnet-counters` 바이너리 존재 여부 및 권한을 검증.

## 수집 데이터 파이프라인
1. **저장소**: `logs/meta-json-counters.ndjson`
2. **인제스트**: Promtail/Fluent Bit/Logstash 등으로 대상 모니터링 플랫폼 전송
3. **가공**: 각 행을 JSON으로 파싱 → `counters.mean`, `counters.percentiles` 값을 메트릭 라벨로 확장
4. **대시보드**: Grafana에서 `meta-json-queue-length` p95가 SLA(<=1 s)를 초과하면 Alerts 발송

## 알림 정책
- `meta-json-queue-wait-ms` p95 > 1000 (1 s)인 경우 **Warning**
- 3분 연속으로 p95 > 2000인 경우 **Critical**
- Alert 발생 시 Sprint6 로그와 meta_sla_history.csv에 timestamp, counter snapshot 기록

## 후속 작업
- CI 파이프라인에 `monitor-meta-json.ps1`를 1일 2회 크론으로 실행하도록 작업 스케줄러 등록
- 장기 보관을 위해 NDJSON -> parquet 변환 Job을 추가 검토
- dotnet-counters 실행 계정이 MCMS.API 프로세스에 attach할 수 있도록 관리자 권한/SeDebugPrivilege 준비

