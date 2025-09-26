# Sprint 6 Checklist — Deployment & Operations

## 절대 지령
- 각 단계는 승인 후에만 착수한다.
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력" 섹션에 추가 기록한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 Sprint 작업에서도 절대 지령을 동일하게 준수한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

> 이 문서는 해당 Sprint 진행 상황과 로그를 함께 관리한다.

## 작업 목록
### A. 배포 자동화/검증
- [ ] A1. Stage→Prod 배포 자동화 스크립트 보완
- [ ] A2. 배포 전/후 Smoke Test 자동 실행
- [ ] A3. 배포 승인/롤백 자동 알림 설정

### B. Runbook & DR
- [ ] B1. 배포 Runbook 세부 절차 검토/업데이트
- [ ] B2. 롤백 시뮬레이션 실행 및 결과 기록
- [ ] B3. DR 전략 문서화(Blue/Green PoC 결과 반영)

### C. 모니터링/알람 튜닝
- [ ] C1. Grafana/Prometheus 대시보드 확정
- [ ] C2. Alert Rule Fine-tuning 및 노이즈 감소 작업
- [ ] C3. 로그 파이프라인 테스트 및 보존 정책 업데이트

### D. 문서 & 로그
- [ ] D1. Sprint6_Log.md에 배포/운영 변화 기록
- [ ] D2. Ops 대상 커뮤니케이션 템플릿 작성

## 로그 기록
- 2025-09-25: F1/F2 스트리밍 SHA-256 & 병렬 병합 PoC 코드 적용, Docker Desktop 미기동으로 k6 재측정 대기(Sprint6_Routing_Log.md 참조).

### E. Explorer UX Alignment (Teamcenter)
- [ ] E1. 좌측 필터 레일 컴포넌트 정보구조 확정 및 ExplorerShell 반영 계획 수립
- [ ] E2. Ribbon 액션 그룹화 규칙 정의 후 UI 설계 문서 업데이트
- [ ] E3. Hover Quick Menu 상호작용 플로우 초안과 검증 계획 작성
### F. Chunk Upload Optimisation
- [ ] F1. Streaming SHA-256 클라이언트/서버 구현 계획 수립 및 PoC (ReadableStream+IncrementalHash)
- [ ] F2. 병렬 청크 병합 프로토타입 작성 및 워크스페이스 업로더와 서비스 계층 검증
## 수정 이력
- 2025-09-25 Codex: SLA 대응 지침 및 문서 변경 기록 규칙 추가, F1/F2 세부 계획 반영.
- 2025-09-25 Codex: F1/F2 PoC 진행 로그 및 Docker 미기동 이슈 기록.

