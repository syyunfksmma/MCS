# Routing Admin Handbook

<!-- Inline Tip Context: Shared-drive configuration relies on docs/ops/SharedDrive_Structure.md -->

## 1. Shared-drive Configuration
1. Coordinate with IT to provision the network share `\\fileserver01\MCMS_Routing` with 500 GB quota.
2. Create subfolders per business unit (`Aero`, `Auto`, `Energy`) and apply security groups accordingly.
3. Map the share on MCMS hosts using the Windows service account `svc_mcms_router` with `Read/Write` access.
4. Update `appsettings.json ▸ FileStorage:RootPath` to point to the mounted drive letter (default `R:`).
5. Execute `tools\Signal-McsEvent.ps1 -Event SharedDriveMounted` to validate event propagation.

> **Inline Tip:** Add a scheduled task that re-establishes the drive mapping hourly to handle transient VPN drops.

## 2. Health Panel Operations
- Access the health panel from **Admin ▸ Diagnostics ▸ Routing**.
- Review the **Queue Depth** tile; values above 150 trigger a warning banner.
- Click **Meta Cache Status** to view the last five JSON writes per routing. Use the `Refresh` button after maintenance windows.
- Export telemetry via the **Download CSV** button for weekly audits.

<!-- Inline Tip: Health panel thresholds align with Observability_DataFlow.md §2 -->

## 3. Maintenance Procedures
- Run `tools\Cleanup-OrphanFiles.ps1` weekly to purge orphaned attachments.
- Rotate the routing service account password every 90 days; store the secret in the password vault.
- After upgrades, execute smoke tests: open routing detail, trigger JSON write, verify log entries in `EventViewer ▸ Applications`.

## 4. Escalation Path
1. First response: Internal MCMS Ops (Slack `#mcms-ops`, <ops@mcms.example.com>).
2. Secondary: CAM Engineering duty officer (rotation documented in Confluence page `CAM/OnCall`).
3. Vendor escalation: Submit ticket to ESPRIT support referencing contract ID `ES-44721`.

Document reviewer sign-off in Sprint 11 log once the handbook is approved.
