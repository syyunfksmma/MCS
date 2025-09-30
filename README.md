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
# MCS: (Manufacturing Cam Managerment System)

## 프로젝트 개요

~~MCS(Manufacturing Cam Managerment System)는 제조 기업의 제품 데이터·공정(Routing) 관리, 협업 자동화, 품질·변경 이력 추적, SolidWorks/Esprit 등 CAD/CAM 연동을 지원하는 통합 플랫폼입니다.~~
~~PLM(Product Lifecycle Management) 및 PDM(Product Data Management) 핵심 기능을 웹 기반으로 제공하며, 대시보드, 상세 탐색, 승인/반려 워크플로우, API/권한 관리 등 현업 요구에 맞춘 확장성을 갖추고 있습니다.~~

사내망 전용 CAM 작업 웹서비스를 구축하기 위한 전사 계획에 따라, MCS 프로젝트는 **ASP.NET Core 8 + SignalR + SQL Server + React 19(Vite)** 아키텍처를 중심으로 재편되었습니다. 모든 구성요소는 사내망에서만 운용되며, 외부 클라우드·AI·3rd party SaaS 의존을 전면 배제합니다. PoC 단계에서는 단일 개발자 로컬 환경(localhost)에서 핵심 기능을 완성하고, 이후 Windows Server 기반 중앙 집중형 서비스 배포 및 필요 시 MSI 설치형 보조 채널로 확장합니다.

---

## 주요 기능

### 1. 핵심 CAM 작업 기능
- CAD/CAM 가공 데이터를 위한 Save & Load, 파일 트리 실시간 갱신, 다중 사용자 Presence 제공

- 좌측 ERP View Table을 통해 작업할당 대기 품목(Item_CD/착수상태/Res_CD 등)을 즉시 확인하고 드롭다운 정렬로 우선순위를 조정

- SignalR Hub를 활용하여 동시 편집 충돌을 줄이고, rowversion 기반 동시성 제어 적용
- ASP.NET Core 8 API 및 EF Core를 사용한 SQL Server 스키마 설계로 CAM 데이터 일관성 확보

### 2. 단계별 구축 전략
- 단계 1: 로컬 PoC — Visual Studio 2022, Node LTS, 사내 NPM/NuGet 미러 환경에서 백엔드, 프론트엔드, 실시간 기능을 완성하고 AD 통합 인증을 점검
- 단계 2: 내부망 서버 배포 — IIS + Kestrel 조합으로 중앙 집중형 서비스를 제공하고 내부 CA TLS를 적용
- 단계 3: 설치형(MSI/EXE) 보조 채널 — WiX Toolset 기반 MSI로 망분리 현장 대응, 자동 업데이트 또는 재배포 절차 문서화
- 단계 4: 유지보수/고도화 — Serilog + Windows Event Log 모니터링, 사내 Git 기반 CI/CD, 성능 데이터 수집 후 최적화

### 3. 보안 및 인증 정책
- Windows 통합 인증(AD/Kerberos) 기반 접근 제어와 내부 CA TLS 인증서로 외부 의존 제거
- 방화벽 최소 포트 오픈, 중앙 집중형 감사 로그 및 권한 정책 적용

### 4. 테스트 및 품질 보증
- 단위 테스트: API/SignalR/Repository 100% 커버리지 목표
- 통합 테스트: 저장-갱신-동시 편집 시나리오 자동화
- 부하 테스트: k6 기반으로 동시 사용자 100명 시 P95 < 150ms 검증
- 보안 테스트: 인증/권한 우회, SQL Injection, XSS, CSRF 등 사내 보안 기준 준수
- 사용성 테스트: 코딩 비전문 인원의 PoC 피드백을 반영해 UI/UX 개선

---

## 개발/운영 참고
- ASP.NET Core 8 + React 19(Vite) + Tailwind CSS v4 + shadcn/ui + Framer Motion 스택
- SQL Server Express/Enterprise를 통한 로컬-운영 일관 스키마 유지, rowversion 동시성 적용
- Serilog Rolling File + Windows Event Log 기반 장애 추적, 내부망 자원만 사용
- PoC~운영 단계 전환 시 각 단계별 승인 절차 및 재점검 필수

---

## 문서 및 추가 정보

- [CAM_WebService_ImplementationPlan](docs/CAM_WebService_ImplementationPlan.md): 사내망 전용 CAM 작업 웹서비스 제안 및 구현 계획 상세
- [Tasks_MCS](docs/Tasks_MCS.md): 단계별 Task List 및 절대 지령 업데이트
- [Phase10_DeploymentOps](docs/Phase10_DeploymentOps.md): 중앙 집중형/설치형 배포 전략 및 운영 절차 갱신

