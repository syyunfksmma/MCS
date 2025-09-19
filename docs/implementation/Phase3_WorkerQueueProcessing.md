# Implementation Phase 3 - Worker Queue Processing & Add-in Result Handling (2025-09-19)

## Source Requirements
- `docs/design/Phase1_RequirementsReview.md:26` assigns MCMS.Workers to push execution messages to the ESPRIT add-in after routing approval, so the same component must react when the add-in responds.
- `docs/design/Phase3_AddinIntegration.md:24`-`docs/design/Phase3_AddinIntegration.md:26` describe the queue -> add-in -> `/complete` callback flow that returns the job result to MCMS.
- `docs/design/Phase3_AddinIntegration.md:50` requires that an add-in failure triggers History logging and a UI alert.
- `docs/PRD_MCS.md:52`-`docs/PRD_MCS.md:57` stress that the add-in integration and monitoring outcomes are first-class deliverables, so routing state and telemetry must be updated on every result.

## Gaps Observed
- `src/MCMS.Workers/Worker.cs:11` currently processes only `EspritGenerationCommand` and ignores add-in completion events.
- The `/api/addin/jobs/{jobId}/complete` path updates the `AddinJob` row, but no command is published to let the worker update routing/History. The unused `AddinJobResultCommand` record (`src/MCMS.CmdContracts/Commands/AddinJobResultCommand.cs:3`) highlights the missing hand-off.
- History entries and UI notifications are not produced on success or failure, so the requirement in `docs/design/Phase3_AddinIntegration.md:50` is not satisfied.

## Implementation Tasks
1. **Publish add-in result commands**
   - Inject `ICommandQueue` into the add-in completion path (service or controller) and enqueue `AddinJobResultCommand(jobId, routingId, resultStatus, message)` whenever `/complete` is called (ensure idempotency for repeated callbacks).
2. **Extend worker processing loop**
   - Update `src/MCMS.Workers/Worker.cs` to listen for both `EspritGenerationCommand` and `AddinJobResultCommand` (pattern-match inside the dequeue loop or run two loops).
   - On `resultStatus=completed`: record a `HistoryEntry` such as `AddinJobCompleted`, refresh routing timestamps, and optionally bump `CamRevision` if the add-in produced new outputs.
   - On `resultStatus=failed`: capture the failure message, flag the routing (new `RoutingStatus.GenerationFailed` or a `LastGenerationStatus` field), and push a notification event for the UI.
3. **Model updates for status tracking**
   - Add storage for the latest add-in job metadata (`Routing.LastAddinJobId`, `Routing.LastGenerationStatus`, timestamps) and extend enums if needed (`AddinJobStatus`, `RoutingStatus`).
   - Allow `HistoryEntry.Outcome` or a new field to represent generation failure without misusing approval outcomes.
4. **Notification integration**
   - Provide a `INotificationSink` (SignalR/event bus stub) so the worker can surface success/failure alerts to the web client, satisfying the UI alert requirement.
5. **Testing**
   - Unit-test the service to assert that `/complete` enqueues the result command and that `AddinJobResultCommand` processing updates `Routing` + `History` correctly.
   - Add integration tests covering success/failure flows to prevent regressions.

## Open Considerations
- Align retry/back-off strategy with the queue policy (`docs/design/Phase3_AddinIntegration.md:49`).
- Decide whether a failed job should revert the routing to `PendingApproval` or maintain `Approved` with an error badge; document the choice for UI consistency.
- Ensure W:\ file validation is idempotent when reprocessing failed jobs.
