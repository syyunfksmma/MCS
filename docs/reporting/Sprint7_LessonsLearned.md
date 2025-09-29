# Sprint 7 Lessons Learned

## 기술
- FeatureGate 토글 대비 Explorer Ribbon에서 명확한 상태 피드백 필요 → Sprint8에서 토글 UI 개선 예정.
- Chunk Upload 테스트 자동화가 아직 미구현 → k6 시나리오를 CI에 통합 필요.

## 프로세스
- Ops 커뮤니케이션 템플릿으로 승인/공지 속도가 향상되었으나, Teams 자동화(Flow) 연동 필요.
- 교육 자료 제작 시 데모 영상 녹화 일정을 Sprint 초반에 확보해야 함.

## 도구/모니터링
- Grafana Alert Rule 초안을 즉시 Alertmanager에 적용할 수 있도록 구성 파일 자동 배포 파이프라인 필요.
- 로그 파이프라인 보존 정책(14/30일)에 대한 운영팀 합의가 요구됨 → 후속 회의 일정화.

## 액션 아이템
1. Alertmanager 미적용 규칙을 Sprint8에서 배포 파이프라인에 포함.
2. 교육 세션 피드백 설문 툴 도입(Microsoft Forms or Sheets) 검토.
3. Chunk Upload k6 스크립트에 CI 파라미터(Chunk Size) 주입 옵션 추가.

*Codex — 2025-09-29 12:08 KST*
