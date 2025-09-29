# Sprint 9 Accessibility Scan (axe + Manual)

## Automated axe Scan
- Command: `npm run test:axe -- --project=explorer`
- Result: 0 violations (Chromium headless) on explorer summary + routing detail modal.
- Suppressions: None.

## Manual Keyboard Audit
| Flow | Result | Notes |
| --- | --- | --- |
| Explorer filter rail tab order | Pass | Focus visible; recorded via Video capture ID AXE-20250929-01 |
| Routing detail modal | Pass | Escape closes, focus restored to triggering button |
| Product dashboard cards | Pass | Copy button reachable via Tab and announces tooltip |

## Issues & Follow-up
- `Tooltip` copy action lacks `aria-live`; backlog ticket `UX-187` opened for announcement enhancement (target Sprint10).
- Need to retest drag/drop fallback after Firefox keyboard reorder shipped (tracked under S1).

## Artifacts
- axe JSON: `artifacts/testing/accessibility/sprint9/axe-explorer.json`
- Manual checklist updated in `docs/accessibility/UAT_Manual_Checklist.md` (Section A12-A13).
