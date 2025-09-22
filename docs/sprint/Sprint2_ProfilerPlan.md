# Sprint 2 React Profiler 계획

## 측정 목표
- ExplorerShell 렌더링 경로(Drag & Drop, 승인 패널, Add-in 패널)에서 재조정 횟수와 commit 시간을 관찰.
- 승인/반려 이벤트가 발생할 때 불필요한 전체 트리 리렌더링을 줄이기 위한 메모이제이션 포인트 도출.

## 절차
1. `npm run dev` 실행 후 Chrome DevTools → Profiler → "Record".
2. 시나리오
   - Routing 선택/해제 반복
   - 승인/반려 모달 열기 및 제출
   - Add-in Control Panel에서 재시도/취소 버튼 실행(모의)
3. Flamegraph에서 다음을 확인
   - `TreePanel`/`ApprovalPanel`이 선택 상태 변경 시 필요한 부분만 업데이트되는지
   - SignalR 모의 이벤트가 발생할 때 `ExplorerShell` 전체가 재렌더되는지 여부
4. React Profiler export를 `docs/profiler/Sprint2_workspace_profile.json`으로 저장(다음 작업 시 업로드 예정).

## 개선 체크리스트
- `ApprovalPanel`의 이벤트 정렬 로직이 메모이제이션 덕분에 일정한지 점검.
- `appendApprovalEvent` 호출 후 `TreePanel` 재렌더가 최소화되는지 추후 React.memo 적용 고려.
- 모의 SignalR 타이머 주기를 3.2초 → 5초로 조절하는 실험을 Sprint 3에서 진행.

## 후속
- 실제 백엔드 연동 후 Production build (`next build && next start`) 환경에서 다시 측정.
- Lighthouse Performance 탭과 함께 비교하여 메인 스레드 블로킹 여부 점검.