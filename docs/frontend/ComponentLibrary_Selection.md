# Component Library Selection Log (2025-10-01)

## Goal
- Document the evaluation of the UI component stack for the Next.js portal.
- Align web styling tokens with WPF controls used in `WpfControlLibrary1` to keep UX consistent across desktop and web.

## Candidates
| Library | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Ant Design (baseline) | Existing code base, rich data components (Tree, Tabs), RTL/i18n ready | Heavy styling overrides required, no native Siemens palette | ✅ Retain, but scope usage to table/form primitives only |
| Fluent UI (v9) | Native Microsoft styling, A11y baked in | Requires larger refactor, theming not aligned with WPF accents | ⏳ Revisit post-Wave22 for Admin Console |
| Mantine + Headless UI | Small bundle, accessible headless primitives | Missing enterprise grid/tree controls, requires custom theme infra | ❌ Not adopted |

## Styling Direction
- Introduced shared CSS custom properties (`--color-brand-primary`, `--color-surface-canvas`, etc.) mapped to the WPF palette defined in `WpfControlLibrary1/UserControl1.xaml`.
- Exported matching TypeScript tokens in `src/theme/colors.ts` for runtime logic (status pills, charts).
- Explorer ribbon and filter rail now consume the same tokens as WPF ribbon header: teal accent, neutral canvas background, subtle dividers.

## Action Items
1. Keep Ant Design as the default data component set while wrapping buttons/headers with custom tokens.
2. Use MSAL-based `AuthProvider` to surface RBAC in admin views (role-aware menu items will rely on headless primitives).
3. When introducing new UI, prefer headless building blocks + tokens before pulling additional third-party kits.
4. Track bundle impact after theming refactor via `npm run perf:lighthouse:ci` once CI jobs are reinstated.

## Log
- 2025-10-01 (Codex): Added tokenized palette and documented component usage boundaries. Next checkpoint: validate Storybook stories under Siemens theme before Sprint21 hand-off.
