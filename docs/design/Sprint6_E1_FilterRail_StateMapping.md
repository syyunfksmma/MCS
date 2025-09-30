> PRD: docs/PRD_MCS.md  
> Sprint Task Lists: docs/sprint/Sprint6_Routing_TaskList.md, docs/sprint/Sprint7_Routing_TaskList.md  
> Remaining Tasks: 17

# Sprint6 E1 Filter Rail State Mapping

## React Query 데이터 소스 개요
- `useExplorerData` (`web/mcs-portal/src/hooks/useExplorerData.ts`)는 `queryKey = ['explorer','list']`로 Explorer 전체 데이터를 30초 staleTime으로 캐시. 초기 렌더 시점에 라우팅/그룹/아이템 트리 전부를 `items`로 전달.
- `useRoutingSearch` (`web/mcs-portal/src/hooks/useRoutingSearch.ts`)는 `useMutation` 기반으로 검색 API를 호출하며, 성공 시 결과(`total`, `items`, SLA 측정값)를 반환값으로만 전달해 React Query 캐시에 저장하지 않음.
- `useRoutingDetail` 등 세부 쿼리는 선택된 Routing 기준으로 작동하지만 필터 레일과 직접적인 연동은 없음.

## ExplorerShell 로컬 상태 분류
- `useExplorerLayout` (`web/mcs-portal/src/hooks/useExplorerLayout.ts`)가 필터/검색 관련 상태를 모두 `useState`로 관리: `searchTerm`, `searchResult`, `productFilter`, `groupFilter`, `statusFilter`, `legacyFilterTerm`, `isSearchFeatureEnabled` 등.
- FilterRail 선택값은 React Query 키에 포함되지 않아 새로고침/탭 이동 시 초기화되며, 다른 컴포넌트에서 재사용할 수 있는 싱글톤 스토어가 존재하지 않음.
- `typeaheadTimeoutRef`로 검색 입력의 디바운스를 구현하며, FeatureGate 토글 시 `resetSearchExperience`로 검색 결과와 필터를 초기화.

## 필터 적용 흐름
1. 검색 실행 (`executeSearch`) → `useRoutingSearch` mutate → 성공 시 `searchResult`에 결과 저장.
2. `searchItems = searchResult?.items ?? []`로 필터 옵션 및 리스트 소스 생성.
3. `productOptions`/`groupOptions`/`statusOptions`는 `searchItems`에서 유니크 값 추출 후 `SearchFilterRail`에 전달.
4. 사용자가 필터 Select를 조정하면 `setProductFilter` 등 로컬 상태만 업데이트.
5. `filteredItems`는 `searchItems`를 기준으로 필터링하며, React Query 쿼리 호출 없이 클라이언트 측에서만 필터 적용.
6. 필터가 결과를 모두 제거하면 `SearchFilterRail`은 `disabled={!filteredItems.length}` 조건으로 비활성화되어 추가 조정이 어려울 수 있음.

## 발견된 리스크 및 제안
- **상태 영속성 부족**: 필터 값이 React Query 키에 반영되지 않아 새로고침 시 재설정 필요. 추후 FilterRail 도입 시 `explorerFilters` 쿼리 키 혹은 URL 쿼리 동기화 고려.
- **옵션 생성 타이밍**: 검색 결과가 없으면 옵션 목록이 빈 배열이라 필터 Select가 사실상 비활성화; 기본 Explorer 데이터에서 옵션을 가져오는 fallback이 필요.
- **FeatureGate 전환**: 검색 기능 비활성화 시 `clearFilters` + `legacyFilterTerm` 초기화만 수행하며, Explorer 트리 상태는 유지됨. 향후 Teamcenter 패턴에서는 좌측 레일과 트리의 필터 동기화를 요구하므로 추가 설계 필요.
- **디바운스 타이밍**: 350ms 고정 디바운스를 사용하며 SLA 배지 갱신은 `searchResult` 의 `slaMs` 값을 직접 참조. 향후 실시간 배지 표기와 일관성을 위해 `searchKeys.execute()` 기반 캐시 사용 검토.

## 후속 작업
a. FilterRail 구현 시 `useExplorerLayout` 상태를 React Query 또는 Context Store로 분리해 좌측 레일 컴포넌트와 공유.
b. 검색 결과가 없을 때 Explorer 트리에서 옵션을 추출하는 백업 로직 작성.
c. SLA 배지/Quick Toggle 요구사항을 충족하기 위해 `searchResult` 메타데이터(타임스탬프, p95 등)를 추가 수집하는 API 협의 필요.
