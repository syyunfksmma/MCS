# Routing Deployment Checklist (Blue/Green + Feature Flags)

## Go/No-Go Criteria
- Smoke CI (routing-ci) green within last 2 hours.
- Feature flag rollout plan documented (feature.search-routing).
- Ops on-call acknowledged rollback steps.

## Pre-Deployment
1. Validate staging environment health (`scripts/monitoring/health-check.ps1`).
2. Freeze routing edits in legacy Explorer (announce in Teams #mcms-ops).
3. Backup shared drive routing packages (snapshot ID BG-20250929).

## Deployment Steps
1. Deploy Next.js app to Green slot (`scripts/deploy/routing-green.ps1`).
2. Run `npm run test:e2e -- --project=chromium --grep "Routing E2E smoke"` against Green.
3. Flip feature flag `feature.search-routing` for pilot group via config service.
4. Swap traffic (Green -> production) after 15 min monitors remain green.

## Post-Deployment Validation
- Check Grafana dashboard `MCMS-Web-Infra` (CPU < 60%, error rate < 1%).
- Confirm offline package script executes (Compare-FileHash output).
- Updated timelines in docs/logs/Timeline_YYYY-MM-DD.md.

## Rollback Plan
- Use `scripts/deploy/routing-blue.ps1` to revert traffic.
- Disable feature flag `feature.search-routing`.
- Restore shared drive snapshot BG-20250929 if package diff detected.

## Approvals
- Product Owner sign-off (Teams message template appended in Ops_Comms_Template.md).
- IT Infra ack on TLS certificate validity.
