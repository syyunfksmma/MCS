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

