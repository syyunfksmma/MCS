> PRD: docs/PRD_MCS.md  
> Sprint Task Lists: docs/sprint/Sprint6_Routing_TaskList.md, docs/sprint/Sprint7_Routing_TaskList.md  
> Remaining Tasks: 17

# Sprint6 E3 Hover Quick Menu Component Plan

## Component Structure
- `ExplorerHoverMenu` (new component)
  - Props: `routingId`, `routingCode`, `status`, `slaBreached`, `addinJobStatus`, `canApprove`, `onViewDetail`, `onOpenUploads`, `onApprove`, `onPinToggle`, `isPinned`, `onClose`.
  - Optional: `onQueueAddin`, `canQueueAddin`, `disabledActions` map for fine-grained control.
- Integrations
  - `ExplorerShell` search results → render `ExplorerHoverMenu` positioned relative to `List.Item` when `hoveredResultId` matches. Use `createPortal` to overlay without affecting layout.
  - `TreePanel` → extend props with `hoverMenuProps` factory receiving node context (routing id, permissions).

## State Management
- Local state: `isOpen`, `activeAction` (for keyboard focus), managed via custom hook `useHoverMenu({ delayOpen: 200, delayClose: 150 })`.
- Shared: reuse `hoveredResultId` for search list; TreePanel exposes `onNodeHover` to set same state to ensure consistent UI.
- Permissions: derive from `selectedRouting` metadata (`canApprove`, `isMain`, `slaBreached`). Use memoized selector in ExplorerShell to avoid re-computation.

## Accessibility & Keyboard Flow
1. Hover or long-press triggers `isOpen` after 200ms.
2. Menu container `role="menu"`, `tabIndex={-1}`, initial focus on first enabled action.
3. Arrow keys cycle through `menuitem` buttons; `Home/End` jump to first/last; `Escape` closes and returns focus to origin element.
4. Provide `aria-describedby` referencing hidden instructions text.

## Visual Tokens & Layout
- Container: 240px max width, padding 12px, border radius 12px, box-shadow `var(--shadow-float-sm)`.
- Background: `var(--color-neutral-0)`; highlight border `var(--color-teamcenter-teal)` when focused.
- Action buttons: icon + label stacked vertically (Teamcenter style), 40px min height.
- SLA badge: `status.alert` pill above Approve button, text `SLA +{breachMs}ms`.
- Add-in badge: inline tag using `addinJobStatus` color map (queued=blue, failed=red).

## Telemetry & Logging
- `routing.hoverMenu.open/close` events via existing `logRoutingEvent` helper.
- Each action button logs `routing.hoverMenu.{action}` with `routingId`, `source` (`list`/`tree`).
- SLA alert displayed triggers `routing.hoverMenu.slaAlertViewed` once per session.

## Integration Steps
1. Implement `useHoverMenu` hook (`open`, `close`, `focusNext`, `focusPrev`).
2. Build `ExplorerHoverMenu` component with props above.
3. Update `ExplorerShell` search list to render hover menu; use absolute positioning + portal to body.
4. Extend `TreePanel` to expose `onNodeHover`/`onNodeFocus` and render menu anchored to routing nodes.
5. Add telemetry wiring using `logRoutingEvent`.

## Testing Checklist
- Unit: hook timing logic (open/close delay, cleanup on unmount).
- Storybook: scenarios (Draft, Pending with SLA breach, No permissions, Add-in queued).
- Playwright: hover to open, keyboard navigation, Escape close, SLA badge visibility, Add-in badge.
- Axe: ensure buttons are reachable/focusable, contrast meets 4.5:1.

## Next Actions
- Create Storybook stories referencing this plan (Step 2).
- Prepare Playwright spec skeleton aligning with guide.
- Coordinate with backend for Approve API confirmation and Pin persistence.
