# Phase 10 산출물 - 배포 Runbook
## 절대 지령
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력"에 기록한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

## 1. 사전 준비
- ~~CI/빌드 머신: .NET Framework 4.8 Developer Pack 필수 (TEST/CAM_API.csproj 빌드)~~
- ~~Stage/Prod 서버: .NET Framework 4.8 Runtime 확인 (Developer Pack 불필요)~~
- ~~Stage 환경에 최신 버전 배포 & Smoke Test 완료~~
- ~~Change Request 승인 (Product Owner, Infra Lead)~~
- ~~백업: 기존 Next.js 아티팩트 및 설정 압축 백업~~
- 내부 빌드 PC(Windows 11/Server 2022)에 .NET 8 SDK와 Node 18 LTS를 설치하고, msbuild TEST\CAM_API.csproj 및 
pm run build를 통해 오프라인 설치 패키지를 생성한다.
- 배포 대상 윈도우 서버(내부망)에는 IIS + .NET Framework 4.8 Runtime + Windows 인증(IIS Integrated Windows Authentication) 기능을 활성화한다.
- 설치 패키지(MCMS_Setup_<version>.exe)와 롤백용 이전 버전 패키지를 공유 드라이브(\MCMS_SHARE\installers)에 보관한다.

## 2. 설치 절차 (내부망 윈도우 서버)
1. ~~Connect-Server → Web Frontend 서버 접속~~
2. ~~Stop-Service MCMS.NextPortal~~
3. ~~아티팩트 unzip → /srv/mcms-next/~~
4. ~~
pm ci --production (필요 시)~~
5. ~~환경변수 파일(.env) 업데이트 / Secret 주입~~
6. ~~Start-Service MCMS.NextPortal~~
7. ~~IIS Reset 필요 시 iisreset /noforce~~
8. ~~Health Check /healthz 확인~~
9. ~~Smoke Test(Explorer, Workspace, Admin)~~
1. 관리자 권한 PowerShell에서 MCMS_Setup_<version>.exe /quiet /log install.log 실행.
2. 설치 프로그램이 IIS 사이트(Default Web Site/MCS)에 애플리케이션을 배치하고, Windows 인증을 사용하도록 web.config를 자동 구성한다.
3. 설치 완료 후 PowerShell에서 Test-NetConnection localhost -Port 443로 포트 오픈 여부를 확인한다.
4. 브라우저에서 https://<server>/healthz를 Windows 인증 계정으로 호출해 200 응답 확인.
5. Smoke Test 스크립트(scripts/deploy/run-smoke.ps1 -Environment InternalProd) 실행.

## 3. 배포 후 체크리스트
- ~~Explorer/Workspace/Approval 주요 플로우 Smoke Test~~
- ~~SignalR 연결 상태 확인 (Add-in 이벤트 수신)~~
- ~~로그/모니터링 대시보드 오류 없는지 확인~~
- ~~Teams 배포 완료 알림 전송~~
- Windows 이벤트 로그(Application)와 C:\MCMS\logs 폴더에서 오류가 없는지 확인한다.
- MCMS Worker 서비스가 최신 DLL을 로드했는지 Windows 서비스 MMC에서 확인한다.
- 배포 완료 사실을 내부 배포일지(\MCMS_SHARE\logs\deployment.md)에 기록한다.

## 4. 배포 실패 시
- ~~즉시 서비스 중단 상황 기록 → 롤백 절차 실행(Phase10_RollbackStrategy 참고)~~
- ~~오류 로그 수집 → Ops/개발자 공유~~
- 설치 로그(install.log)와 Windows 이벤트 로그를 확보한 후, 이전 버전 설치 파일로 MCMS_Setup_<prev>.exe /quiet /log rollback.log를 실행한다.
- 롤백 후 동일 Smoke Test를 다시 수행하고 결과를 배포일지에 기록한다.

## 5. 문서화 및 감사
- ~~배포 로그 저장 (Azure DevOps, ELK)~~
- ~~Change Request Close 보고~~
- ~~Lessons Learned 기록(Confluence)~~
- 설치 로그, Smoke Test 결과, 사용자 승인 메모를 docs/sprint/Sprint6_Log.md와 내부 공유 드라이브에 보관한다.
- Lessons Learned는 docs/ops/Deployment_Lessons.md에 Windows 설치 관점으로 정리한다.

## 6. TODO
- ~~Stage/Prod 환경 변수 관리 자동화 (Secret Manager)~~
- ~~배포 스크립트 idempotent 개선~~
- ~~자동 Smoke Test 스크립트 작성~~
- 설치 패키지 빌드 자동화를 위해 scripts/deploy/package-offline.ps1 초안을 작성하고 내부 빌드 PC에서 예약 작업으로 등록한다.
- Windows 인증 사용자 매핑 문서를 업데이트하고 주기적으로 테스트 계정으로 검증한다.

## 수정 이력
- 2025-09-25 Codex: 절대 지령/변경 이력 규칙 반영 및 .NET 4.8 요구사항 정리.
- 2025-09-26 Codex: 내부망 윈도우 서버 설치형 배포 기준으로 Runbook 재정비, GitHub 기반 단계 취소선 처리.
