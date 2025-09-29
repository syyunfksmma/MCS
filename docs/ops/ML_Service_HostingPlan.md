# ML Service Hosting Plan (2025-09-29)

## 환경
- Azure App Service (Linux) — S1
- Slot: staging, production (blue/green)
- Autoscale: CPU >70% 5분, 인스턴스 1→3

## 구성
- Container image from ACR `ml-routing-service`
- Key Vault references for secrets
- Logging: App Insights + Log Analytics workspace

## 배포 절차
1. GitHub Actions → ACR push
2. Staging slot deploy, smoke test
3. Swap to production

## DR/백업
- nightly backup to Blob Storage
- Terraform IaC 상태 저장

## 보안
- Private Endpoint + VNet
- Managed Identity for Storage/Redis

## 모니터링
- App Insights dashboard `ML-Routing-Service`
- Alerts: CPU, Error rate, Response time
