# Phase8 Performance & Reliability Plan (Wave16)

## 1. Optimistic Updates with Rollback
- 적용 대상: routing status update, version metadata edit.
- `useOptimisticMutation` 헬퍼 작성, 실패 시 `queryClient.invalidateQueries`.
- UI: 토스트로 성공/실패 안내, rollback 후 재시도 버튼.

## 2. React Query Cache Metrics & Alerts
- Custom metrics: cache hit ratio, stale retries.
- Application Insights custom event `workspace_cache_metric` 전송.
- Alert 규칙: P95 latency > 1.5s (5분) 시 Ops Slack 알람.

## 3. Skeleton States & Lazy Fetching
- Routing Detail 모달에서 skeleton 컴포넌트(`RoutingDetailSkeleton.tsx`) 추가.
- Lazy fetch: 파일 탭 접근 시 attachments fetch, History 탭 접근 시 timeline fetch.
- 접근성: skeleton에 `aria-busy` 속성 추가.

## 후속
- Metric 수집 스크립트: `scripts/performance/track-cache-metrics.ps1` 작성 예정.
- 타임라인: Wave16 S35~S37 기록.
