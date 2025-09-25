# Sprint 2 Workspace File Upload UI

## Summary
- Added `WorkspaceUploadPanel` (Ant Design Dragger) to support routing-scoped drag & drop uploads with progress feedback.
- Upload queue stores mock progress and is cleared via toolbar action; integrates with undo/redo stacks separately.
- Upload panel disables interactions until a routing is selected, preventing orphaned files.

## UX Details
- Drop zone copy clarifies supported mock formats (NC, Esprit, meta.json placeholder).
- Progress list surfaces size, routing code, and status, using Ant Design `Progress` for visual consistency.
- Completed uploads can be cleared without disturbing in-flight items; active count displayed for operators.

## Technical Notes
- Uses `customRequest` to simulate progress; timers tracked in a ref and cleared on unmount.
- Emits optional `onProgress`/`onSuccess` callbacks to stay compatible with future API wiring.
- Lint rules satisfied (added cleanup comment + placeholder usage guard).

## Next Steps
- Wire to actual BFF endpoint once API ready (multipart with routing context).
- Extend to surface meta.json validation (see Task B2).
- Add retry/cancel actions when backend integration lands.