# Sprint 2 Drag & Drop Routing Plan

## Context
- Workspace tree must support drag & drop reordering for routings within the same revision without breaking existing Explorer data dependencies.
- Final solution must be lightweight, TypeScript friendly, and align with Next.js/Ant Design stack already adopted in Sprint 1.

## Library Evaluation
| Candidate | Pros | Cons | Decision |
|-----------|------|------|----------|
| Ant Design Tree built-in drag & drop | Zero extra dependency, theming aligned with existing UI, minimal bundle impact | Limited to tree semantics, requires custom guards for invalid drops | **Selected** for Sprint 2 PoC |
| @dnd-kit/core | Flexible sensors, good docs, works across arbitrary layouts | Requires custom tree implementation, higher integration cost | Parked for future cross-surface drag scenarios |
| react-beautiful-dnd (forks) | Mature experience for list DnD | Legacy maintenance state, heavy bundle, no tree support without hacks | Rejected |

## Interaction Rules
1. Allow reordering of routing and file nodes **within** the same parent only; prevent cross-item moves until BFF contracts exist.
2. Preserve routing type semantics by comparing custom `nodeType` metadata before committing a drop.
3. Emit optional `onReorder` callbacks so downstream features (activity feed, persistence) can subscribe without rewriting the tree component.
4. Maintain search filtering behaviour after reorder by running all filters over the in-memory tree snapshot.

## State & Event Flow
- `TreePanel` now builds typed `ExplorerTreeNode` objects with `nodeType`, `parentKey`, and `searchLabel` metadata.
- Drag events clone the current tree, locate drag/drop nodes, guard by parent equality, and reinsert in-place.
- Consumers can hook into the new `onReorder` payload to enqueue workspace routing updates (`dragKey`, `dropKey`, `position`).
- No server mutation is triggered yet; API contract to be drafted in Sprint 3 notification tasks.

## Routing Map Impact
- URL structure remains `/explorer`; workspace routing shell will adopt `/workspace` in subsequent tasks once upload & add-in panes ship.
- Future server endpoint proposal: `PATCH /workspace/routings/:routingId/order` accepting `{ targetRoutingId, position }` matching the callback payload.

## Follow-ups
- Wire `onReorder` to workspace activity log once Task D1 is ready.
- Extend drag validation once routing duplication and cross-item moves are supported by the BFF.