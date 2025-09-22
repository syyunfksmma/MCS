# Phase 5 산출물 - React Query 캐싱 전략

## 1. Query Key 구조
| 대상 | Query Key 예시 |
|---|---|
| Item 리스트 | `['items', filters]` |
| Routing 리스트 | `['routings', revisionId]` |
| Routing 상세 | `['routing', routingId]` |
| History | `['history', routingId]` |
| Add-in 배지 | `['addin-status', routingId]` |

## 2. 캐시 정책
- 기본 `cacheTime`: 5분, `staleTime`: 30초 (Explorer)
- Routing 상세: `staleTime` 5초 (SignalR 이벤트와 조화), Query Invalidation on SignalR update
- Prefetch: Hover/Expand 이벤트에서 `queryClient.prefetchQuery`
- SSR Hydration: `dehydrate` 적용, `hydrate` 후 `initialDataUpdatedAt` 설정

## 3. Mutation & Invalidation
- 라우팅 업데이트/승인: `mutateAsync` 후 `invalidateQueries(['routing', routingId])` + `invalidateQueries(['history', routingId])`
- 파일 업로드: 성공 시 Files/History query invalidate, 실패 시 rollback toast
- Add-in 재시도: 성공 시 Add-in status, History invalidate

## 4. Background Refresh
- `refetchInterval`: Add-in status 5초 (SignalR fallback용)
- Focus/Online 상태에서 `refetchOnWindowFocus=true`

## 5. Optimistic UI
- 승인/반려: Optimistic status 업데이트 → 실패 시 rollback + toast
- 파일 메타데이터: Optimistic 추가, 검증 실패 시 제거

## 6. 에러 처리
- Query Error Boundary 각 영역 별도 구성 (Tree, Detail)
- Retry: default 2회, exponential backoff
- Global onError: 로그 + Teams 알림

## 7. TODO
- 캐시 Persist 필요 여부 검토 (SessionStorage)
- React Query Devtools 배포 환경에서 비활성화
- SignalR 이벤트 발생 시 Batch Update (queryClient.batch)
