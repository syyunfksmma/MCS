# WiX Packaging Plan — 2025-09-29

## Objectives
- Produce MSI installer bundling Kestrel service, IIS configuration scripts, and static assets.

## Components
| Feature | Source | Destination |
| --- | --- | --- |
| API Service | `src/MCMS.Api/bin/Release/net8.0/win-x64/publish` | `C:\MCMS\api` |
| Portal Build | `web/mcs-portal/dist` | `C:\MCMS\web` |
| Scripts | `scripts/deploy/*.ps1` | `C:\MCMS\scripts` |

## WiX Steps
1. Install WiX Toolset v4 (`winget install WiXToolset.WiXToolset`) and add VS extension.
2. Create bundle project `installers/McmsInstaller.wixproj` referencing `MCMS.Api.wixlib` and `PortalAssets.wixlib`.
3. Define custom actions for service install (`sc create`) and IIS site creation.
4. Add prerequisite check: .NET 8 runtime, SQL Native Client.

## Output
- MSI generated to `artifacts/installers/MCMS_Setup_2025.09.29.msi`.

> 작성: 2025-09-29 Codex
