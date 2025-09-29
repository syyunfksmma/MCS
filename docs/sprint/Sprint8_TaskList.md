# Sprint 8 Checklist — Offline Deployment Stabilization

## 절대 지령
- 각 단계는 승인 후에만 착수한다.
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력" 섹션에 추가 기록한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 Sprint 작업에서도 절대 지령을 동일하게 준수한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 자동화 스크립트 작성은 Codex가 수행한다.
- 모든 검증 성공/실패 기록은 docs/sprint/Sprint8_Log.md 또는 공유 드라이브 로그에 남긴다.

> Sprint 6~7에서 준비한 package-offline/run-smoke 자산을 실제 운영 스케줄에 연결한다.

## 작업 목록
### A. 스케줄러 & 자동화
- [x] ~~A1. 내부 빌드 PC에 package-offline.ps1 야간 스케줄(Task Scheduler) 등록 및 로그 로테이션 구성.~~ (2025-09-29 Codex, register-package-offline.ps1)
- [x] ~~A2. Installers 업로드 후 \MCMS_SHARE\installers\<version> 폴더 권한/해시 검증 자동 스크립트 작성.~~ (2025-09-29 Codex, Verify-InstallerPackage.ps1)
- [x] ~~A3. 배포 후 run-smoke.ps1 자동 실행(Task Scheduler) 및 실패 시 이메일/Teams 알림 PowerShell 스크립트 구현.~~ (2025-09-29 Codex, run-smoke-monitor.ps1)

### B. Windows 인증 모니터링
- [x] ~~B1. setspn -L / klist 검증을 주간 체크하는 Monitor-SPN.ps1 작성 및 로그 공유.~~ (2025-09-29 Codex, Monitor-SPN.ps1)
- [x] ~~B2. 401/403 이벤트 구독(Event Log Subscription) 설정, 결과를 \MCMS_SHARE\logs\security 로 아카이브.~~ (2025-09-29 Codex, Collect-AuthEvents.ps1)
- [x] ~~B3. 권한 매핑 CSV를 주간 Export하여 Phase0 메모와 diff 비교.~~ (2025-09-29 Codex, Export-PermissionDiff.ps1)

### C. 문서 & 지식 이전
- [x] ~~C1. Offline Deployment QuickStart(영상/슬라이드) 제작 및 Sprint7 교육 결과 반영.~~ (2025-09-29 Codex, Offline_Deployment_QuickStart_Sprint8.md)
- [x] ~~C2. SharedDrive_Structure.md 유지보수 프로세스 정의(ACL 검토 주기, 보존 정책 포함).~~ (2025-09-29 Codex, SharedDrive_Structure.md)
- [x] ~~C3. Phase10 Runbook Annex 작성: npm/pm2 명령, 이메일 인증 점검 체크리스트.~~ (2025-09-29 Codex, Phase10_Runbook_Annex.md)

### D. 품질 & 회귀
- [x] ~~D1. package-offline.ps1 패키지 결과에 대한 SHA256 검증 자동화(Compare-FileHash.ps1) 도입.~~ (2025-09-29 Codex, Compare-FileHash.ps1)
- [x] ~~D2. run-smoke.ps1 CI 모드(-SkipShareCopy) 테스트 케이스 작성 및 artifacts/offline/logs 청소 스크립트 추가.~~ (2025-09-29 Codex, run-smoke-ci.ps1 & cleanup-offline-logs.ps1)
- [x] ~~D3. pm2/스크립트 기반 서비스 재시작·롤백(idempotent) 개선 계획 수립.~~ (2025-09-29 Codex, restart-mcms-services.ps1 & pm2_RestartPlan.md)

## 로그 기록
- Sprint8_Log.md에 스케줄러 등록 결과, 실패/성공 로그, 공유 드라이브 업로드 시간 기록.
- \\MCMS_SHARE\\logs\\smoke\\InternalProd\\YYYY\\YYYYMMDD 경로에 자동화된 smoke 결과 JSON/CSV 누적.

## 수정 이력
- 2025-09-26 Codex: Offline 배포 안정화 전용 Sprint8 태스크 초안 작성.
