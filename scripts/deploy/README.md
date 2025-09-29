# Deployment Scripts Guide

## Publish Commands
- API: dotnet publish ../../src/MCMS.Api/MCMS.Api.csproj -c Release -o publish/api
- Workers: dotnet publish ../../src/MCMS.Workers/MCMS.Workers.csproj -c Release -o publish/workers
- CmdHost: dotnet publish ../../src/MCMS.CmdHost/MCMS.CmdHost.csproj -c Release -o publish/cmdhost
- Client: dotnet publish ../../src/MCMS.Client/MCMS.Client.csproj -c Release -o publish/client

> 운영 환경 배포 시 IIS/Windows 서비스 설정은 docs/Phase10_DeploymentOps.md를 참고하세요.

## Approval / Rollback Notifications
- `notify-deploy.ps1` 스크립트는 배포 승인/롤백 이벤트를 Teams Webhook으로 전송하고 `logs/deploy/notifications/*.jsonl` 파일에 기록합니다.
- Webhook URL은 환경 변수 `MCMS_DEPLOY_TEAMS_WEBHOOK` 또는 `-WebhookUrl` 매개변수로 지정합니다.
- 사용 예시: `./notify-deploy.ps1 -EventType Approved -Environment InternalProd -Revision 2025.09.29 -ChangeRequestId CR-152 -Notes 'Stage 승인 완료'`.
