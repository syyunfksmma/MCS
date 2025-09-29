# MCMS pm2 Restart / Rollback Plan — Sprint8 D3

## 1. 목표
- pm2 기반 서비스 재시작과 롤백을 idempotent하게 수행하도록 표준 절차를 정의한다.

## 2. 절차
1. `scripts/automation/restart-mcms-services.ps1 -Services mcms-portal,mcms-api` 실행 (DryRun 옵션으로 사전 검증).
2. 재시작 후 `run-smoke-monitor.ps1 -Environment InternalStage -Notify` 실행.
3. 실패 시 `run-smoke-monitor.ps1` 결과 로그 확인 후 `notify-deploy.ps1 -EventType RolledBack` 발송.

## 3. 롤백 행동
- pm2 `pm2 reload` 실패 시 PowerShell 스크립트가 `Restart-Service`로 Windows 서비스 재기동.
- 필요 시 `Compare-FileHash.ps1`로 이전 설치 패키지 해시 검증 후 재배포.

## 4. 로그 & 보고
- 성공/실패 결과를 `docs/sprint/Sprint8_Log.md`와 `docs/logs/Timeline_YYYY-MM-DD.md`에 기록.
- Ops 커뮤니케이션 템플릿으로 Teams/이메일 공지.

*Codex — 2025-09-29 12:15 KST*
