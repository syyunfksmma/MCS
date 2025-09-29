# Ongoing Governance Cadence (2025-09-29)

## 1. Weekly MCMS API Sync
- 일정: 매주 화요일 09:30 KST (30분, Teams).
- 참가자: API Lead, Frontend Lead, Ops, Codex.
- 아젠다: 통합 이슈 triage, 계약 변경, 로그 검토.
- 로그: `docs/api/logs/Weekly_API_Sync_YYYYMMDD.md` 템플릿 사용.

## 2. Bi-weekly Telemetry Dashboard Review
- 일정: 격주 목요일 16:00 KST.
- 지표: 검색 P95, 업로드 성공률, 공유 드라이브 지연, 오류율.
- 도구: Grafana Dashboard `MCMS-Routing`, PowerBI Export.
- 결과 기록: `reports/telemetry/biweekly_summary_YYYYMMDD.md`.

## 3. Release Change Log Maintenance
- 파일: `docs/releases.md`.
- 업데이트 절차: 배포 후 24시간 내 주요 변경/테스트/롤백 링크 추가.
- PR 체크리스트: `docs/templates/PR_Template.md`에 Change Log 항목 포함.

## 4. PRD Traceability Enforcement
- 규칙: 모든 Story에 PRD ID(FR-1~FR-18) 태그.
- Jira 자동화: Label `PRD-FR-*` 없으면 Transition 차단.
- 검증: `scripts/reporting/check-prd-traceability.ps1` 주 1회 실행.

## 커뮤니케이션
- Slack #mcms-governance에 주간 요약 게시.

## 타임라인
- Wave17 S57~S60 기록.
