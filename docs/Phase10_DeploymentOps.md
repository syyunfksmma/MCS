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
# Phase 10 - 배포 및 운영 계획

## 변경 전 전략 요약
- ~~MSIX + PowerShell 기반 클라이언트 배포 및 CmdHost 원격 명령 체계~~
- ~~Azure DevOps/Jenkins CI/CD 파이프라인과 OpenTelemetry Collector 다중 백엔드 연동~~
- ~~Grafana/Elastic 중심의 이상 탐지, CmdHost 명령 승인, MSIX 방화벽 예외 프로세스~~

위 항목은 사내망 전용 CAM 작업 웹서비스 재편에 따라 폐기되었으며, 아래의 ASP.NET Core 8 + SignalR + SQL Server + React 19(Vite) 기반 계획으로 대체한다.

## 1. 배포 전략
### 1.1 중앙 집중형 서비스 (1차)
- **플랫폼**: Windows Server 2022 + IIS(역방향 프록시) + Kestrel(Self-Contained)
- **배포 절차**:
  1. `dotnet publish -c Release` 산출물과 `web.config`를 준비한다.
  2. PowerShell `scripts/deploy/Deploy-CamService.ps1`로 IIS 사이트 중지 → 파일 동기화 → App Pool 재기동을 수행한다.
  3. 내부 CA 서명 TLS 인증서를 IIS에 바인딩하고 TLS 1.2 이상을 강제한다.
  4. AD/Kerberos 통합 인증이 정상 동작하는지 klist, Event Log로 검증한다.
- **방화벽 정책**: 443/TCP만 개방, SignalR WebSocket/Long Polling 포트를 사전 승인한다.

### 1.2 설치형(MSI/EXE) 보조 채널 (2차, 필요 시)
- **패키징**: WiX Toolset 기반 MSI, ASP.NET Core self-contained 런타임 포함
- **옵션**: 로컬 SQL Server Express 설치/연결 선택 제공, 내부 CA TLS 인증서 자동 배포 스크립트 포함
- **설치 후 작업**: 로컬 서비스 계정 생성, `appsettings.Local.json` 배포, 중앙 서버와 동기화 옵션 안내
- **업데이트**: 자동 업데이트 미적용 시 재배포 절차 문서화, 버전별 MSI 보관

## 2. 데이터베이스 및 구성 관리
- 운영 DB는 중앙 SQL Server(필요 시 Always On)로 일원화하고, EF Core 마이그레이션(`dotnet ef database update`)으로 배포한다.
- PoC/설치형은 SQL Server Express(LocalDB 가능)를 사용하며, 초기 스키마 스크립트를 MSI에 포함한다.
- 구성 파일은 `appsettings.Production.json`(중앙), `appsettings.Local.json`(설치형)으로 분리하여 사내 Git에서 버전 관리한다.
- 비밀 정보는 Windows Credential Manager 또는 사내 Secret Vault에 저장하며 외부 SaaS는 사용하지 않는다.

## 3. 인증 및 보안
- Windows 통합 인증(AD/Kerberos)을 기본 인증 방식으로 사용한다.
- 내부 CA TLS 인증서 갱신은 Task Scheduler + PowerShell 자동화를 활용하여 만료 30일 전에 교체한다.
- 단계 전환 시 보안 점검 체크리스트: TLS 프로토콜, 인증 헤더, SignalR WebSocket 허용, SQL Server 권한, 로깅 권한을 검토한다.

## 4. 테스트 및 승인 절차
- 각 단계 착수 전 전체 범위를 리뷰하고 오류를 식별하여 필요 시 승인 재요청한다.
- 단계 1(로컬 PoC) → 단계 2(내부망 배포) → 단계 3(MSI 보조 채널) → 단계 4(유지보수)의 순서를 준수한다.
- 단계 완료 시 공통 검증 항목을 기록한다:
  - 단위/통합 테스트 100% 커버리지 목표 달성 여부
  - k6 부하 테스트(동시 사용자 100명, P95 < 150ms) 결과 및 로그
  - AD 인증/권한 검증, TLS 핸드셰이크 캡처
  - 사용성 테스트(코딩 비전문 인원) 피드백 반영 내역

## 5. 모니터링 및 로그 수집
- Serilog Rolling File + Windows Event Log를 표준으로 하며, 로그는 공유 스토리지로 수집한다.
- SignalR Hub, 저장/로드 API, DB 트랜잭션 로그를 분리하여 분석한다.
- 장애 대응 Runbook: 서비스 재시작 → 로그 분석 → 승인 요청 → 후속 조치 기록.

## 6. 백업 및 복구
- 운영 SQL Server 백업: 풀(일간), 차등(12시간), 로그(1시간) 정책을 따른다.
- 애플리케이션: `dotnet publish` 결과와 구성 파일을 버전별로 보관한다.
- 설치형: MSI, 초기 설정 파일, 로컬 DB 백업 절차를 문서화하고 정기 점검한다.

## 7. 교육 및 문서화
- 중앙 집중형 배포 가이드, 설치형 배포 가이드, 장애 대응 매뉴얼을 작성해 내부 위키에 게시한다.
- 단계별 승인 요청 템플릿과 체크리스트를 제공한다.
- Codex가 생성한 코드/스크립트/테스트/문서 산출물과 릴리즈 노트를 연결하여 추적성을 확보한다.

## 8. 오픈 이슈
- 내부 CA 인증서 자동 갱신 정책 세부 절차 확정 필요
- SignalR Presence 로깅/보존 정책 결정
- 설치형 로컬 DB와 중앙 DB 간 동기화/병합 전략 최종 검토

