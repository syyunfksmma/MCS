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
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
# MCS Project Task List

## 절대지령
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List는 불릿 항목으로 작성하고 신규 생성된 작업에서도 절대 지령을 동일하게 준수한다. 완료 시 불릿 끝에 `(완료 YYYY-MM-DD, 담당자)`를 표기한다.
- 오류 개선을 위해 신규 TASK가 발생하면 TASK LIST를 새로 작성하거나, 기존 LIST에 업데이트 한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- ~~src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트~~
- ~~Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강~~
- ASP.NET Core 8 + SignalR + SQL Server + React 19(Vite) 기반 CAM 작업 웹서비스 구축 및 단계별 승인 절차 준수
- Windows 통합 인증(AD/Kerberos)과 내부 CA TLS 적용 여부를 모든 단계 전환 시 재검증

## 기본 운영 원칙
- 현재는 **혼자 + 내부망 + 수동 배포** 기준을 유지한다.
- 자동화 스크립트/도커 설정은 참고용 자료로 보관하고, 필요할 때만 사용한다.
- 문서와 체크리스트를 최신으로 유지해 수동 절차를 쉽게 재현할 수 있도록 한다.
- ~~Next.js 기반 SSR 배포 절차를 우선 검토한다.~~
- 중앙 집중형 IIS + Kestrel 배포와 WiX 기반 설치형 보조 채널을 병행 고려한다.

## 단계별 Task List

### 단계 1. PoC 환경 구축 및 로컬 기능 구현 (localhost)
- ~~개발환경 설정 (Visual Studio 2022, Node LTS, 계열 NPM/NuGet 포함)~~ (2025-09-29 Codex, docs/setup/LocalDevEnvironment.md)
- ~~DB 부트스트랩 (EF Core + SQL Server Express, rowversion 컬럼 점검)~~ (2025-09-29 Codex, docs/setup/DatabaseBootstrap.md)
- ~~ASP.NET Core API 및 SignalR Hub 구성~~ (2025-09-29 Codex, docs/architecture/API_SignalR_Configuration.md)
- ~~React 19 + Vite + Tailwind v4 + shadcn/ui 초기화 및 Save/Load/번들 스크립트 구성~~ (2025-09-29 Codex, docs/frontend/React19_Vite_Setup.md)

- ~~ERP View Table 뷰 설계: Item_CD/Item_Name/Res_CD 필드 정의~~ (2025-09-29 Codex, docs/data/ERP_View_Table.md)

- ~~성능 테스트(k6) 및 Windows 실행 지침~~ (2025-09-29 Codex, docs/performance/Windows_k6_TestPlan.md)
- ~~PoC 단계 회고 문서화 및 승인 요청~~ (2025-09-29 Codex, docs/meetings/PoC_Governance_Request.md)

### 단계 2. 내부망 서버 배포 및 중앙 집중형 서비스화
- ~~IIS + Kestrel 배포 계획 문서화~~ (2025-09-29 Codex, docs/ops/IIS_Kestrel_Deployment.md)
- ~~내부 CA TLS 인증서 발급 및 SQL Server 보안 전략 수립~~ (2025-09-29 Codex, docs/security/TLS_Strategy.md)
- ~~사내 IP/FQDN 확인 체크리스트 작성~~ (2025-09-29 Codex, docs/ops/Network_IP_Checklist.md)
- ~~운영 로그/경보 Serilog 파이프라인 문서화~~ (2025-09-29 Codex, docs/observability/Serilog_Pipeline.md)

### 단계 3. 설치형(MSI/EXE) 보조 채널 구축 (필요 시)
- ~~WiX Toolset 기반 MSI 패키징 계획 수립~~ (2025-09-29 Codex, docs/installers/WiX_Plan.md)
- ~~SQL Server 옵션 및 구성 자동화 문서화~~ (2025-09-29 Codex, docs/installers/SQL_Server_Options.md)
- ~~자동 업데이트 또는 재배포 절차 문서화 및 테스트~~ (2025-09-29 Codex, docs/installers/AutoInstall_Verification.md)

### 단계 4. 유지보수 및 고도화
- ~~Windows Event Log + Serilog 로그 파이프라인 문서화~~ (2025-09-29 Codex, docs/observability/WindowsEventLog_Integration.md)
- ~~사내 Git + 배포 파이프라인 CI/CD 문서화~~ (2025-09-29 Codex, docs/ci/Git_Deployment_Plan.md)
- ~~사용 패턴·성능 지표 수집 → 성능 최적화 제안 정리~~ (2025-09-29 Codex, docs/reporting/Wave14_Maturity_Metrics.md)
- ~~신규 요구사항 수용 시 단계별 승인 및 문서 업데이트 프로세스 확립~~ (2025-09-29 Codex, docs/prd/New_Requirements_Backlog.md)

## 확인/체크리스트
- ~~PoC/� ��ȯ �� ���� 0�� ���� ������~~ (2025-09-29 Codex, docs/ops/Zero_Downtime_Verification.md)
- ~~k6 ���� �׽�Ʈ ���(P95 < 150ms) ���~~ (2025-09-29 Codex, docs/performance/k6_Results_Wave14.md)
- ~~���� ����(AD ����, SQL Injection, XSS, CSRF) ��� ÷��~~ (2025-09-29 Codex, docs/security/Security_Test_Report_Wave14.md)
- 사용성 테스트 피드백 반영 내역 정리

## 참고
- ~~EXE 빌드 절차 요약서 작성 및 README 링크 연결~~
- ~~수동 테스트 체크리스트(기능/접근성)를 작성해 빌드 전 확인하도록 함~~

## 배포 & 운영 (수동)
- 공유 드라이브 릴리즈 폴더 구조 정의 (버전별/릴리즈노트 포함)
- ~~���� �� ���Ǵ� ȯ�漳��(.config/.env) ��� �� ���� ��� ����~~ (2025-09-29 Codex, docs/config/Config_Env_Management.md)

## 문서 & 자료 정리
- Playwright/프록시 환경 설치 가이드 작성 (README, docs/playwright)
- 내부 수동 배포 절차 문서화 (`docs/ops/InternalManualDeployment.md`)

## 선택/추후 자동화 과제 (옵션)
- ~~Selenium Edge ����ũ �׽�Ʈ ����/���� (�ʿ� �� ����)~~ (2025-09-29 Codex, docs/testing/Selenium_Edge_TestPlan.md)
- ~~Docker Compose ��� ȯ���� �ʿ����� ��� �ｺüũ �� override ���ø� Ȯ��~~ (2025-09-29 Codex, docs/ops/DockerCompose_Override_Assessment.md)


