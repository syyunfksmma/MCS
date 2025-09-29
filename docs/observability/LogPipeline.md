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
# MCMS Log Pipeline & Retention Plan (Sprint6 C3 Draft)

## 1. 개요
- 목적: Sprint6 C3 항목을 수행하여 Portal/API/Worker/Automation 로그를 일관된 파이프라인으로 수집하고 보존 정책을 정의한다.
- 배경: Sprint6 C1 대시보드, C2 Alert Rule에 필요한 로그 기반 지표(LogQL, smoke 실패 카운트 등)를 안정적으로 제공해야 한다.
- 작성 시각: 2025-09-29 11:58 KST, Codex.

## 2. 로그 소스 & 경로
| 구분 | 경로/엔드포인트 | 포맷 | 주요 필드 | 소비처 |
|------|----------------|------|-----------|--------|
| 애플리케이션 | `logs/app/*.log` | JSON | level, message, requestId, route | Loki → Grafana Logs |
| 배포 알림 | `logs/deploy/notifications/*.jsonl` | JSONL | timestamp, eventType, webhookStatus | Loki → Deployment Status 패널 |
| Smoke 테스트 | `artifacts/offline/logs/smoke_*.log` | 텍스트 | check, status, elapsed | Loki multiline pipeline → Smoke Matrix |
| Chunk Upload 성능 | `artifacts/perf/*.json` | JSON | meta_p95_ms, complete_p95_ms | Telegraf exec → Prometheus |
| Web Vitals | `/api/web-vitals` (JSONL) | JSON | lcp, fid, cls | Telegraf tail → Prometheus |

## 3. 파이프라인 구성
```
[File/HTTP sources]
    → Promtail (File, JSON, Multiline stages)
        → Loki (tenant: mcms-core)
            → Grafana (Logs + LogQL derived metrics)
    → Telegraf (exec + tail inputs)
        → Prometheus remote_write
            → Grafana (Metrics panels)
```

### 3.1 Promtail 설정 초안
- 파일 타겟: `logs/app/*.log`, `logs/deploy/notifications/*.jsonl`, `artifacts/offline/logs/smoke_*.log`
- 공통 레이블: `job="mcms-portal"`, `env="internal"`
- Multiline 파서: Smoke 로그는 `^[0-9]{4}-` 기준으로 새 이벤트를 구분하고 `check:` 패턴에서 `mcs_smoke_failure_total` 메트릭을 증가시킨다.
- JSON stage: 배포 알림 로그에서 `eventType`, `webhookStatus`를 추출해 Alert Noise Gauge에서 활용.

### 3.2 Telegraf 설정 초안
- `[[inputs.exec]]` + `data_format = "csv"` 로 `docs/sprint/meta_sla_history.csv` ingest.
- `[[inputs.tail]]` 로 Web Vitals JSONL -> `processors.converter` 로 float 변환 → `mcs_web_vitals_*` metrics 유지.
- 출력: Prometheus remote_write(or Influx fallback) → Grafana Datasource `mcms-telegraf`.

## 4. 보존 정책
| 구분 | 기본 보존 기간 | 확장 보관 | 근거 |
|------|---------------|----------|------|
| Loki Logs (app/deploy/smoke) | 14일 | 중요 사고 시 수동 아카이브 (`artifacts/log-archive/`) | Disk 50GB 기준, 1인 운영 단순화 |
| Prometheus Metrics | 30일 | 장기 보존은 CSV export | Core SLA 추세 확인 |
| Smoke 로그 원본 | 30일 | 주요 장애 시 Sprint6_DRPlaybook 첨부 | 롤백 근거 |
| Deployment jsonl | 30일 | 배포 감사 필요 시 90일까지 수동 보존 | Notify 감사 |

## 5. Alert 연동 (C2 참고)
- `mcs_smoke_failure_total`: Promtail LogQL `sum by(service)(count_over_time({app="run-smoke", status="FAIL"}[10m]))` → Alert `MCMSmokeFailures`.
- `mcs_alert_notifications_total`: notify 로그에서 webhookStatus != "sent" 집계 → Alert Noise Gauge.
- Worker 큐/Portal SLA 메트릭은 Prometheus exporter에서 직접 측정, 알람 라우팅은 `monitoring/alerts/mcms_core.yaml` 참고.

## 6. 검증 절차
1. 로컬 환경에서 Promtail config dry-run (`promtail --config.file ... --dry-run`).
2. Loki `logcli query` 로 최근 배포/Smoke 로그가 정규화됐는지 확인.
3. Telegraf `--test` 로 meta SLA CSV ingest 결과 확인.
4. Grafana 탐색기에서 LCP/CLS 패널 미리보기 확인.
5. Alertmanager `amtool` 로 샘플 경보 firing 여부 테스트 → notify/ops 채널에 로그 기록.

## 7. TODO
- [x] monitoring/promtail/config.mcms.yaml 구성안 작성 후 repo 반영.
- [x] ~~Telegraf 설정(monitoring/telegraf/web-vitals.conf) 초안화.~~ (2025-09-29 Codex, monitoring/telegraf/web-vitals.conf)
- [x] ~~Loki 테이블 retention (14일) 설정값 재검증.~~ (2025-09-29 Codex, monitoring/loki/retention-policy.md)
- [x] ~~C3 완료 후 Ops 템플릿(D2)에 로그 확인 섹션 추가.~~ (2025-09-29 Codex, docs/templates/Ops_Comms_Template.md)

*갱신: 2025-09-29 15:50 KST, Codex*

