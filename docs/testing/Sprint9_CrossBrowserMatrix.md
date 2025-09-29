# Sprint 9 Cross-Browser Regression Matrix

| Scenario | Chromium (latest) | Edge 125 | Firefox 129 | Notes |
| --- | --- | --- | --- | --- |
| Drag & Drop routing reorder | ✅ | ✅ | ⚠️ (requires `dom.events.asyncClipboard` flag) | Firefox needs fallback (keyboard reorder) |
| File uploads (routing + workspace) | ✅ | ✅ | ✅ | Verified with 5MB sample via chunk scripts |
| Legacy download link | ✅ | ✅ | ✅ | Edge warns on mixed content; ensure https-only |
| Search filter rail | ✅ | ✅ | ✅ | Keyboard navigation recorded in axe manual pass |
| Modal focus trapping | ✅ | ✅ | ✅ | Uses rc-dialog; tested with `Tab` + `Shift+Tab` |

## Observations
- Firefox drag/drop: implemented fallback instructions in docs/accessibility/AccessibilityResponsiveGuide.md.
- Edge: ensure download prompts allow `.esp` and `.nc`; documented whitelist for IT policies.
- All browsers: Verified SLA badge renders with forced dark mode (Edge/Chromium) using devtools emulation.

## Evidence
- Playwright trace uploads stored at `artifacts/testing/cross-browser/sprint9/` (generated via `npx playwright test --browser=all --reporter html`).
- Manual checklist appended to `docs/accessibility/UAT_Manual_Checklist.md` section A12.

## Next Steps
- Automate Firefox-specific drag/drop fallback path in Storybook to capture screenshot for QA sign-off.
