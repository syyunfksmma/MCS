# Sprint 2 승인/반려 워크플로우

## 목표
- 승인/반려 모달과 코멘트 검증을 통해 Workspace Routings의 상태 전환을 기록한다.
- Add-in SignalR 이벤트와 사용자 액션을 승인 히스토리 타임라인에 동기화한다.
- 향후 BFF 연동을 고려해 API 추상화를 준비한다.

## UI 구성
- `ApprovalPanel`: 승인/반려 버튼, 코멘트 입력, `Timeline` 기반 이력 표시.
- `ExplorerShell`: 선택된 Routing에 대한 승인 이벤트 배열을 주입하고 상태 변화를 Undo/Redo 히스토리에 반영.
- Add-in Control Panel과 연계하여 작업 진행 상황이 승인 이벤트로 자동 등록된다.

## 시나리오
1. 사용자가 승인/반려 버튼 클릭 → 코멘트 5자 이상 검증 → 이벤트 기록 + Routing 상태 업데이트.
2. Add-in 작업 큐 추가/재시도/취소 → `pending` 혹은 `rejected` 이벤트 자동 추가.
3. SignalR 모의 스트림에서 `running/succeeded/failed` 수신 시 승인 이벤트로 기록하고 상태를 `Approved/Rejected`로 변경.
4. 모든 상태 전환은 Undo/Redo 스택에 저장되어 히스토리 추적 가능.

## 데이터 모델 (Mock)
- `ApprovalEvent`: `decision (pending|approved|rejected)`, `actor`, `comment`, `source(user|system|signalr)`.
- `approvalEvents[routingId]` 맵으로 보관, 최신 순 정렬.

## 후속 과제
- BFF API (`POST /workspace/routings/{id}/approvals`) 연동, optimistic update → 실패 시 롤백.
- SignalR 실제 허브와 이벤트 스키마 조율.
- 승인 사유 템플릿/자동 완성 기능 추가 검토.