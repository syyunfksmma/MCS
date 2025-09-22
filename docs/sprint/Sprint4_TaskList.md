# Sprint 4 Checklist — Performance & Reliability

## 절대 지령
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 Sprint 작업에서도 절대 지령을 동일하게 준수한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.

> 이 문서는 해당 Sprint 진행 상황과 로그를 함께 관리한다.

## 작업 목록
### A. Lighthouse & Web Vitals 자동화
- [ ] A1. Production build 기반 Lighthouse CI 스크립트 작성
- [ ] A2. WebPageTest 또는 사내 에이전트 연동 계획 실행
- [ ] A3. Web Vitals 결과 대시보드(그래프) 초안 만들기

### B. Load & Stress 테스트
- [ ] B1. k6 부하 테스트 스크립트 작성(Explorer/Workspace 시나리오)
- [ ] B2. 부하 테스트 실행 및 리포트 문서화
- [ ] B3. 자원 사용량 모니터링(프로파일링) 정리

### C. Chaos/회복 시나리오
- [ ] C1. Node 서비스 중단/재기동 스크립트 작성
- [ ] C2. SignalR 끊김/재연결 자동화 테스트
- [ ] C3. 회복 절차 및 알림 흐름 검증 (Ops 대상)

### D. 장애 대응 UX
- [ ] D1. Maintenance 페이지/오프라인 배너 구현
- [ ] D2. Toast/Alert 메시지 표준화 및 접근성 검토
- [ ] D3. 장애 리포트 템플릿 작성

### E. 문서 & 로그
- [ ] E1. 성능 결과 보고서(Sprint4_PerformanceReport.md) 작성
- [ ] E2. Sprint4_Log.md에 로그 및 차트 링크 기록

## 로그 기록
- (작성 예정)
