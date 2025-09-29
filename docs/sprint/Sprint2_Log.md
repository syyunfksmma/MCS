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
# Sprint 2 Activity Log - Workspace & Workflow

> 모든 작업 활동은 로그로 기록하며, 필요 시 다이어그램/코드/Mock API 예시를 첨부한다.

## 2025-09-22 Codex
- Task A1 완료: Explorer TreePanel에 drag & drop 지원 추가, 동일 부모 내 순서 조정 허용.
- Task A1 문서: docs/sprint/Sprint2_DragDropRouting.md에 라이브러리 선정과 재정렬 규칙 정리.
- Task A2 완료: Ctrl 기반 workspace 키보드 단축키 및 TreePanel selection 동기화 구현.
- Task A2 문서: docs/sprint/Sprint2_KeyboardShortcuts.md에 단축키 맵과 가드 전략 기록.
- Task A3 완료: 워크스페이스 undo/redo 스택과 Dirty 상태 배지, 도구 모음 버튼 구현.
- Task A3 문서: docs/sprint/Sprint2_WorkspaceState.md에 스냅샷/히스토리 구조 정리.
- Task B1 완료: WorkspaceUploadPanel drag & drop UI와 Mock progress 리스트 추가, routing 선택 의존성 적용.
- Task B1 문서: docs/sprint/Sprint2_WorkspaceUpload.md에 UX/기술 요약 정리.
- Task B2 완료: meta.json naming rule/Mock upload·download 패널 구성, Preview/Validation 흐름 제공.
- Task B2 문서: docs/sprint/Sprint2_MetaJsonRules.md에 규칙 및 처리 전략 정리.
- Task C1 완료: Add-in 큐 테이블/검색/필터 UI 구현, 연결 상태 배지 및 상단 요약 배치.
- Task C2 완료: 재시도/취소 액션에 확인 모달을 적용하고 상태 전환 메시지 노출.
- Task C3 완료: SignalR 모의 이벤트 스트림과 재연결 로직(자동 및 수동)을 구현.
- Task C1~C3 문서: docs/sprint/Sprint2_AddinControlPanel.md에 큐 UI/액션/SignalR 스텁 설계 기록.
- Task D1 완료: 승인/반려 모달과 코멘트 검증, Routing 상태 업데이트 및 히스토리 타임라인 구현.
- Task D2 완료: Add-in 작업 이벤트와 승인 히스토리 동기화, SignalR 전환 시 자동 이벤트 기록.
- Task D3 완료: workspace/lib/workspace.ts에 승인/작업 관리용 Mock API 추상화 작성 및 ExplorerShell 연동.
- Task D 문서: docs/sprint/Sprint2_ApprovalWorkflow.md에 승인 흐름 설계 및 후속 과제 정리.
- Task E1 완료: Playwright `workspace-approval.spec.ts` 시나리오 초안 작성(현재 skip, 추후 서버 연동 예정).
- Task E2 완료: React Profiler 측정 계획 문서화 및 개선 체크리스트 정리.
- Task E 문서: docs/sprint/Sprint2_ProfilerPlan.md에 프로파일링 절차/지표 기록.
- Task F1 완료: Workspace Swimlane 다이어그램(mermaid) 작성.
- Task F2 완료: Sprint2_Log.md에 전체 단계 로그/결과 기록 유지.
- Task F 문서: docs/sprint/Sprint2_Swimlane.md에 역할별 Swimlane 정의.
- npm run lint 재실행, 경고/오류 없음.
