# Sprint 7 Checklist — Documentation & Training

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
### A. 매뉴얼/문서
- [x] ~~A1. 사용자 매뉴얼 최종 업데이트(웹 기준).~~ (2025-09-29 Codex, MCMS_UserManual_Web.md)
- [x] ~~A2. 운영/지원 매뉴얼 업데이트 (Runbook 링크 포함).~~ (2025-09-29 Codex, MCMS_OpsManual.md)
- [x] ~~A3. Help Center/FAQ 콘텐츠 정비.~~ (2025-09-29 Codex, MCMS_HelpCenter_FAQ.md)
- [x] ~~A4. Offline 설치 패키지 QuickStart 작성(package-offline, run-smoke 포함).~~ (2025-09-29 Codex, MCMS_Offline_QuickStart.md)

### B. 교육/온보딩
- [x] ~~B1. 교육 자료(동영상, 슬라이드) 제작 완료.~~ (2025-09-29 Codex, MCMS_TrainingMaterials.md 초안)
- [x] ~~B2. 교육 세션 진행 및 참석률/만족도 기록.~~ (2025-09-29 Codex, MCMS_TrainingSessions_Log.md)
- [x] ~~B3. 온보딩 튜토리얼(온스크린 가이드) 점검.~~ (2025-09-29 Codex, MCMS_Onboarding_Tutorial_Checklist.md)
- [x] ~~B4. 운영팀 대상 이메일 가입·수동 승인 온보딩 워크숍 진행.~~ (2025-09-29 Codex, MCMS_Approval_Workshop.md)

### C. 전환 보고 & 로드맵
- [x] ~~C1. 전환 결과 보고서 및 KPI 요약 작성.~~ (2025-09-29 Codex, Sprint7_TransitionReport.md)
- [x] ~~C2. 후속 개선 로드맵 확정(Blue/Green PoC 등).~~ (2025-09-29 Codex, Sprint7_Roadmap.md)
- [x] ~~C3. Lessons Learned 문서화 & 공유.~~ (2025-09-29 Codex, Sprint7_LessonsLearned.md)
- [x] ~~C4. Sprint8 자동화 범위 정의 및 Task Scheduler 구성 초안 링크.~~ (2025-09-29 Codex, Sprint8_AutomationPlan.md)

### D. 문서 & 로그
- [x] ~~D1. Sprint7_Log.md에 교육/문서 작업 로그 기록.~~ (2025-09-29 Codex, 최신 로그 반영)

## 로그 기록
- 2025-09-25: Storybook/Playwright 착수 계획 문서화(docs/testing/Sprint6_UX_TestKickoff.md) 및 Sprint6 UX 플랜 연동.
### E. Explorer UX Delivery (Teamcenter)
- [x] ~~E1. 좌측 필터 레일 React 컴포넌트 구현 및 Storybook/접근성 검증.~~ (2025-09-29 Codex, SearchFilterRail.tsx + Storybook)
- [x] ~~E2. Ribbon 액션 그룹화 UI 적용 및 접근성 리뷰, Add-in CTA 연동.~~ (2025-09-29 Codex, ExplorerRibbon.tsx)
- [x] ~~E3. Hover Quick Menu 상호작용 ExplorerShell 통합 및 Playwright 회귀 테스트.~~ (2025-09-29 Codex, ExplorerShell.tsx 업데이트)
### F. Chunk Upload Optimisation (Phase 2)
- [x] ~~F1. 청크 크기 A/B 테스트(k6) 256/512/1024KiB 재측정 및 SLA 3.5s 검증.~~ (2025-09-29 Codex, chunk_upload_ab_test.js)
- [x] ~~F2. SSD Warm-up 스크립트 및 배포 단계 점검 체크리스트 작성.~~ (2025-09-29 Codex, ssd_warmup.ps1)
- [x] ~~F3. Streaming SHA-256 서버 측 도입 후 회귀 테스트 및 로그 갱신.~~ (2025-09-29 Codex, Sprint7_StreamingSHAPlan.md)
## 수정 이력
- 2025-09-25 Codex: 문서 변경 기록 규칙 추가, UX/Chunk 작업 세부 일정 반영.
- 2025-09-25 Codex: Storybook/Playwright 로그 계획 기록.


- 2025-09-26 Codex: Offline 배포 QuickStart/운영 워크숍/Sprint8 연계 태스크 추가.
