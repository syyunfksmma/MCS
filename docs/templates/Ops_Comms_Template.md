# MCMS Ops Communication Template (Sprint6 D2 Draft)

## 1. 공지 개요
- **이벤트 유형**: {배포 승인/롤백/장애/정기 점검}
- **대상 채널**: Teams `#mcms-ops`, 이메일(선택)
- **작성자**: Codex
- **발송 시각**: {YYYY-MM-DD HH:MM KST}

## 2. 메시지 본문
```
[이벤트 요약]
- 환경: {InternalStage/InternalProd/Lab}
- 변경 내용: {주요 업데이트 또는 복구 작업}
- 상태: {완료/진행 중/롤백}
- 예상 영향: {사용자 영향 및 대응}

[모니터링]
- Grafana Dashboard: https://grafana.internal/d/mcms-s6-core
- Alert 상태: {경고 수치}
- run-smoke 결과: {성공/실패, 링크}

[로그 확인]
- Loki 쿼리: {예시 LogQL}
- 소스: logs/app, logs/deploy/notifications, artifacts/offline/logs/smoke_*.log

[후속 작업]
- 담당자: {이름}
- ETA: {예상 완료 시간}
```

## 3. 체크리스트 (발송 전)
- [ ] `notify-deploy.ps1` jsonl 로그에 최신 이벤트 상태 기록 확인
- [ ] Grafana 대시보드 지표가 정상 범위인지 검토
- [ ] Smoke 테스트 결과 첨부 또는 링크
- [ ] DR/롤백 시 Sprint6_DRPlaybook 참조 링크 포함

## 4. 체크리스트 (발송 후)
- [ ] Timeline_YYYY-MM-DD.md에 발송 시각 기록
- [ ] Sprint6_Log.md에 Ops 공지 내용 요약
- [ ] 필요한 경우 Ops 기록 저장소(Confluence/PDF) 업데이트

## 5. 참고 링크
- Sprint6 Monitoring Dashboard: docs/sprint/Sprint6_Monitoring.md
- Alert Rules: monitoring/alerts/mcms_core.yaml
- Log Pipeline: docs/observability/LogPipeline.md
- DR Playbook: docs/sprint/Sprint6_DRPlaybook.md

*Draft by Codex — 2025-09-29 12:00 KST*

