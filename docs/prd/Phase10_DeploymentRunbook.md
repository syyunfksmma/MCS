# Phase 10 산출물 - 배포 Runbook
## 절대 지령
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력"에 기록한다.


## 1. 사전 준비
- CI/빌드 머신: .NET Framework 4.8 Developer Pack 필수 (TEST/CAM_API.csproj 빌드)
- Stage/Prod 서버: .NET Framework 4.8 Runtime 확인 (Developer Pack 불필요)

- Stage 환경에 최신 버전 배포 & Smoke Test 완료
- Change Request 승인 (Product Owner, Infra Lead)
- 백업: 기존 Next.js 아티팩트 및 설정 압축 백업

## 2. 배포 스크립트(Prod)
1. `Connect-Server` → Web Frontend 서버 접속
2. `Stop-Service MCMS.NextPortal`
3. 아티팩트 unzip → `/srv/mcms-next/`
4. `npm ci --production` (필요 시)
5. 환경변수 파일(.env) 업데이트 / Secret 주입
6. `Start-Service MCMS.NextPortal`
7. IIS Reset 필요 시 `iisreset /noforce`
8. Health Check `/healthz` 확인
9. Smoke Test(Explorer, Workspace, Admin)

PowerShell 예시 `deploy-prod.ps1`:
```powershell
param([string]$ArtifactPath)
Stop-Service MCMS.NextPortal
Expand-Archive -Path $ArtifactPath -DestinationPath "C:\srv\mcms-next" -Force
Start-Service MCMS.NextPortal
$health = Invoke-RestMethod "https://portal.mcms.local/healthz"
if ($health.status -ne 'ok') { throw 'Health check failed' }
```

## 3. 배포 후 체크리스트
- Explorer/Workspace/Approval 주요 플로우 Smoke Test
- SignalR 연결 상태 확인 (Add-in 이벤트 수신)
- 로그/모니터링 대시보드 오류 없는지 확인
- Teams 배포 완료 알림 전송

## 4. 배포 실패 시
- 즉시 서비스 중단 상황 기록 → 롤백 절차 실행(Phase10_RollbackStrategy 참고)
- 오류 로그 수집 → Ops/개발자 공유

## 5. 문서화 및 감사
- 배포 로그 저장 (Azure DevOps, ELK)
- Change Request Close 보고
- Lessons Learned 기록(Confluence)

## 6. TODO
- Stage/Prod 환경 변수 관리 자동화 (Secret Manager)
- 배포 스크립트 idempotent 개선
- 자동 Smoke Test 스크립트 작성
## 수정 이력
- 2025-09-25 Codex: 절대 지령/변경 이력 규칙 반영 및 .NET 4.8 요구사항 정리.
