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
- ~~A1. 내부 빌드 PC에 package-offline.ps1 야간 스케줄(Task Scheduler) 등록 및 로그 로테이션 구성.~~ (2025-09-29 Codex, register-package-offline.ps1)
- ~~A2. Installers 업로드 후 \MCMS_SHARE\installers\<version> 폴더 권한/해시 검증 자동 스크립트 작성.~~ (2025-09-29 Codex, Verify-InstallerPackage.ps1)
- ~~A3. 배포 후 run-smoke.ps1 자동 실행(Task Scheduler) 및 실패 시 이메일/Teams 알림 PowerShell 스크립트 구현.~~ (2025-09-29 Codex, run-smoke-monitor.ps1)

### B. Windows 인증 모니터링
- ~~B1. setspn -L / klist 검증을 주간 체크하는 Monitor-SPN.ps1 작성 및 로그 공유.~~ (2025-09-29 Codex, Monitor-SPN.ps1)
- ~~B2. 401/403 이벤트 구독(Event Log Subscription) 설정, 결과를 \MCMS_SHARE\logs\security 로 아카이브.~~ (2025-09-29 Codex, Collect-AuthEvents.ps1)
- ~~B3. 권한 매핑 CSV를 주간 Export하여 Phase0 메모와 diff 비교.~~ (2025-09-29 Codex, Export-PermissionDiff.ps1)

### C. 문서 & 지식 이전
- ~~C1. Offline Deployment QuickStart(영상/슬라이드) 제작 및 Sprint7 교육 결과 반영.~~ (2025-09-29 Codex, Offline_Deployment_QuickStart_Sprint8.md)
- ~~C2. SharedDrive_Structure.md 유지보수 프로세스 정의(ACL 검토 주기, 보존 정책 포함).~~ (2025-09-29 Codex, SharedDrive_Structure.md)
- ~~C3. Phase10 Runbook Annex 작성: npm/pm2 명령, 이메일 인증 점검 체크리스트.~~ (2025-09-29 Codex, Phase10_Runbook_Annex.md)

### D. 품질 & 회귀
- ~~D1. package-offline.ps1 패키지 결과에 대한 SHA256 검증 자동화(Compare-FileHash.ps1) 도입.~~ (2025-09-29 Codex, Compare-FileHash.ps1)
- ~~D2. run-smoke.ps1 CI 모드(-SkipShareCopy) 테스트 케이스 작성 및 artifacts/offline/logs 청소 스크립트 추가.~~ (2025-09-29 Codex, run-smoke-ci.ps1 & cleanup-offline-logs.ps1)
- ~~D3. pm2/스크립트 기반 서비스 재시작·롤백(idempotent) 개선 계획 수립.~~ (2025-09-29 Codex, restart-mcms-services.ps1 & pm2_RestartPlan.md)

## 로그 기록
- Sprint8_Log.md에 스케줄러 등록 결과, 실패/성공 로그, 공유 드라이브 업로드 시간 기록.
- \\MCMS_SHARE\\logs\\smoke\\InternalProd\\YYYY\\YYYYMMDD 경로에 자동화된 smoke 결과 JSON/CSV 누적.

## 수정 이력
- 2025-09-26 Codex: Offline 배포 안정화 전용 Sprint8 태스크 초안 작성.

