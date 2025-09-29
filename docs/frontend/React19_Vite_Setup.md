# React 19 + Vite + Tailwind Setup — 2025-09-29

## Stack Components
- React 19 (canary) with concurrent rendering enabled.
- Vite 5 build with SSR target (`npm run build:ssr`).
- Tailwind CSS v4 preview + shadcn/ui tokens exported from Figma.

## Scripts
| Command | Description |
| --- | --- |
| `pnpm dev` | Runs Vite dev server on port 5173 with API proxy. |
| `pnpm build` | Generates production build output (`.next` equivalent) under `dist/`. |
| `pnpm preview` | Serves built assets for smoke testing. |
| `pnpm sync:tokens` | Pulls design tokens from `docs/prd/Phase3_TokensComponents.md`. |

## Configuration Highlights
1. Tailwind config imports `./src/styles/tokens.cjs` with design tokens.
2. `postcss.config.cjs` includes `postcss-import`, `postcss-nesting`, and Tailwind plugins.
3. ESLint extends `@typescript-eslint/recommended` + custom alias resolution.
4. shadcn/ui components exported under `src/components/ui/`.

## Testing
- `pnpm test:unit -- --run`: Vitest + Testing Library.
- `pnpm test:e2e:ci`: Playwright headless tests (Explorer flows).

## Checklist
- [x] Vite dev server boots with shared config.
- [x] Tailwind tokens sync command documented.
- [x] shadcn/ui components generated and linted.

> 작성: 2025-09-29 Codex
