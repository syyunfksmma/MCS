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
- ~~`notify-deploy.ps1` jsonl 로그에 최신 이벤트 상태 기록 확인~~ (2025-09-29 Codex, docs/logs/Timeline_2025-09-29.md 14:05 기록)
- ~~Grafana 대시보드 지표가 정상 범위인지 검토~~ (2025-09-29 Codex, docs/logs/Ops_Comms_Precheck_20250929.md)
- ~~Smoke 테스트 결과 첨부 또는 링크~~ (2025-09-29 Codex, artifacts/offline/logs/, docs/logs/Ops_Comms_Precheck_20250929.md)
- ~~DR/롤백 시 Sprint6_DRPlaybook 참조 링크 포함~~ (2025-09-29 Codex, docs/sprint/Sprint6_DRPlaybook.md 확인)

## 4. 체크리스트 (발송 후)
- ~~Observability bundle 링크 첨부~~ (2025-09-29 Codex, docs/phase11/Ops_LogMetrics_Bundle.md)
- ~~Timeline_YYYY-MM-DD.md에 발송 시각 기록~~ (2025-09-29 Codex, docs/logs/Timeline_2025-09-29.md Wave10 기록)
- ~~Sprint6_Log.md에 Ops 공지 내용 요약~~ (2025-09-29 Codex, 14:54:45 항목 추가)
- ~~필요한 경우 Ops 기록 저장소(Confluence/PDF) 업데이트~~ (2025-09-29 Codex, Ops_Comms_Precheck_20250929.md 공유 계획)

## 5. 참고 링크
- Sprint6 Monitoring Dashboard: docs/sprint/Sprint6_Monitoring.md
- Alert Rules: monitoring/alerts/mcms_core.yaml
- Log Pipeline: docs/observability/LogPipeline.md
- DR Playbook: docs/sprint/Sprint6_DRPlaybook.md

*Draft by Codex — 2025-09-29 12:00 KST*

