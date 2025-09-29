# Siemens Teamcenter Pattern Review — 2025-09-29

## Observations
- Left navigation uses stacked accordion with 16px padding → mirrored via TreePanel sticky header.
- Ribbon actions grouped by context (Explorer primary actions left, secondary right) → applied in ExplorerRibbon component.
- Preview pane relies on 320px minimum width, fallback to drawer below 1024px → adopted for Workspace upload panel.

## Reuse Items
- Breadcrumb typography (12px uppercase, neutral-500) → ExplorerRibbon breadcrumbs.
- Dialog spacing (24px header/footer) → RoutingCreationWizard stepper modal.

## TODO
- Import Teamcenter iconography replacements (Feather/Phosphor mapping) by 2025-10-05.

> 작성: 2025-09-29 Codex
