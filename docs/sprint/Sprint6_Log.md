# Sprint 6 Activity Log — Deployment & Operations

> 모든 작업 과정과 로그를 기록한다. 배포/롤백/모니터링 결과를 상세히 남긴다.

- 2025-09-26 Codex: Added script_bug flag to meta SLA export; 0 ms baseline tagged as script bug.

- 2025-09-26 Codex: Apply automation now emits Esprit ready event after Setup injection (Global\MCS.Esprit.Ready signalled).






- 2025-09-26 Codex: Verified VS2022 Pro installation and msbuild 17.14 build success for TEST/CAM_API.csproj.
- 2025-09-26 Codex: Resolved FileStorageService cache guard fixes; dotnet build src/MCMS.Api/MCMS.Api.csproj passed without warnings.
- 2025-09-26 Codex: Signal-McsEvent.ps1 auto-created Global\MCS.Apply.Completed and signalled/reset events for Apply/Ready.
- 2025-09-26 Codex: Signal-McsEvent.ps1 negative test confirmed missing Global\MCS.License.Blocked requires AutoCreate (error logged).




- 2025-09-26 Codex: GitHub push/Actions merge deferred; sandbox lacks credentials to authenticate origin v1.
- 2025-09-26 Codex: Esprit COM automation retest pending; lab environment required for Apply→Ready/License scenarios.
- 2025-09-26 Codex: CAM_API g.cs regeneration & Worker regression plan updates deferred; awaiting VS2022 host with access to CAM_API pipeline.
- 2025-09-26 Codex: Updated deployment/auth docs for internal Windows server install model and struck out GitHub Actions tasks.
