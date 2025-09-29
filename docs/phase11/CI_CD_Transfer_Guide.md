# Phase11 CI/CD Transfer Guide — 2025-09-29

## Build & Test Pipeline Overview
| Stage | Tooling | Notes |
| --- | --- | --- |
| Install | pnpm install, dotnet restore | Node 20.11 / .NET 8.0.401. |
| Lint | pnpm lint, dotnet format --verify-no-changes | Pre-commit hook mirrors pipeline. |
| Unit Tests | pnpm test:unit, dotnet test | Vitest + xUnit; artifacts pushed to rtifacts/test-results. |
| Integration | pnpm test:e2e:ci (Playwright) | Headless Chromium via 
px playwright install --with-deps. |
| Package | pnpm build, dotnet publish | Outputs zipped into rtifacts/offline/MCMS_Setup_<timestamp>.zip. |
| Deploy | scripts/deploy/deploy-mcms.ps1 via GitHub Actions self-hosted runner | Uses 
otify-deploy.ps1 on success. |

## Release Branching
1. Feature branches → develop (CI required).
2. Release cut 
elease/<YYYYMMDD>; pipeline tags build.
3. Hotfix branches from 1 with same pipeline minus Playwright.

## Secrets & Approvals
- GitHub Actions secrets: MCMS_AZURE_SP, MCMS_SMTP, MCMS_GRAFANA_TOKEN.
- Manual approval for production deployment via nvironment: production gates.
- Artifact retention: 14 days, mirrored to \MCMS_SHARE\installers.

## Hand-off Actions
- ✅ Exported pipeline YAML to docs/ci/github-actions-mcms.yml.
- ✅ Registered fallback instructions for on-prem Azure DevOps pipeline.
- ✅ Documented runner specs (Windows Server 2022, 8 vCPU, 16 GB RAM).

> 작성: 2025-09-29 Codex
