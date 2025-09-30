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

