# Routing Support FAQ & Escalation Procedure

<!-- Support Ticket Template Reference: docs/ops/InternalManualDeployment.md Appendix B -->

## Categories
- **Access & Permissions** — Login issues, missing routing modules, role assignments.
- **File Storage** — Upload failures, checksum mismatches, shared-drive path errors.
- **Workflow & Approvals** — Task assignment, stuck approvals, notification gaps.
- **Performance** — Slow loading hierarchy, timeouts during bulk actions.

## Frequently Asked Questions
1. **Q:** Users receive “Access Denied” when opening Routing.
   **A:** Confirm the user is part of the `MCMS_Routing_Editors` AD group. If recently added, wait for the hourly sync or trigger `tools\Sync-WorkspaceAcl.ps1`.
2. **Q:** Uploads fail at 95% with checksum errors.
   **A:** Verify the shared-drive path in `appsettings.json`. Ensure antivirus exclusions include the `Routing` root. Retry after clearing the local upload cache (`%LOCALAPPDATA%\MCMS\Cache`).
3. **Q:** Approvers do not see pending items.
   **A:** Check the approval queue depth in the health panel. If above 150, scale out worker queue via `ScalingPolicy.json` and notify Ops to monitor lag.
4. **Q:** Searches return stale results.
   **A:** Confirm meta JSON writes are processing. Review `Meta Cache Status` tiles; if stale, recycle the routing worker service and monitor logs.

## Escalation Procedure
1. Create a ticket using the support template (`SupportTicket_Template.docx`). Include routing ID, timestamp, and affected user.
2. Tag severity:
   - **Sev1** — Production outage or data corruption. Call the on-call engineer immediately.
   - **Sev2** — Major functionality degraded, workaround available.
   - **Sev3** — Minor issue or documentation request.
3. Post ticket link in Slack `#mcms-support` channel and update status during triage.
4. Upon resolution, document root cause and mitigation in the ticket and log summary in Sprint 11 logbook (section Y2).

## SLA Targets
- First response: 15 minutes (business hours), 60 minutes (after hours).
- Time to resolve: 4 hours for Sev1, 12 hours for Sev2, 3 business days for Sev3.

Maintain the FAQ quarterly; archive outdated entries and link to new playbooks as features evolve.
