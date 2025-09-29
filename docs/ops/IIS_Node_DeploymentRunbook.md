# IIS + Node Deployment Runbook

1. 준비
   - Git 최신 상태 확인 및 `npm run build` 사전 실행.
   - `deploy-mcms.ps1 -Environment stage` 명령으로 스테이징 배포.
2. 검증
   - 배포 후 `npm run test:e2e -- --project=chromium --grep "Routing E2E smoke"` 실행.
   - `scripts/performance/run-ssr-loadtest.ps1 -BaseUrl https://stg.mcms.corp` 로 응답시간 확인.
3. 프로덕션 배포
   - `deploy-mcms.ps1 -Environment prod` 실행.
   - `docs/ops/Routing_BlueGreen_Checklist.md`에 정의된 Go/No-Go 확인.
4. 사후 조치
   - `notify-deploy.ps1` 실행으로 배포 알림 전송.
   - `docs/logs/Timeline_YYYY-MM-DD.md`에 배포 기록 추가.

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial deployment runbook 작성 |
