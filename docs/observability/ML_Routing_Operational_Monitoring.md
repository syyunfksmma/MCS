# ML Routing Operational Monitoring Plan (2025-09-29)

## 지표
- Recommendation latency (avg, P95)
- Success/Error rate by endpoint
- Cache hit ratio (Redis)
- Feedback volume per day

## 대시보드
- Grafana `ML-Routing-Overview`
- App Insights Workbook `ML Recommendations`

## 알림
- Latency P95 > 400ms (5분) → Ops Slack
- Error rate > 1% → PagerDuty
- Cache hit < 70% → Data team 통보

## 로그
- FastAPI structured logs (JSON)
- Add-in telemetry forwarded via Event Grid

## 유지보수
- 월간 리포트 `reports/operations/ml_routing_monthly.md`
- 분기별 알림 튜닝 회의

