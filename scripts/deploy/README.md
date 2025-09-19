# Deployment Scripts Guide

## Publish Commands
- API: dotnet publish ../../src/MCMS.Api/MCMS.Api.csproj -c Release -o publish/api
- Workers: dotnet publish ../../src/MCMS.Workers/MCMS.Workers.csproj -c Release -o publish/workers
- CmdHost: dotnet publish ../../src/MCMS.CmdHost/MCMS.CmdHost.csproj -c Release -o publish/cmdhost
- Client: dotnet publish ../../src/MCMS.Client/MCMS.Client.csproj -c Release -o publish/client

> 운영 환경 배포 시 IIS/Windows 서비스 설정은 docs/Phase10_DeploymentOps.md를 참고하세요.
