# Figma → Code Handoff Guide (Phase 3)

## 1. File Structure
- Master file: `MCMS_Web_DesignSystem.fig`
- Key pages: Tokens, Components, Screens (Explorer, Workflow, Admin)
- Naming convention: `Component/Variant/State` (e.g., `Button/Primary/Disabled`)

## 2. Export Checklist
| Step | Description | Owner |
| --- | --- | --- |
| Token sync | Use Figma Tokens plugin → export JSON, import to `src/styles/tokens.ts` | Codex |
| Component spec | Ensure auto layout + constraints documented in component notes | UX |
| Link mapping | Add hyperlink to Storybook stories under component description | UX |

## 3. Annotation Standards
- Use Figma comments with prefix `[DEV]` for implementation notes.
- Provide spacing values in multiples of 4px.
- Document interactive states (hover, active, focus) with variant label.

## 4. Delivery Process
1. UX publishes page to shared link (`View Only`).
2. Codex downloads token JSON and merges into repository.
3. Storybook story updated to reference design URL (see `stories/ExplorerShell.stories.tsx`).

## 5. Tools & Integrations
- Figma Tokens plugin → exports to `.json` stored at `artifacts/design/tokens/`.
- Zeplin fallback: if Figma unavailable, export via Zeplin and attach mapping table.

## 6. Revision Tracking
- Document updates in `docs/design/Phase3_DesignSystem_Changelog.md`.
- Version label format: `2025-09-29.v1`.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial Figma handoff guide created for Phase3 checklist |
