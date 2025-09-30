# 절대 지령
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

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
# Explorer UI Gap Analysis vs Teamcenter Reference (2025-09-29)

## Reference Sources
- `artifacts/reference/PROLIM_TC13x_Presentation_v02/` (Teamcenter Active Workspace deck)
- `artifacts/reference/Siemens-SW-Active-Workspace-FS-26883-C10_SARATECH/`
- `artifacts/reference/To_Infinity_and_Beyond/`
- Accompanying TXT notes (vision, intuitive UI/search, process management emphasis)

## Key Teamcenter Patterns
1. **Ribbon & Header**
   - Compact height (~64px) with segmented action groups (Home / Operations / View)
   - Context-sensitive buttons aligned left, status indicators right
   - Soft gradient or light gray background, thin bottom divider
2. **Navigation Column**
   - Fixed 18–20% width, collapsible icons, hover highlights
   - Hierarchical tree with subtle indentation, colored status dots
   - Persistent search/filter at top with inline badges
3. **Main Workspace**
   - Card-based summary with iconography, two-column stat blocks
   - Tabs for Summary / History / Files with pill styling
   - High-density data tables with zebra striping, quick actions on hover
4. **Preview / Context Panel**
   - 24–26% width preview, thumbnails, metadata stacks
   - Queue widgets (Add-in / Workflow) with badge counters
5. **Color & Typography**
   - Neutral backgrounds (#F5F7FA) with Siemens teal highlights (#009999)
   - Mix of 14px body, 12px helper text, 16px headings; Roboto/Siemens Sans
6. **Interactions**
   - Hover menus fade in, focus outlines maintained
   - Bulk actions triggered from Ribbon; tree reorder uses drag handles

## Current ExplorerShell UI Observations
- Ribbon is basic `Card` title with buttons dispersed; lacks grouped actions
- Layout uses flexbox without fixed width ratios; preview pane shares same column as cards
- Filter rail only available when feature flag active; lacking sticky behavior
- Summary cards use Ant Design defaults (spacing tighter than reference)
- Hover action menus appear abruptly with 0 opacity toggle but no focus fallback
- Color tokens still default Ant Design blue/gray; no Siemens teal usage

## Gap Summary
| 영역 | Teamcenter 기대 | 현 상태 | 개선 필요 |
| --- | --- | --- | --- |
| Ribbon | Segmented actions + consistent height | Card title + scattered buttons | Introduce `ExplorerRibbon` redesign with grouped slots |
| Nav Tree | Fixed width, iconography, status dots | TreePanel full height but width fluid, no status dot | Apply 20% width grid + status chip support |
| Workspace Grid | Summary + tabs centered, preview separate | Summary card + Tabs stacked same column | Convert to 3-column CSS grid, move preview to right |
| Filter Rail | Sticky side panel | Inline above list, disappears when flag off | Create persistent left rail w/ pinned filters |
| Visual Language | Siemens color tokens, typography scale | Default Ant Design palette | Extend tokens: teal highlights, neutral backgrounds |
| Accessibility | Hover + keyboard parity | Hover controls vanish on blur, limited aria | Add focus-visible styles, aria-labels |

## Next Actions (feeds S84)
- Define new design tokens (`teamcenterTeal`, neutral backgrounds, spacing scale)
- Redesign layout using CSS Grid: `grid-template-columns: 20% 52% 28%`
- Build sticky `ExplorerRibbon` and `ExplorerFilterRail` wrappers
- Introduce status dot + icon set aligned with Teamcenter imagery
- Update Storybook & design docs with Siemens-aligned typography guidance

