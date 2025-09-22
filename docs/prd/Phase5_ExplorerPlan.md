# Phase 5 산출물 - Explorer SSR 구현 계획

## 1. 페이지 구조
- 경로: `/explorer`
- Layout: Left Tree (30%), Right Detail (70%)
- Header: 검색 바, 필터(상태, 승인자), 새로고침 버튼
- Tree: Item -> Revision -> Routing (virtualized)
- Detail: Routing Summary 카드 + 탭 (Overview, History, Files)

## 2. 데이터 Fetch 흐름
1. `getServerSideProps` 또는 App Router `fetchCache='force-no-store'`로 초기 데이터(최대 50 Item) 로드
2. React Query Hydration: `prefetchQuery(['items', filters])`
3. Tree 노드 클릭 시 Client fetch (`/api/routings/{id}`) → 상태/파일/히스토리 병렬 호출
4. Prefetch: Hover 또는 탐색 중인 Revision에 대한 Routing 리스트 미리 로드

## 3. 성능 전략
- Virtualized Tree (react-virtual, 1000+ 노드 지원)
- Debounced 검색 (300ms)
- Skeleton/Placeholder로 지연 감춤
- Suspense + Error Boundary 조합으로 영역별 로딩 관리

## 4. 상태 관리
- URL Query: `?item=ITEM001&revision=REV-A&routing=ROUT-10`
- Zustand store로 현재 선택 상태 유지 (SSR hydration 주의)
- React Query cacheTime 5분, staleTime 30초 (Explorer 기준)

## 5. UX 고려
- 라우팅 상태 배지: Draft/Approved/Failed/Processing 아이콘
- Hover 시 요약 툴팁, 핸드오프 용이한 onClick
- Empty state: “조회 가능한 데이터가 없습니다.” + 검색 Reset
- 오류 상태: Toast + Retry 버튼

## 6. TODO
- ML 추천 섹션 자리 확보(우측 하단) → Phase 6 이후 구현
- 즐겨찾기 기능(핀 고정) 사양 확정
