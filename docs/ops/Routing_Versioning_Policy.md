# Routing Version Naming & Mandatory Files Policy

<!-- PRD Reference: PRD_MCS.md §5.4 -->

## Version Naming Convention
- Format: `RV-{ProductCode}-{Revision}-{YYYYMMDD}-{nn}` (e.g., `RV-AXIS100-A-20251229-01`).
- Increment `{nn}` sequentially per day to preserve order even if multiple versions are published.
- Use UTC timestamps when generating the date portion to avoid regional drift.
- Store the version string in the meta JSON `versionName` property for traceability.

## Mandatory File Checklist
| File Type | Description | Required For | Notes |
| --- | --- | --- | --- |
| `.esprit` | Primary CAM routing file | All routings | Must pass validation script before Ready state. |
| `.pdf` | Process sheet for operators | Production releases | Include revision stamp on header. |
| `.xlsx` | Tooling list | Optional for prototype, mandatory for production. |
| `.zip` | NC code bundle | When exporting machine-specific programs. |

## Enforcement Rules
1. File uploads validate extension and checksum; re-uploads replace existing attachments.
2. Ready checklist verifies `.esprit` and `.pdf` presence before enabling the Ready button.
3. Approvers confirm tool list completeness for production routings; record exceptions in approval comment.
4. Worker queue logs missing mandatory files in `RoutingCompliance.log` for weekly review.

## Rationale
- Aligns with PRD requirements FR-5 and FR-6, ensuring manufacturing and QA receive complete packages.
- Supports automation by keeping metadata consistent across revisions and versions.

Update Sprint 11 log entry Z2 once the policy is circulated to stakeholders.
