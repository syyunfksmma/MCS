# MCMS CI/CD Pipeline Design (Phase 2)

## 1. Objectives
- Provide unified build/test/deploy workflow for Next.js + .NET hybrid.
- Ensure routing module smoke coverage (lint, vitest, Playwright) prior to promotion.
- Enable conditional benchmarks (Sprint12 pipeline) without blocking web deploy cadence.

## 2. Pipeline Stages
| Stage | Description | Tooling | Notes |
| --- | --- | --- | --- |
| setup | Restore Node/.NET toolchains, restore caches | Azure Pipelines NodeTool@0, UseDotNet@2 | Shares npm cache key `npm|$(Agent.OS)|package-lock.json` |
| lint-test | Run `npm run lint`, `npm run test:unit`, Playwright smoke | routing-ci.yml (LintRouting/TestRouting jobs) | Fail-fast on lint/test; artifacts stored under `$(Pipeline.Workspace)/test-results` |
| build | Next.js `npm run build`, .NET solution build | `scripts/build/build-all.ps1` | Emits `.next` artifacts + API binaries |
| package | Create deployable zip + offline package | `scripts/deploy/package.ps1` | Publishes to Azure Artifacts feed `mcms-offline` |
| deploy | Blue/Green slots (staging/production) | `scripts/deploy/routing-green.ps1`, `routing-blue.ps1` | Feature flag toggles invoked post-deploy |
| benchmark (conditional) | Sprint12 k6 + SQL path checks | `ci/benchmark-pipeline.yml` | Triggered via `bench=true` variable |

## 3. Quality Gates
- Lint + Vitest must be green.
- Playwright smoke must pass on Chromium (staging base URL).
- Compare-FileHash.ps1 verification logs attached to release summary.

## 4. Environments
| Env | Branch | Notes |
| --- | --- | --- |
| Dev | feature/* | On-demand pipeline with reduced stages (skip deploy) |
| Staging | main | Full pipeline, deploy to Green slot |
| Production | release/* | Manual approval step, Blue/Green swap |

## 5. Approvals
- Staging -> Production requires Product Owner + IT Infra sign-off.
- Pipeline approvals recorded in Azure with template `MCMS Deploy Approval`.

## 6. Monitoring & Alerts
- Integrate Azure Monitor webhook to Teams `#mcms-ops` on pipeline failure.
- Grafana dashboard `MCMS-CI-CD` tracks job durations, failure rate.

## 7. Next Actions
- Implement nightly dry-run stage referencing `docs/ops/Routing_DryRun_Report_2025-09-29.md`.
- Wire Playwright report publishing to `artifacts/testing/playwright/` for evidence.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial CI/CD pipeline design for Phase 2 checklist |
