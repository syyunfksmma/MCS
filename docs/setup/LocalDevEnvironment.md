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
