# Feature Flag & Environment Variable Management

## 1. Panel Overview
- Component: `AdminFeatureFlagsPanel` renders list of flags with toggle, rollout percentage, owner, and last updated time.
- Environment selector defaults to staging; integrates with `/api/admin/feature-flags` mock service.

## 2. Workflow
1. Operator selects flag (e.g., `feature.search-routing`).
2. Adjust rollout percentage (0-100) and toggle state.
3. Change environment dropdown to update config (`dev`, `stage`, `prod`).
4. Submit updates → API call `PATCH /api/admin/feature-flags/{id}`.

## 3. Environment Variables
- Stored via Key Vault; panel triggers pipeline variable refresh using `notifyDeploy.ps1` webhook.
- Non-flag variables (e.g., `NEXT_PUBLIC_BLOB_URL`) managed under Environment tab.

## 4. Safeguards
- Production toggles require confirmation modal (implemented in panel via `Modal.confirm`).
- Audit log entry appended using `logAdminAction` helper.

## 5. Next Actions
- Add inline search for flag keys.
- Surface last-change diff (pre/post JSON) in audit panel.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Documented feature flag/env management process for Phase7 |
