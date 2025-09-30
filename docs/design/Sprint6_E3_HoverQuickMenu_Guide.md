> PRD: docs/PRD_MCS.md  
> Sprint Task Lists: docs/sprint/Sprint6_Routing_TaskList.md, docs/sprint/Sprint7_Routing_TaskList.md  
> Remaining Tasks: 17

# Sprint6 E3 Hover Quick Menu Interaction Guide

## Source Inventory
- docs/design/Sprint6_Explorer_UX_Plan.md — Flow E3 요구(200~300ms 지연, View/Uploads/Approve 액션, SLA/배지 연동).
- docs/sprint/Sprint6_ExplorerUX.md — Hover Quick Menu 3단계 흐름 및 테스트 계획, TreePanel/List 동시 적용 지침.
- docs/design/Explorer_UI_Gap.md — Teamcenter hover/focus 패턴, 접근성 요구.
- web/mcs-portal/src/components/TreePanel.tsx — 현행 TreePanel 구조(ARIA, drag/drop) 참고.

## Behavioral Specs
- Trigger: Pointer hover 200ms 지속 시 Quick Menu fade-in (ease-out 120ms). Hover 이탈 150ms 후 auto-hide.
- Actions: `View Detail`, `Open Uploads`, `Approve`(권한별 표시), `Pin/Unpin` (향후 Tree 상태 고정).
- SLA Guard: Routing `slaBreached` true 시 Approve 버튼 좌측에 `status.alert` 아이콘 표시, Tooltip으로 지연 정보.
- Add-in Badge: `addinJobStatus`가 `queued`/`failed`인 경우 퀵 메뉴 상단에 상태 pill 노출.
- Touch/Keyboard: Long-press 600ms로 동일 메뉴 호출, focus-visible 시 `Enter` → 메뉴 열기, `Arrow` 키로 항목 이동.

## Accessibility & Focus
- Quick Menu wrapper `role="menu"` + `aria-label="Routing quick actions"`.
- 각 버튼은 `role="menuitem"`, `aria-disabled` 상태 반영.
- Focus trap: 메뉴 활성화 시 첫 버튼에 focus, `Escape` → 메뉴 닫기 후 원본 노드로 focus 복귀.
- Outline 토큰: `outline.brand` 적용, hover/focus 병행 시 대비 4.5:1 이상 유지.

## Animation & Layout Tokens
- Menu container: 12px radius, background `var(--color-neutral-0)`, shadow `var(--shadow-elevation-sm)`.
- Fade-in: opacity 0→1, transform translateY(-4px) → 0.
- Hover highlight: Tree node 자체는 `var(--color-neutral-100)` 배경, 메뉴는 개별 카드로 분리.

## State & Telemetry Mapping
- Event 이름: `routing.hoverMenu.{action}` (detail/upload/approve/pin).
- Approve 클릭 전 `canApprove` 권한 검사 후 토스트/모달 처리.
- SLA breach 발생 시 `logRoutingEvent('routing.sla.alert', { routingId, breachMs })` 발행.
- 메뉴 열림/닫힘 시 `routing.hoverMenu.open` / `routing.hoverMenu.close` 이벤트 기록.

## QA & Storybook Plan
1. Storybook `HoverQuickMenu.stories.tsx`: 상태 시나리오(Draft, PendingApproval w/ breach, No permissions, Add-in queued).
2. Playwright `tests/e2e/explorer/hover-menu.spec.ts`: hover/keyboard 수순, Escape 복귀, SLA 배지 가시성 검증.
3. a11y: Storybook addon-a11y + axe-core CLI로 role/aria, focus 처리 검사.
4. Performance: React `useDeferredValue`로 hover 상태를 throttle, 메뉴 컴포넌트는 `React.memo`로 재렌더 최소화.

## Outstanding Questions
- Quick Menu 버튼 세트가 검색 결과 List와 TreePanel 모두 동일해야 하는지 확인 필요.
- Approve 액션이 모달을 통해 진행되는지, 즉시 API 호출인지 백엔드와 정의 필요.
- Pin/Unpin 기능의 데이터 모델(Explorer state 혹은 User preference 저장) 결정 필요.

## Next Steps
- ExplorerShell/TreePanel 컴포넌트 구조 검토 후 QuickMenu 컴포넌트 추출 설계.
- Storybook 초기 scaffolding (`HoverQuickMenu.stories.tsx`) 작성.
- Playwright hover/keyboard 스크립트 초안 작성.
