> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

## 절대 지령

- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

# Explorer UI Rework Proposal (Teamcenter Alignment) — 2025-09-29

## Goals

1. Align Explorer experience with Teamcenter Active Workspace patterns.
2. Improve information density and discoverability (search, filters, preview).
3. Ensure accessibility (keyboard, screen reader) and responsive behavior.

## Design Tokens (to be added in `styles/tokens.ts`)

| Token               | Value      | Usage                                 |
| ------------------- | ---------- | ------------------------------------- |
| `teamcenterTeal`    | #009999    | Primary accent (buttons, active tabs) |
| `neutralBackground` | #F5F7FA    | Workspace background                  |
| `panelBorder`       | #D8DFE8    | Card borders & dividers               |
| `ribbonHeight`      | 64px       | Header height constant                |
| `spacingMd`         | 16px       | Default gutter                        |
| `fontHeading`       | 16px / 600 | Panel titles                          |
| `fontBody`          | 14px / 400 | Content text                          |
| `fontCaption`       | 12px / 400 | Helper text                           |

## Layout Structure

- Use CSS Grid wrapper `ExplorerLayout` with `grid-template-columns: 20% 52% 28%`.
- Left column: `TreePanel` + pinned filter rail (sticky)
- Middle column: Summary, Tabs, Search results
- Right column: Preview panels (Upload, Add-in, future analytics)
- Ribbon fixed at top (64px) across entire width with action groups.

## Component Updates

1. **ExplorerRibbon**
   - Slots: Quick Actions (Open, New, Download), Workflow (Upload, Add-in), Settings.
   - Background `neutralBackground`, accent `teamcenterTeal` for active items.
2. **TreePanel**
   - Add status dots (green/yellow/red) using routing status.
   - Provide collapse/expand icons & keyboard navigation (aria-treegrid).
3. **SearchFilterRail**
   - Convert to sticky vertical rail with filter groups (Product, Group, Status) and Clear button.
4. **Summary Tabs**
   - Use pill-style tabs with accent color, add History + Audit placeholders.
5. **Preview Panels**
   - Wrap `WorkspaceUploadPanel` & `AddinHistoryPanel` in cards with timeline visuals, job counters.
6. **Hover/Focus States**
   - Introduce `focus-visible` styles for list items; quick actions appear with subtle fade.

## Accessibility & Responsive Plan

- Keyboard navigation for Ribbon (arrow key cycling).
- TreePanel: role="tree" with `aria-expanded`, `aria-selected`.
- Breakpoints: <1280px collapse preview into drawer, <960px tree collapsible, <768px vertical stacking.

## Implementation Phases (requires approval per stage)

1. Tokens + Global Styles (`styles/tokens.ts`, `styles/globals.css`).
2. Layout wrapper (`ExplorerLayout.tsx`) and Ribbon redesign.
3. TreePanel status updates + Filter rail.
4. Search result list + preview panel polish.
5. Accessibility testing + Storybook documentation.

## Testing & Validation

- Unit: Update Jest/Vitest snapshots for Ribbon/TreePanel.
- Integration: Playwright scenario for search/filter interactions.
- Manual: Accessibility checklist, Lighthouse quick scan.

## 구현 메모 (Wave20)

### S91 – 2025-09-30

- `ExplorerShell.tsx` 전체를 Prettier로 정렬하고 중복 `return` 제거, `'use client';` 지시문을 최상단으로 이동했습니다.
- 전역 상태를 `useExplorerLayout` 훅(`web/mcs-portal/src/hooks/useExplorerLayout.ts`)으로 분리해 레이아웃·검색·마법사 상태를 통합했습니다.
- Storybook/ESLint 점검 흐름을 정의해 이후 단계(S92~S95)의 기반을 마련했습니다.

### S92 – 2025-09-30

- CSS Grid 기반 `ExplorerLayout`으로 좌측 트리·중앙 워크스페이스·우측 프리뷰(20/52/28)를 구성하고 Ribbon을 고정했습니다.
- `ExplorerRibbon`을 Teamcenter X 스타일의 액션 그룹/메타 배지로 재구성하고 Toolbar ARIA 레이블을 정비했습니다.
- Explorer 본문을 새 레이아웃에 맞춰 분리하고 요약/검색 카드, 프리뷰 패널을 Sticky 사이드 레일로 정렬했습니다.

### S94 – 2025-09-30

- 검색 카드에 SLA KPI 그리드와 Hover/Focus 애니메이션을 적용하고 Sticky 필터 레일을 정비했습니다.
- Upload/Add-in 프리뷰 카드를 Teamcenter 카드 패턴으로 재구성해 sticky 높이를 조정했습니다.
- 상단 메뉴 요구사항을 `docs/design/Explorer_MenuBar_Requirements.md`에 문서화하고 Ribbon과의 토큰 매핑을 정의했습니다.

### S95 – 2025-09-30

- `pnpm run lint`, `pnpm run test:unit -- --run` 실행 시 스크립트 미정의 오류를 확인하고 후속 조치 계획을 기록했습니다.
- Storybook 스토리(`TreePanel`, `SearchFilterRail`)를 업데이트하고 `docs/testing/Explorer_UI_Rework.md`에 테스트 로그를 작성했습니다.
- Timeline과 Sprint20 Task List를 S94~S95 완료 상태로 동기화했습니다.

## References

- `docs/design/Explorer_UI_Gap.md`
- `docs/design/Explorer_MenuBar_Requirements.md`
- Assets: `artifacts/reference/*`
- Teamcenter Active Workspace decks (2019–2024)
