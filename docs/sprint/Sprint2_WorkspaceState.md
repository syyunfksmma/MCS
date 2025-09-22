# Sprint 2 Workspace State & Undo/Redo Design

## Objectives
- Track client-side workspace mutations (drag & drop reorder events) ahead of server persistence.
- Provide inline feedback (`Unsaved changes`) and deterministic undo/redo controls.
- Ensure the Explorer tree remains the single source of truth for routing/file ordering during the sprint.

## State Model
- `workspaceItems`: deep-cloned snapshot of explorer data, updated on every reorder.
- `undoStack` / `redoStack`: arrays of snapshots captured before/after each mutation. Snapshots are cloned to avoid shared references.
- `selectedRoutingId`: controlled selection id so keyboard and mouse interactions stay in sync with the tree.
- `isDirty`: computed by comparing the serialized workspace snapshot with the latest server payload.

## Undo/Redo Algorithm
1. When `TreePanel` emits a `TreePanelReorderPayload`, clone the current snapshot onto `undoStack`, clear `redoStack`, and apply `applyReorder` to produce the next state.
2. `Undo` pops the latest snapshot from `undoStack`, pushes the current snapshot onto `redoStack`, and restores the popped copy.
3. `Redo` mirrors the process in reverse.
4. Keyboard shortcuts do not push to history; only structural mutations (drag events) affect the stacks, keeping selection toggles lightweight.

## UI Feedback
- `Badge` displays **Unsaved changes** while the current snapshot differs from the server payload.
- Toolbar buttons (Undo/Redo) leverage Ant Design icons and disable automatically when respective stacks are empty.
- Shortcut legend updated to include selection toggle guidance, reinforcing discoverability.

## Follow-up Considerations
- Persist history length cap (e.g., 20) in Sprint 3 to avoid unbounded memory usage.
- Extend payload schema once cross-item moves or routing duplication is supported by the backend.
- Emit telemetry events (`workspace.undo`, `workspace.redo`) when instrumentation is available.