> PRD: docs/PRD_MCS.md  
> Sprint Task Lists: docs/sprint/Sprint6_Routing_TaskList.md, docs/sprint/Sprint7_Routing_TaskList.md  
> Remaining Tasks: 17

# Sprint6 E2 Ribbon Hi-Fi Plan

## Source Inventory
- docs/design/Explorer_UI_Gap.md — Teamcenter ribbon height, segmented groups, status badge placement.
- docs/design/Sprint6_Explorer_UX_Plan.md — Flow E2 요구사항(3개 그룹, Ant Design 기반) 및 Storybook 일정.
- docs/design/Explorer_UI_Rework_ImplementationPlan.md — S92 단계에서 Ribbon/Filter Grid 구조와 토큰 적용 지침.
- web/mcs-portal/src/components/explorer/ExplorerRibbon.tsx — 현재 구현 상태(3개 ActionGroup, 텍스트 버튼, 권한 분기).

## Current Gaps
1. 그룹 정의 미흡: Approval/Archive 등 상태 기반 버튼이 빠져 있고, 현재 `ActionGroup` 라벨은 Teamcenter 분류와 다름.
2. 시각 요소 부족: Siemens 토큰(`teamcenterTeal`, `neutral-200`)과 아이콘(`Home`, `CheckCircle`, `CloudDownload`) 미적용.
3. 상태/권한 표준 부재: 승인 권한, Add-in Job 상태, 다운로드 가능 조건을 일관된 규칙으로 정리하지 않음.
4. Storybook/접근성 시나리오 누락: Toolbar `role="toolbar"`에 대한 키보드 이동(Tab/Arrow) 흐름 정의가 필요.

## Proposed Ribbon Structure
| 그룹 | 액션 | 상태/권한 조건 | 아이콘 제안 |
| --- | --- | --- | --- |
| Routing | `Open Detail`, `New Routing`, `Duplicate`, `Archive` | `Open`은 선택 필요, `Duplicate`/`Archive`는 `selectedRouting && canEdit`; `New`는 항상 활성 | `FolderOpenOutlined`, `PlusCircleOutlined`, `CopyOutlined`, `DeleteOutlined` |
| Approval | `Request`, `Approve`, `Reject`, `History` | `Request`: Draft/Rejected, `Approve/Reject`: Pending + `canApprove`, `History`: 항상 활성 | `SendOutlined`, `CheckCircleOutlined`, `CloseCircleOutlined`, `TimelineOutlined` |
| Add-in | `Queue Job`, `Retry`, `Cancel`, `Launch EDGE` | `Queue`: Draft/Main, `Retry/Cancel`: Job 상태 기반, `Launch`는 ESPRIT EDGE 통합 플래그 필요 | `PlayCircleOutlined`, `RedoOutlined`, `StopOutlined`, `ApiOutlined` |

### Interaction & Layout Specs
- 높이 64px, 배경 `var(--color-neutral-100)` + 하단 1px divider. 그룹 간 24px 간격.
- 그룹 라벨은 12px Uppercase, 버튼은 14px Medium + `teamcenterTeal` hover.
- 키보드: Tab → 그룹 이동, ArrowLeft/Right → 그룹 내 이동, Enter/Space → 실행.
- Disable 상태는 `aria-disabled="true"`, Tooltip으로 비활성 사유 노출.

### State & Telemetry Mapping
- 각 버튼 클릭 시 `logRoutingEvent` 이름 규칙: `routing.ribbon.{group}.{action}`.
- 다운로드/승인 등 서버 호출 전 `message.loading` → 응답 시 success/error 토스트.
- ExplorerRibbon props 확장: `onDuplicate`, `onArchive`, `onRequestApproval`, `onApprove`, `onReject`, `onQueueAddinJob`, `onCancelAddinJob`, `onLaunchEdge`.
- `selectedRouting`에서 `status`, `isMain`, `permissions` 등 메타 데이터를 memoized selector로 전달.

## Visual & Token Guidelines
- 버튼 기본 색: `--color-neutral-600`, hover: `--color-teamcenter-teal`, active: `--color-teamcenter-teal-dark`.
- Badge 영역(우측 메타): Routing 코드 + 상태 pill, SLA 초과 시 `status.alert` 배경.
- 아이콘 라이브러리: `@ant-design/icons` 우선, 필요시 커스텀 SVG(`icons/siemens`) 추가.

## Storybook & QA Plan
1. Storybook `ExplorerRibbon.stories.tsx`: 시나리오(Empty selection, Draft, PendingApproval, Approved, Add-in queued).
2. Controls: `canApprove`, `hasEdgeLicense`, `jobStatus`를 knob로 제공.
3. 접근성 테스트: Storybook a11y addon, Playwright 키보드 네비게이션 스크립트(`tests/e2e/ribbon-accessibility.spec.ts`).
4. 성능: Ribbon 렌더는 메모이제이션(`React.memo`) 적용, 버튼 배열 useMemo로 캐싱.

## Outstanding Questions
- Approval API 메시지/권한 정보가 어디서 오는지(REST vs GraphQL) 확정 필요.
- Add-in Launch가 실제 ESPRIT EDGE exe 호출인지, 또는 임시 Mock인지 백엔드와 협의.
- Archive 동작이 soft delete인지, routing group 재정렬에 영향이 있는지 명확화.

## Next Steps
- ExplorerRibbon 리팩터링 스파이크(PR 준비) → props 확장, 버튼 정의 분리.
- styles/tokens.ts 업데이트로 Teamcenter 토큰 확장.
- Sprint7 Storybook/Playwright 항목에 본 문서를 참조 링크로 추가.
