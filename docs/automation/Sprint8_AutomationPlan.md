# Sprint 8 Automation Scope & Task Scheduler Draft

## 1. 목적
- run-smoke, check-offline-logs, notify-deploy 이벤트를 자동 스케줄링하여 야간 감시를 강화한다.

## 2. 자동화 항목
| 항목 | 스케줄 | 스크립트 | 출력 |
|------|--------|----------|------|
| Smoke 테스트 | 매일 06:00/18:00 | `scripts/deploy/run-smoke.ps1` | `artifacts/offline/logs/smoke_*.log` |
| 로그 용량 점검 | 6시간 간격 | `scripts/monitoring/check-offline-logs.ps1` | json 출력 + Teams 알림 |
| 알림 상태 리포트 | 매일 09:00 | `scripts/deploy/notify-deploy.ps1 -EventType Approved` | Teams 브로드캐스트 |

## 3. Task Scheduler 초안 (Windows)
```
Register-ScheduledTask -TaskName "MCMS-Smoke-AM" -Trigger @("Daily 06:00") -Action @{
  Execute = "pwsh";
  Argument = "-NoProfile -File scripts/deploy/run-smoke.ps1 -Environment InternalProd"
}
```

## 4. 후속 작업
- Output 로그를 Sprint8_Log 및 Timeline에 자동 반영하는 파워셸 스크립트 작성
- 실패 시 Ops 템플릿으로 자동 공지하는 Flow 연결

*Draft — Codex, 2025-09-29 12:09 KST*
