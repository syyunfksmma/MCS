> PRD: docs/PRD_MCS.md  
> Sprint Task Lists: docs/sprint/Sprint6_Routing_TaskList.md, docs/sprint/Sprint7_Routing_TaskList.md  
> Remaining Tasks: 17

# Sprint6 E1 Teamcenter Filter Rail References

## Source Inventory
- docs/design/Explorer_UI_Gap.md - Teamcenter 대비 Explorer 차이, sticky filter rail 권장사항.
- docs/design/Teamcenter_Patterns_Review.md - 좌측 내비게이션, 리본 재사용 항목과 Teamcenter 토큰 도입 TODO.
- docs/design/Sprint6_Explorer_UX_Plan.md - Sprint6 E1 필터 구성, 검색/SLA 배지/토글 와이어 요약.
- artifacts/reference/PROLIM_TC13x_Presentation_v02/ - Teamcenter Active Workspace 스크린샷(내부 공유 아카이브) 최신 여부 확인 필요.

## Pattern Notes
### Layout & Behavior
- 좌측 레일 폭 18~20% 고정, 트리 및 레일 상단 Affix 처리, Quick Toggle 영역 유지.
- Collapse/Expand 아이콘은 Teamcenter Active Workspace 기준 16px 패딩과 hover 대비 강조를 사용.
- 검색 영역은 항상 노출하며 SLA 배지는 상태 필터와 연동된 색상 토큰(`status.alert`, `status.normal`)을 사용.

### Interaction & Controls
- Routing Status, CAM Revision, Owner 필터는 Checkbox 그룹으로 제공하고, "최근 본 Routing"과 "SLA 초과만" 토글을 인라인 배치.
- Hover 시 Quick Actions 표시는 TreePanel과 동일하게 200ms 지연 후 fade-in, keyboard focus 진입 시에도 동일 메뉴 제공.
- 필터 변경 시 React Query 캐시 키(`explorerFilters`)와 연동해 서버/로컬 데이터 갱신을 일관되게 유지.

### Visual & Accessibility
- Siemens Teamcenter 컬러 토큰(`teamcenterTeal`, `neutral-200/500`) 적용으로 대비 4.5:1 이상 확보.
- Badge 및 Toggle 은 `aria-pressed`/`aria-controls` 속성을 지정하고 focus-visible 시 outline 토큰(`outline.brand`)을 사용.
- Sticky 섹션은 스크린 리더용 제목(`aria-labelledby`)을 지정해 탐색성을 높임.

## Outstanding Questions
- Active Workspace 참고 자료(artifacts/reference/...)의 최신 버전과 내부 사용 허가 재확인 필요.
- SLA 배지 색상 표준이 Phase6 토큰에 이미 포함되어 있는지 검토해야 함.
- 필터 항목 정렬 순서를 고정할지, 사용자 설정 가능하도록 할지 결정 필요.

## Next-Step Hand-off
- Phase6 토큰 파일(`web/mcs-portal/src/styles/tokens.ts`)과 매핑을 Step 2 Ribbon/Filter 설계 전에 검토.
- React Query 캐시 구조 문서화와 FilterRail 상태 다이어그램 작성(계획된 Step 6 산출물) 착수 준비.
- Storybook 레퍼런스 시나리오 추가 시 본 문서를 1차 소스로 명시.
