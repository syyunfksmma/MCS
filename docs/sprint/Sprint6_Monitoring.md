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
- [x] Alert Rule YAML (`monitoring/alerts/mcms_core.yaml`) 작성. (2025-09-29 Codex)
- [x] Loki 파이프라인 구성 파일 체크인. (2025-09-29 Codex, config.mcms.yaml)
- [x] Dashboard JSON을 artifacts/monitoring 경로에 저장. (2025-09-29 Codex, grafana_mcms_sprint6.json)
- [x] Ops 템플릿에 Grafana 링크 추가. (2025-09-29 Codex, Ops_Comms_Template.md)

*작성: 2025-09-29 11:50 KST, Codex*
