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
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
# Sprint 6 Monitoring Dashboard — Grafana/Prometheus Spec (Draft)

## 1. 개요
- 목적: Sprint6 C1 항목을 충족하기 위해 MCMS Portal/Explorer의 핵심 지표를 Grafana에서 시각화하고 Prometheus/Loki 데이터를 통합한다.
- 범위: Portal SLA, Chunk Upload 메타 지표, Web Vitals, Infrastructure(App Pool, Worker 큐), 알림 연동 준비.
- 선행 작업: Sprint5_MonitoringPlan.md의 Web Vitals 수집 흐름, meta_sla_history.csv(2025-09-26) 기록, Sprint6_BulkExecutionPlan 트랙 C.

## 2. 데이터 소스 매핑
| Source | 경로/엔드포인트 | 수집 방식 | 메트릭/필드 |
|--------|----------------|-----------|-------------|
| Prometheus | `/metrics` (Portal, API, Workers) | dotnet_runtime + custom exporter | `mcs_request_duration_seconds`, `mcs_worker_queue_depth`, `system_cpu_usage` |
| Loki / JSONL | `logs/app`, `logs/deploy/notifications` | Promtail tail | `level`, `message`, `eventType`, `webhookStatus` |
| File-based SLA | `docs/sprint/meta_sla_history.csv` | Telegraf exec + csv parser | `meta_p95_ms`, `complete_p95_ms`, `iteration_p95_ms` |
| Web Vitals | `/api/web-vitals` JSONL | Telegraf tail → Prometheus remote_write | `mcs_web_vitals_lcp_seconds`, `mcs_web_vitals_cls`, `mcs_web_vitals_fid_seconds` |
| Smoke Tests | `artifacts/offline/logs/smoke_*.log` | Loki multiline pipeline | `check`, `status`, `latencyMs` |

## 3. 대시보드 레이아웃
| Row | Panel | 타입 | 쿼리/조건 | 메모 |
|-----|-------|------|-----------|------|
| R1 | Deployment Status | Stat + Sparkline | `count_over_time({stream="notify"} | eventType="Deployed" [$__range])` | 최근 배포 횟수/상태 표시 |
| R1 | Alert Noise Gauge | Gauge | `sum(rate(mcs_alert_notifications_total{severity="warning"}[5m]))` | C2 튜닝 시 감소 여부 확인 |
| R2 | Portal SLA Trend | Time series | `histogram_quantile(0.95, sum by (le) (rate(mcs_request_duration_seconds_bucket{route="/api/search"}[5m])))` | 1.5s 목표 대비 |
| R2 | Client SLA Overlay | Time series | CSV ingest → `meta_p95_ms` | meta SLA와 서버 SLA 비교 |
| R3 | Chunk Upload p95/p99 | Time series | `histogram_quantile(0.95, rate(mcs_chunk_complete_ms_bucket[5m]))` | F1/F2 대비 포커스 |
| R3 | Worker Queue Depth | Time series | `avg_over_time(mcs_worker_queue_depth[5m])` | pm2/Worker 부담 확인 |
| R4 | Web Vitals Heatmap | Heatmap | `mcs_web_vitals_lcp_seconds{page=~"Explorer|Workspace"}` | UX 품질 감시 |
| R4 | CLS Distribution | Bar gauge | `mcs_web_vitals_cls` | 0.1~0.25 구간 표시 |
| R5 | Smoke Test Matrix | Table | Loki LogQL: `{app="run-smoke"} | json | line_format "{{check}} → {{status}}"` | Stage/Prod 성공/실패 정리 |
| R5 | Notification Timeline | Logs | Loki LogQL: `{stream="notify"}` | A3 notify 결과 시각화 |

## 4. 패널별 임계치/알림 초안
- Portal SLA p95 > 1.5s (5분 연속) → Severity: warning · Teams `#mcms-ops` 전송.
- Portal SLA p95 > 2.0s (5분 연속) → Severity: critical · OpsGenie escalation.
- Chunk Upload p95 > 20s (연속 2회) → 성능 개선 플로우(F1/F2) 즉시 실행.
- Worker Queue Depth > 50 (10분) → PM2 재시작 가이드.
- LCP p95 > 2.5s (15분) → UX 채널 알림, Explorer UX 트랙과 연계.
- Smoke Test 실패 2회 이상 → 자동 롤백 검토, Sprint6_DRPlaybook 절차 시행.

## 5. 구현 체크리스트 (C1)
1. Grafana 폴더 `MCMS/Sprint6` 생성, UID 예: `mcms-s6-core`.
2. Prometheus 스크레이프 대상에 Portal/API/Worker exporter 등록.
3. Telegraf/Loki 파이프라인에서 meta_sla_history.csv, smoke 로그 tail.
4. Dashboard JSON(`artifacts/monitoring/grafana_mcms_sprint6.json`) 내보내기.
5. 대시보드 저장 후 `notify-deploy.ps1 -EventType Approved -Environment InternalStage -Notes "C1 Dashboard Reserved"` 발송.

## 6. 검증 및 보고
- 검증 절차: run-smoke.ps1 Stage → Grafana Smoke Matrix에 반영 확인, `npm run test:regression` 결과를 로그 패널에 첨부.
- 보고: Timeline, Sprint6_Log, Ops 커뮤니케이션 템플릿(D2)에 대시보드 링크 추가.
- 남은 C2/C3 작업은 본 대시보드 알람 라우팅 및 로그 보존 전략을 이어서 사용.

## 7. 후속 TODO
- Alert Rule YAML (`monitoring/alerts/mcms_core.yaml`) 작성. (2025-09-29 Codex)
- Loki 파이프라인 구성 파일 체크인. (2025-09-29 Codex, config.mcms.yaml)
- Dashboard JSON을 artifacts/monitoring 경로에 저장. (2025-09-29 Codex, grafana_mcms_sprint6.json)
- Ops 템플릿에 Grafana 링크 추가. (2025-09-29 Codex, Ops_Comms_Template.md)

*작성: 2025-09-29 11:50 KST, Codex*

