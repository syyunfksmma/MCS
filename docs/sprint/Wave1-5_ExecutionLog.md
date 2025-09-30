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

## Wave Execution Log (작성: 2025-09-30 11:28)
- 진행 기준: Wave 1~5를 순차적으로 연속 실행하며 각 단계 착수/완료 시 상태를 기록한다.
- 산출물: 관련 Task List 불릿 메모, Sprint 로그, QA 문서, 테스트 스크립트, 데모 녹화.

### Wave 1 – Routing Workspace 초안 정렬
- 상태: Kick-off 완료, 세부 작업 개시 (진행중).
- 착수 메모: Focus 영역은 Flow G/H/I1. /routing-groups/order API와 ExplorerShell.tsx 상태 전이를 재검토.
- 즉시 산출물:
  - docs/implementation/Wave1_G1G2_Notes.md
  - docs/testing/Sprint6_FlowG_H_Regressions.md
- 금일 액션: Drag & Drop Mock API 응답 정의, Inline Edit UX 플로우 다이어그램 작성, Routing Creation Wizard 필드 검증 시나리오 초안.

### Wave 2 – 자산 전송 및 SolidWorks 연동
- 상태: 사전 준비 중 (예정).
- 시작 조건: Wave 1 I1 업로더 PoC 검증, Telemetry 이벤트(성공/실패) 로깅이 완료되어야 함.
- 준비 액션: SolidWorks 파일 샘플 수집, Explorer 프로토콜 핸들러 테스트 케이스 작성.

### Wave 3 – 운영 정책 및 플래그 거버넌스
- 상태: 대기.
- 선행 조건: Wave 2 성공 로그를 바탕으로 공유 드라이브 정책과 Feature Flag 토글 플로우를 정비.
- 준비 액션: Flag 감사 로그 스키마 초안, Admin Role UX wireframe 업데이트.

### Wave 4 – 성능/신뢰성 Hardening
- 상태: 대기.
- 선행 조건: Wave 3에서 플래그/헬스체크가 정상 동작할 것.
- 준비 액션: React Query Metrics 대시보드 스펙, Alert Threshold 파라미터 표 정리.

### Wave 5 – Explorer UI 확장
- 상태: 대기.
- 선행 조건: Wave 4의 성능 지표가 안정화하고, Routing Detail 개선 작업이 배포 준비 상태일 것.
- 준비 액션: Explorer KPI 위젯 데이터 매핑, ESPRIT EDGE API 레이트 제한 완화 전략 정리.

### 리스크 & 대응
- Drag & Drop 정렬에서 optimistic update 실패 시 재정렬 로직이 필요 → ExplorerShell.tsx 롤백 전략 명시.
- Shared-drive Callback Health 모니터링을 위해 사내망 로그 접근 권한 확인 필요.
- Explorer Dashboard KPI와 ESPRIT EDGE API 연동 시 레이트 제한 고려 → 모킹/캐싱 전략 준비.

### 다음 점검 포인트
- Wave 1 설계 산출물 리뷰 후 사용자 승인 요청.
- 업로더 PoC Telemetry instrumentation 결과 검증.
- SolidWorks 연동 UI mock 데모 초안 준비.

