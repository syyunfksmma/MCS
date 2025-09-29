# Explorer Ribbon & Filter Rail Final Specification

## 1. Ribbon
- Components: Quick Actions (Open, Approve, Download), SLA badge, breadcrumb.
- Layout: 56px height, tokens using `designTokens.color.primary`.
- Keyboard Support: `Alt+Shift+O` open, `Alt+Shift+A` approve.

## 2. Filter Rail
- Sections: Product Code, Group, Status, Date Range.
- Collapsible on <= 768px, slide-over using Ant Drawer.
- ARIA labels: `aria-label="Explorer filter options"`.

## 3. Email Verification UI Alignment
- Ribbon shows pending verification banner linking to `/auth/verify-email`.
- Filter rail disabled state when verification required.

## 4. Assets
- Figma Frame: `MCMS_Web_ExplorerRibbon_v3` URL appended.

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Finalized ribbon/filter spec |
