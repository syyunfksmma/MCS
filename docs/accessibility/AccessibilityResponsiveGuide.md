# Accessibility & Responsive Design Guide (Phase 1 Draft)

## 1. Accessibility Principles
- WCAG 2.2 Level AA as baseline; focus on perceivable status indicators and keyboard support.
- Use semantic HTML structure (nav/main/aside) across ExplorerShell layout.
- Provide visible focus styles with 3:1 contrast; implement skip-to-content link.
- Announce SLA badges and smoke alerts via ria-live="polite" regions.
- Ensure modals (Routing Detail) trap focus and restore to trigger element.

## 2. Responsive Breakpoints
| Breakpoint | Width | Layout Strategy |
| --- | --- | --- |
| sm | 640px | Collapse filter rail into slide-over, dashboard cards stacked |
| md | 768px | Two-column Explorer with collapsible ribbon |
| lg | 1024px | Default desktop; filter rail pinned, ribbons expanded |
| xl | 1440px | Enable density switcher, show full audit trail |

## 3. Component Guidelines
- Buttons: Use design tokens tn-primary, tn-ghost; maintain min hit area 40x40px.
- Tables: Responsive via CSS grid fallback; include sticky headers and sort indicators with ria-sort attributes.
- Badges: Provide tooltip fallback text for colorblind-friendly states.

## 4. Testing Checklist
- Automated: axe-core integration in Playwright smoke, Storybook accessibility addon.
- Manual: Keyboard traverse Explorer filter, confirm modals accessible, verify responsive layout on Edge + Firefox + Chromium.
- Recording: Log outcomes in docs/accessibility/UAT_Manual_Checklist.md (section A11).

## 5. Distribution & Next Steps
- Shared with Product Owner and UX via Teams (channel #mcms-web) on 2025-09-29.
- Action: incorporate tokens in design system (Phase 3) and document components in Storybook.

## 6. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Draft accessibility + responsive guide published for Phase 1 checklist |
