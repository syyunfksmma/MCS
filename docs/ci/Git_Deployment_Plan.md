# Git & Deployment Pipeline Alignment — 2025-09-29

## Branching Model
- `v1` — production branch
- `develop` — integration branch (CI required)
- Feature branches `feature/*` → PR to `develop`
- Release branches `release/YYYYMMDD`

## CI Flow
1. GitHub Actions (docs/ci/github-actions-mcms.yml) runs lint/tests/build.
2. Artifacts uploaded to `mcms-offline` package.
3. Manual approval gates for production deploy.

## CD Flow
- `scripts/deploy/deploy-mcms.ps1` executed by runner on approval.
- `notify-deploy.ps1` posts status to Ops channel.

> 작성: 2025-09-29 Codex
