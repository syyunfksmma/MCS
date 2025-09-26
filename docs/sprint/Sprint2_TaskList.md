# Sprint 2 Checklist — Workspace & Workflow

## 절대 지령
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 Sprint 작업에서도 절대 지령을 동일하게 준수한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

> 이 문서는 Sprint 2 진행 상황과 로그를 함께 관리한다.

## 작업 목록
### A. Workspace Drag & Drop
- [x] A1. Drag & Drop 라이브러리 확정 및 Routing 단계 편집 컴포넌트 초안
- [x] A2. 키보드 접근성 대응(포커스 이동/순서 변경 단축키)
- [x] A3. 단계 Undo/Redo 및 Dirty 상태 배너 구현

### B. 파일 관리 + meta.json
- [x] B1. 단계별 파일 업로드 UI (Drag & Drop + Progress)
- [x] B2. meta.json 미리보기 및 다운로드/업데이트 흐름 (Mock 데이터)

### C. Add-in Control Panel
- [x] C1. Add-in 큐 목록 테이블/필터 UI
- [x] C2. 재시도/취소 버튼 및 확인 모달 (Mock API 연동)
- [x] C3. SignalR 이벤트 수신 스텁(재연결 로직 포함)

### D. 승인/반려 워크플로우
- [x] D1. 승인/반려 코멘트 모달 및 폼 검증
- [x] D2. 히스토리 타임라인과 승인 이벤트 연동(Mock)
- [x] D3. 승인/반려 API 연동 추상화(BFF 준비)

### E. 테스트 & 성능
- [x] E1. Drag & Drop/승인 플로우 Playwright 시나리오 추가
- [x] E2. React Profiler 기반 렌더링 성능 점검(Workspace)

### F. 문서 & 로그
- [x] F1. Workspace 설계 다이어그램(Swimlane) 작성
- [x] F2. Sprint2_Log.md에 단계별 로그/결과 기록

## 로그 기록
- (작성 예정)









