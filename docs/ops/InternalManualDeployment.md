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
# Internal Manual Deployment Playbook

## 0. Scope & Roles
- **Target environment**: Internal Windows Server 2022 host running IIS + Kestrel reverse proxy with Windows Integrated Authentication enabled.
- **Service components**: `MCMS.Api` (ASP.NET Core), `MCMS.Worker` background service, React/Vite static assets, and shared-drive file storage at `\\fileserver01\MCMS_Routing`.
- **Actors**: Codex (build + deployment owner), MCMS Ops reviewer, IT security approver for TLS/AD updates.

> Follow the absolute directives from `docs/Tasks_MCS.md`; all actions below assume approval for the sprint gate has been granted.

## 1. Pre-deployment Checklist
1. Confirm Jira/ADO stories for the release are in **Ready for Deploy** and code freeze is in effect.
2. Pull the latest `work` branch and tag the release candidate (e.g., `git tag rc-2025.12.29`).
3. Validate dependencies:
   - Service account `svc_mcms_router` password not expiring in the next 7 days.
   - SQL Server connection string still resolves to the production availability group.
   - Internal CA-issued certificate `CN=mcms-routing.internal` not expiring within 30 days (renew if necessary).
4. Verify Windows Integrated Authentication by running `Test-KerberosAuthentication.ps1` (see `tools/` folder) against the staging server.
5. Review change impact: ensure rollback package from previous deployment is archived at `\\fileserver01\MCMS_Routing\releases\<prev_version>_backup`.

## 2. Build & Package Artifacts
1. **Restore & compile**
   ```powershell
   git pull
   nuget restore CAM API.sln
   msbuild "CAM API.sln" /p:Configuration=Release /p:Platform="Any CPU"
   ```
2. **Publish web assets**
   ```powershell
   pushd web
   npm ci
   npm run build
   popd
   ```
   Copy the Vite build output (`web/dist`) into `src/MCMS.Web/wwwroot`.
3. **Publish API & worker**
   ```powershell
   dotnet publish src/MCMS.Api/MCMS.Api.csproj -c Release -o publish\api
   dotnet publish src/MCMS.Worker/MCMS.Worker.csproj -c Release -o publish\worker
   ```
4. Collect artifacts into `artifacts\MCMS-<version>` with subfolders `api`, `worker`, `ui`, `tools` (scripts, PowerShell utilities), and `config` (template `appsettings.Production.json`).
5. Generate release notes `artifacts\MCMS-<version>\ReleaseNotes.md` summarising commits, known issues, and verification status.

## 3. Staging Verification
1. Deploy the package to the staging server using the same steps outlined in §5.
2. Execute smoke tests:
   - Run `tools\Signal-McsEvent.ps1 -Event ApplyReadyLoop` to validate Apply→Ready event handling.
   - Trigger routing JSON write and confirm meta-cache update in `Event Viewer ▸ Applications`.
   - Perform user flow smoke: login (Integrated Auth), product list load, routing detail open, file upload/download.
3. Run automated checks:
   - `k6 run k6/scripts/routing_list_compiled.js` targeting staging URL.
   - `scripts/tests/Worker-QueueBench.ps1 -Environment Staging`.
4. Capture results in `docs/testing/BenchmarkResults/<version>-stg.md` with pass/fail notes.
5. Obtain sign-off from MCMS Ops reviewer before proceeding to production.

## 4. Package Handoff & Approvals
- Zip the `artifacts\MCMS-<version>` folder and upload to `\\fileserver01\MCMS_Routing\handoff\MCMS-<version>.zip`.
- Share release notes and staging verification summary with IT security for final approval (includes TLS/AD validation results).
- Once approval is logged, schedule the production deployment window and notify stakeholders (Slack `#mcms-ops`, email distribution list).

## 5. Production Deployment Steps
1. **Prepare server**
   - Log on to the production host with administrative rights.
   - Pause scheduled maintenance tasks impacting MCMS (e.g., backup jobs, antivirus scans).
   - Ensure no active user sessions in the routing UI (send broadcast message if required).
2. **Backup existing install**
   - Stop IIS site `MCMS-Portal` and Windows service `MCMS.Worker`.
   - Copy `C:\MCMS\api`, `C:\MCMS\worker`, and `C:\MCMS\ui` to `C:\MCMS\backups\<timestamp>`.
   - Export current `appsettings.Production.json` and any secrets to the backup folder.
3. **Deploy new bits**
   - Extract `MCMS-<version>.zip` to `C:\MCMS\temp\MCMS-<version>`.
   - Replace `C:\MCMS\api` and `C:\MCMS\worker` contents with the new publish output.
   - Copy UI assets to `C:\MCMS\ui` (ensure cache-busting hash directories are preserved).
   - Merge configuration changes: update connection strings, feature flags, and TLS certificate thumbprints in `appsettings.Production.json`. Use three-way diff to avoid overwriting environment secrets.
4. **Configuration validation**
   - Run `tools\Validate-AppSettings.ps1 -Path C:\MCMS\api\appsettings.Production.json`.
   - Confirm NTFS permissions: `svc_mcms_router` has Modify on `C:\MCMS` and read access to `C:\MCMS\config`.
5. **Start services**
   - Start IIS site and ensure the Application Pool uses the service account.
   - Start `MCMS.Worker` Windows service and observe `Event Viewer` for successful startup logs.
6. **Database migrations (if required)**
   - Execute `dotnet MCMS.Api.dll --apply-migrations` (or run `tools\Apply-MCMSMigration.ps1`).
   - Verify migration results in SQL Server `__EFMigrationsHistory` table.

## 6. Post-deployment Validation
1. Run smoke script `tools\PostDeploy-Smoke.ps1 -Environment Prod`.
2. Validate routing explorer manually: load dashboard, open revision, trigger Apply→Ready event.
3. Confirm shared-drive connectivity by uploading a test routing file and checking `\\fileserver01\MCMS_Routing\<BU>`.
4. Review telemetry dashboards (Application Insights, SQL Query Store) for anomalies within the first 30 minutes.
5. Announce success in Slack and update ticket status to **Deployed**.

## 7. Rollback Procedure
1. If critical failures occur, stop IIS site and worker service immediately.
2. Restore backup from `C:\MCMS\backups\<timestamp>` to the live directories.
3. Reapply previous configuration files and restart services.
4. Document the incident, capture logs (`C:\MCMS\logs`) and escalate per escalation matrix.

## 8. Documentation & Audit Trail
- Update `docs/sprint/<Sprint>_Routing_Log.md` with deployment timestamp, version, smoke results, and reviewers.
- Attach release notes and validation artifacts to the sprint log entry.
- Archive deployment evidence (screenshots, command output) in `\\fileserver01\MCMS_Routing\handoff\evidence\<version>`.
- Schedule post-mortem review if any deviations or manual fixes were required during deployment.

## 9. Appendices
- **Reference scripts**: `tools\Signal-McsEvent.ps1`, `tools\Validate-AppSettings.ps1`, `scripts\tests\Worker-QueueBench.ps1`.
- **Related docs**: `docs/ops/Routing_AdminHandbook.md`, `docs/ops/Routing_SharedDrive_Decisions.md`, `docs/Phase11_Documentation.md`.

