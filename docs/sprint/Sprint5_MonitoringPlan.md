# Sprint 5 모니터링/알림 확장 제안

## 1. Web Vitals → Grafana 수집 흐름
1. Next.js 클라이언트가 /api/web-vitals에 JSONL append (
eports/web-vitals.jsonl).
2. 수집 에이전트(예: Promtail/Telegraf)에서 JSONL tail 후 Loki/Influx로 전송.
3. Grafana 대시보드에서 LCP/FID/CLS 타임라인 및 알람 규칙 정의.

## 2. 추천 구성
- **Telegraf 플러그인**: 	ail + processors.converter 로 JSON 필드를 flatten.
- **Metric 명세**
  - mcs_web_vitals_lcp_seconds
  - mcs_web_vitals_cls
  - mcs_web_vitals_fid_seconds
  - 라벨: page, metric, nvironment
- **알람 규칙**
  - LCP p95 > 2.5s (5분) → Ops 채널
  - CLS p95 > 0.15 (15분) → UX 채널

## 3. CI 가드 연계
- Lighthouse JSON 점수 검증 후 실패 시 Slack 웹훅 전송
- Web Vitals JSONL을 nightly job에서 Telegraf로 업로드하는 스케줄 추가

## 4. TODO
- [x] Telegraf 구성 파일 deploy/telegraf/web-vitals.conf 체크인 (2025-09-29 Codex, monitoring/telegraf/web-vitals.conf)
- [x] Grafana Dashboard UID 등록 (Ops) (UID: mcms-s6-core 문서화)
- [x] Alertmanager 라우팅 규칙 작성 (monitoring/alerts/mcms_core.yaml 참조)

## 5. 레퍼런스
- Google Web Vitals best practices
- Grafana Loki LogQL 변환 샘플 포함 (Appendix 예정)
