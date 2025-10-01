# RequiresResync Alert Verification (2025-10-01)

## Objective
- Validate that a forced mismatch between `meta.json` and the CAS payload drives `RoutingMetaDto.requiresResync = true` and emits a `RoutingStorage` warning from `OperationsAlertService`.

## Preparation
- Enable the feature flag by setting `FileStorage:EnableObjectStorageReplica=true` in the production configuration (appsettings or environment). Confirm `FileStorage:ObjectStorageReplicaPath` targets an internal SMB share that the service account can write to.
- Pick a routing that already has at least one CAS artifact present and note its identifier.
- Open `docs/observability/LogPipeline.md` to confirm where Loki and downstream alerting (Grafana Log Explorer, Slack, Teams) ingest the `RoutingStorage` category.

## Execution Checklist
1. **Create the mismatch**  
   - Navigate to the replica directory for the selected routing and intentionally delete one CAS payload (keep a copy for restoration).  
   - Within 30 seconds request `GET /api/routings/{id}/files`; expect `requiresResync=true` and a `missingFiles` array listing the removed object.
2. **Validate alert propagation**  
   - Query Loki (for example `{app="MCMS.Api"} | json | RoutingStorage`) and capture the warning emitted by `OperationsAlertService`.  
   - Confirm that the same message reaches Grafana Log Explorer or the integrated Slack/Teams channel as described in `docs/observability/LogPipeline.md`.
3. **UI/API regression check**  
   - In Explorer (or browser Network tab) reload the routing detail view and confirm the requires-resync badge or warning appears while the API response shows `requiresResync: true`.
4. **Normalize**  
   - Restore the deleted CAS payload (or re-upload through the API).  
   - Re-run `GET /api/routings/{id}/files` and verify the flag flips back to `false` and `missingFiles` is empty.  
   - Ensure a follow-up info log is ingested noting the resync state cleared.

## Evidence to Capture
- Loki query screenshot or log export demonstrating the `RoutingStorage` warning.
- Notification evidence (Grafana panel, Slack/Teams message, or equivalent) confirming downstream delivery.
- API response (before/after) showing `requiresResync` toggling true -> false.

## Troubleshooting Notes
- If the alert does not appear, verify the replica path permissions and that `EnableObjectStorageReplica` is still true (check `FileStorageOptions` via `/actuator/config` or equivalent diagnostics endpoint).  
- Inspect `Logging:LogLevel` settings to ensure `RoutingStorage` warnings are not suppressed.  
- Review the `OperationsAlertService` binding to make sure the category is routed into the log pipeline integrations listed in `docs/observability/LogPipeline.md`.
