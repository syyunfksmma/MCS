# Sprint 2 meta.json Handling (Mock)

## Naming Convention
- Store under `Routings/<routingId>/meta.json`; routing code used for exported filename (e.g., `RT-100-meta.json`).
- File content includes routing metadata (`routingId`, `routingCode`, `camRevision`, `generatedAt`) and attached file descriptors.

## WorkspaceMetaPanel Features
- Generate preview: builds mock JSON from the currently selected routing and renders it inline.
- Download mock: serialises the preview and triggers a client-side download (blob).
- Upload preview: accepts a local meta.json, validates JSON shape, and surfaces the contents without persisting.
- Disabled states prevent actions when no routing is selected.

## Validation Strategy
- JSON parsing only for now; schema validation to be added post Sprint 3 once BFF contract finalises.
- Preview updates `source` metadata (generated vs uploaded) to aid operator awareness.

## Follow-up
- Integrate with real API (`PUT /workspace/routings/{id}/meta`) once server ready.
- Add JSON schema validation and highlight missing file entries.
- Emit audit trail when downloads/uploads occur (Phase 4 telemetry).