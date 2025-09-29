# Routing Workspace Drag & Drop Plan

## 1. Objective
Allow CAM users to reorder routing groups/steps via HTML5 Drag & Drop integrated with Ant Design Tree.

## 2. Implementation Summary
- `TreePanel` already enables `draggable` and emits `onDrop` payload; Phase6 extends this via new handler `onReorder` to call `/api/routings/reorder`.
- Workspace screen will inject `handleWorkspaceReorder` hook to translate drag payload into API contract.

## 3. Data Flow
1. User drags routing in Workspace tree.
2. `TreePanel` emits `{ entityType, dragKey, dropKey, position }`.
3. Hook maps to API request `{ routingId, targetGroupId, position }`.
4. React Query invalidates `['explorer']` to refresh view.

## 4. API Contract
```
POST /api/routings/reorder
{
  "routingId": "routing_gt310001",
  "targetGroupId": "group_a_machining",
  "position": "after"
}
```
Response: `{ success: true }`

## 5. UI Feedback
- Show `message.loading('Reordering...')` while awaiting response.
- On success, emit toast `message.success('Routing 순서가 업데이트되었습니다.')`.
- On failure, revert optimistic update and surface error summary.

## 6. Next Steps
- Wire hook into workspace page once SSR detail route lands.
- Add integration test (Playwright) covering drag from queue to approved group.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial drag & drop plan documented for Phase6 |
