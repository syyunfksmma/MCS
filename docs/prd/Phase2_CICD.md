# Phase 2 산출물 - 배포/패키징 절차 메모

## 1. 개요
- ~~CI 트리거: main 브랜치 PR, elease/* 브랜치 push~~
- ~~CD 트리거: 승인을 통과한 elease/* 브랜치 → Stage/Prod 배포~~
- ~~도구: Azure DevOps YAML Pipeline (GitHub Actions 대안으로 문서화)~~
- 내부 빌드 PC(Windows)에서 야간/수동 트리거로 설치 패키지를 생성하고, 결과물을 공유 드라이브에 배포한다.

## 2. 단계별 작업 (오프라인 패키징)
| 단계 | 작업 | 상세 |
|---|---|---|
| Build | Install & Lint | 
pm install, 
pm run lint, dotnet build |
| Test | Smoke | scripts/tests/run-smoke.ps1 -Suite Build |
| Package | 설치 파일 생성 | scripts/deploy/package-offline.ps1 -Version <ver> |
| Publish | 공유 드라이브 업로드 | \\MCMS_SHARE\\installers\\<ver> |
| Deploy | Windows Installer 실행 | 서버에서 MCMS_Setup_<ver>.exe /quiet |
| Verify | Health Check + Manual Smoke | Windows 인증 계정으로 /healthz, UI 스모크 |
| Rollback | 이전 버전 installer 재실행 | MCMS_Setup_<prev>.exe /quiet |

## 3. 자동화 스크립트 개요
`powershell
# scripts/build/build-offline.ps1
npm install --prefix web/mcs-portal
npm run build --prefix web/mcs-portal
msbuild TEST/CAM_API.csproj /t:Build /p:Configuration=Release /p:Platform=x64
pwsh scripts/tests/run-smoke.ps1 -Suite Build
pwsh scripts/deploy/package-offline.ps1 -Version 
Copy-Item publish\*.exe \\MCMS_SHARE\installers -Force
`

## 4. 배포 고려사항
- 설치 전: 기존 서비스 백업(C:\MCMS\backup\<timestamp>)
- 설치 중: 서비스 자동 중지/재시작 (NSSM 또는 Windows Service control)
- 롤백: 이전 설치 파일과 백업 폴더를 동일 위치에 유지

## 5. 보안/검증
- ~~비밀 값: Azure Key Vault/ADO Variable Group 이용~~
- 비밀 값: Windows Credential Manager 또는 로컬 암호화 파일로 관리
- 코드 스캔: 오프라인 SAST/Dependency Check를 빌드 스크립트에 포함하고 결과 로그 보관
- 배포 승인: 내부 Change Request 문서에 서명 후 진행

## 6. 관측성
- ~~배포 로그: Azure DevOps + ELK~~
- ~~알림: Teams Webhook (CI 실패, 배포 성공/실패)~~
- 배포 로그: C:\MCMS\logs\deploy 폴더 및 docs/sprint/Sprint6_Log.md
- 알림: 내부 이메일 또는 온콜 목록에 수동 통보
- Metrics: 배포 시간, 실패율을 엑셀 시트로 집계

## 7. TODO
- ~~E2E 테스트 정확한 범위 확정 (Phase 5 이후 적용)~~
- ~~Stage/Prod 환경 변수 및 Feature Flag 관리 방식 정의~~
- ~~배포 자동화 도중 Add-in 커뮤니케이션 영향도 검토~~
- 설치 패키지 빌드 스크립트에 Windows 인증 Smoke(Integrated auth) 포함
- 공유 드라이브 동기화를 자동화하기 위한 PowerShell 스케줄러 설계

---
2025-09-26 Codex: Azure DevOps/YAML 파이프라인을 폐기하고 내부 오프라인 패키징 절차로 전환.
