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
