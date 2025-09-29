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
# Local Development Environment Setup — 2025-09-29

## Toolchain
| Component | Version | Notes |
| --- | --- | --- |
| Visual Studio | 2022 17.11 (Enterprise/Professional) | Install workloads: ASP.NET and web development, .NET cross-platform. |
| .NET SDK | 8.0.401 | Ships with VS 17.11; verify `dotnet --list-sdks`. |
| Node.js | 20.11.x LTS | Managed via Volta/Corepack. |
| pnpm | 9.x (Corepack) | Enable with `corepack enable`. |
| SQL Server | Express 2022 | LocalDB fallback allowed for unit tests. |

## Installation Steps
1. Install Visual Studio 2022 with required workloads and `Git for Windows` integration.
2. Install Node.js 20.11 LTS (x64) and enable Corepack: `corepack enable`. pnpm auto-activates per project.
3. Confirm .NET SDK 8.0.401: `dotnet --info`. Add global.json if multiple SDKs present.
4. Install SQL Server Express (Default instance `MSSQLLOCALDB`). Enable Mixed Mode for compatibility tests.
5. Clone repository and run `pnpm install` (front-end) & `dotnet restore` (backend).
6. Configure environment files:
   - `web/mcs-portal/.env.local.example` → copy to `.env.local`.
   - `src/MCMS.Api/appsettings.Development.json` → confirm connection string `Server=(localdb)\MSSQLLocalDB`.
7. Verify lint/test locally: `pnpm lint`, `pnpm test:unit -- --run`, `dotnet test`.

## Verification Checklist
- [x] Visual Studio + workloads installed (logs stored in `artifacts/setup/vs_install_20250929.txt`).
- [x] Node 20.11 & pnpm 9.x detected (`pnpm --version`).
- [x] SQL Express instance reachable (`sqlcmd -Q "SELECT @@VERSION"`).
- [x] Repository dependency restore successful.

> 작성: 2025-09-29 Codex

