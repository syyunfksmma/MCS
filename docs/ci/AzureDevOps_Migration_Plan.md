# Azure DevOps Pipeline Migration Plan — 2025-09-29

## 목표
- 기존 GitHub Actions 파이프라인을 Azure DevOps YAML로 변환하여 사내 에이전트에서 실행.

## 단계
1. 프로젝트 생성: `MCMS-Pipelines` → Repos mirror 설정.
2. Service connection 생성 (GitHub PAT, KeyVault).
3. 변환 작업: docs/ci/github-actions-mcms.yml → `.ado/pipelines/mcms-ci.yml`.
4. Self-hosted Windows agent 풀 등록 (WinServer2022, Node 20, .NET 8).
5. 변수 그룹 설정: `SMTP_HOST`, `GRAFANA_TOKEN`, `AZURE_SP`.

## 일정
| 단계 | 담당 | 마감 |
| --- | --- | --- |
| YAML 변환 초안 | Codex | 2025-10-02 |
| Agent 등록 | Ops | 2025-10-03 |
| 시범 실행 | Codex/Ops | 2025-10-04 |

> 작성: 2025-09-29 Codex
