# Stage 3 Workspace Enhancements (2025-10-02)

## Routing Version Management
- Exposed `GET /api/routings/{routingId}/versions` and `PATCH /api/routings/{routingId}/versions/{versionId}` for primary toggle and legacy visibility control.
- Added `IRoutingVersionService` with sibling aggregation, legacy hidden timestamps, and history journaling (`RoutingVersionPromoted`, `RoutingVersionLegacyVisibilityChanged`).
- Explorer detail modal renders "Versions" tab with legacy filter, expandable audit timeline, and permission-gated promote/legacy actions.

## SolidWorks Replace Flow
- Implemented `POST /api/routings/{routingId}/solidworks/replace` to link SolidWorks assemblies per routing revision.
- Workspace upload panel supports replace confirmation dialog, telemetry events (`solidworks_replace_*`), and result banner with validation feedback.
- Recorded history entries for replace events and exposed presence status via `GET /api/routings/{routingId}/solidworks`.

## mcms-explorer Protocol Integration
- Explorer ribbon button launches `mcms-explorer://open?path={sharedPath}` guarded by `canOpenExplorer` permission.
- Added fallback warnings when shared paths or permissions are missing, ensuring accessibility compliance.
- Unit tests cover ribbon button states and protocol invocation guardrails.

## QA Notes
- Backend coverage extended via `RoutingVersionServiceTests` and `SolidWorksLinkServiceTests`.
- TypeScript contract `RoutingVersion` updated with legacy metadata to align UI validation.
- Refer to docs/testing/QA_Shakeout_Log.md for verification checklist linkage.
