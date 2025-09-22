# Sprint 1 - Explorer Prefetch & Error Handling Plan

## Prefetch 흐름
1. 서버 컴포넌트(`/explorer/page.tsx`)에서 QueryClient를 생성한다.
2. `fetchExplorerData()`를 prefetch하여 Dehydrated state를 구성한다.
3. 클라이언트에서는 React Query Hydrate + useExplorerData 훅을 통해 데이터를 소비한다.

## 에러 처리 시나리오
- API 호출 실패 → Mock 데이터 fallback (경고 로그 출력).
- 네트워크 오류 → React Query `retry` 기본 로직 사용(추후 조정).
- 클라이언트 요청 실패 → `useExplorerData`에서 throw → Error Boundary(Phase 5 후속 작업)에서 처리.

## TODO
- 실제 API 연동 시 상태/에러 매핑 검토.
- SignalR 업데이트와 Query invalidation 연결 (Sprint 2 예정).
