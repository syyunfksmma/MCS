> PRD: docs/PRD_MCS.md  
> Sprint Task Lists: docs/sprint/Sprint6_Routing_TaskList.md, docs/sprint/Sprint7_Routing_TaskList.md  
> Remaining Tasks: 17

# Sprint6 E3 Hover Quick Menu Storybook & E2E Plan

## Storybook
- Location: `web/mcs-portal/src/stories/ExplorerHoverMenu.stories.tsx` (new).
- Viewports: Desktop (1280px), Tablet (1024px), Touch (768px) to verify hover vs long-press tooltips.
- Scenarios
  1. `DraftDefault`: Hover menu with all actions enabled.
  2. `PendingNeedsApproval`: Approve enabled, SLA breach badge visible (+ tooltip text from props).
  3. `NoPermissions`: Approve disabled with explanatory tooltip.
  4. `AddinQueued`: Add-in status pill shown, Queue/Retry buttons stateful.
  5. `PinnedState`: Pin button toggled, verifying `isPinned` style.
- Controls/Args: `slaBreached`, `breachMs`, `canApprove`, `addinJobStatus`, `isPinned` to allow interactive adjustments.
- Screenshot guidance: Use Storybook `@storybook/addon-storyshots` for baseline; manual GUI captures to be stored under `docs/design/reference/hover_menu/` (to be produced by developer in browser).

## Playwright (tests/e2e/explorer/hover-menu.spec.ts)
- Precondition: Mock Explorer data fixture with Draft/Pending/SLA cases.
- Cases
  1. Hover-to-open: simulate mouse hover for 250ms, assert menu becomes visible.
  2. Keyboard access: focus tree node, press Enter, arrow through actions, Escape to close.
  3. SLA badge: verify `aria-label` includes breach info, screenshot via `expect(page).toHaveScreenshot('hover-menu-sla.png')`.
  4. Add-in pill: queue status scenario checks color token class.
  5. Pin persistence: click Pin, assert event logged (mock telemetry) and button label toggled.
- Cleanup: ensure menu hides when moving to another node, no lingering portals.

## Reporting & Assets

- Feature flag 토글: ExplorerShell 상단 카드에서 `feature.hover-quick-menu`를 켜고/끄며 QA 진행. 토글 변경 시 기존 Hover 메뉴는 즉시 닫혀야 합니다.
- 스크린샷 저장 위치: `docs/design/reference/hover_menu/` (README 참고) – Storybook `PendingWithSla`, `DraftDefault` 스토리에서 1280×720 해상도로 캡처합니다.
- Test run results appended to `docs/testing/Sprint6_E3_Status.md` (new section) once implemented.
- GUI 이미지 캡처는 Storybook 실행 후 브라우저에서 촬영하여 `docs/design/reference/hover_menu/`에 저장하고, 로그에 파일명 기록.

## Next Steps
- Scaffold Storybook story file with placeholder data.
- Implement Playwright spec skeleton referencing new component once built.
- Coordinate with QA for additional accessibility scripts.
