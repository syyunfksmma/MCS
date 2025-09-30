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

