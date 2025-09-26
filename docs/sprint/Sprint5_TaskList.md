# Sprint 5 Checklist — QA & UAT

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

> 이 문서는 해당 Sprint 진행 상황과 로그를 함께 관리한다.

## 작업 목록
### A. 자동화 테스트 강화
- [ ] A1. Playwright E2E 시나리오 확장(Workspace/Admin 흐름)
- [ ] A2. 테스트 데이터 시드/리셋 스크립트 작성
- [ ] A3. 회귀 테스트 스위트 구성 및 CI 연동

### B. UAT 준비
- [ ] B1. UAT 체크리스트/시나리오 패키지 확정
- [ ] B2. UAT 계정 생성 및 환경 리셋
- [ ] B3. 피드백 수집 템플릿 및 대응 프로세스 정리

### C. 접근성/보안/브라우저 검증
- [ ] C1. axe/Lighthouse 기반 접근성 검증
- [ ] C2. OWASP ZAP/보안 스캔 실행
- [ ] C3. Browser matrix 테스트(Chrome/Edge/Firefox/Safari)

### D. 문서 & 로그
- [ ] D1. QA 테스트 리포트(Sprint5_QAReport.md) 작성
- [ ] D2. UAT 진행 로그 및 피드백 요약(Sprint5_Log.md)

## 로그 기록
- (작성 예정)
