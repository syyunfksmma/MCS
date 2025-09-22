# Sprint 2 Workspace Keyboard Shortcuts

## Goals
- Provide accessible navigation across workspace tabs without relying on pointer interactions.
- Allow engineers to toggle routing focus quickly during triage scenarios.
- Ensure shortcuts do not interfere with typing inside inputs or textareas.

## Shortcut Map
| Shortcut | Scope | Action |
|----------|-------|--------|
| `Ctrl` + `Left / Right` | Global (Explorer Shell) | Cycle active workspace tab backward/forward |
| `Ctrl` + `1 / 2 / 3` | Global | Jump directly to Summary, History, or Files tab |
| `Ctrl` + `Space` | Global | Toggle routing selection (select first routing when none, clear when active) |
| `Esc` | Global | Clear current routing selection and reset tab focus to Summary |

## Implementation Notes
- `ExplorerShell` owns the `activeTab` state and registers a `keydown` listener guarded by `isEditableElement` to avoid hijacking typing.
- `TreePanel` exposes a controlled `selectedKey` prop so keyboard toggles keep the tree highlight in sync.
- Shortcuts are surfaced to end users inside the Explorer Summary card for quick discovery.
- Listener removes itself on unmount to avoid duplicate bindings when navigating with Next.js.

## Validation
- Manual tests executed with Chrome 128: confirmed shortcuts unaffected while typing inside the search box and functioning otherwise.
- `npm run lint` passes after introducing the new keyboard handler logic.