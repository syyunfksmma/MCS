# Installer Rollback Test Plan — 2025-09-29

## Goals
Validate MSI rollback restores previous MCMS build and restarts services.

## Test Cases
1. **Service Start Failure** — Simulate by denying `MCMS\svc-mcms` logon right. Expect MSI rollback to restore previous binaries.
2. **File Copy Failure** — Lock `C:\MCMS\api\MCMS.Api.dll`; verify rollback cleans temporary folder.
3. **IIS Binding Failure** — Pre-create conflicting binding; ensure rollback removes partially created site.

## Scripts
- `scripts/installers/Invoke-RollbackTest.ps1` orchestrates scenarios and captures logs to `artifacts/installers/rollback/`.

> 작성: 2025-09-29 Codex
