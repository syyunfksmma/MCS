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

### Worker Storage Flow with Deduplication & Integrity Controls
- **큐 메시지 확장**
  - `FileIngestCommand`에 `casHash`, `chunks`, `resumeToken`, `logicalPath` 필드를 추가하여 Phase 5 CAS 레이아웃과 연동.
  - 메시지 내 `chunks` 배열은 각 청크의 순서, 사이즈, ETag/해시를 포함해 재시작 시 어떤 파트가 누락되었는지 명확히 구분.
- **스테이징 → CAS 커밋**
  1. 워커가 스테이징 경로에서 파일을 열고 청크별 SHA256을 재계산하여 메시지의 해시와 비교.
  2. 모든 청크 검증 후 `cas/<algo>/<prefix>/<hash>/payload`에 이동 또는 Object Storage로 업로드.
  3. `refs/<routing>/<rev>/<logicalName>.json`을 생성/갱신하여 새 버전을 참조하고, `meta.json`에 CAS 참조와 체크섬을 기록.
- **무결성 검증 단계**
  - CAS 업로드 후 Object Storage의 ETag 혹은 `ChecksumCRC32C`를 조회하여 로컬 계산값과 비교.
  - `meta.json` 커밋 직전 `IntegrityAudit` 레코드에 해시, 청크 수, 업로더, 업로드 세션 ID를 남겨 추적성을 확보.
  - 불일치 발생 시 워커는 `RoutingFileStatus=Invalid`로 표시하고 재시도 큐(`storage-retry`)에 재등록, 운영자 알림을 트리거.
- **롤백 및 재시작 처리**
  - 커밋 실패 시 워커는 임시 참조(`refs.pending`)를 삭제하고, 이미 작성된 CAS 페이로드는 참조 카운트를 감소시키거나 고아 수집(garbage collection) 큐에 추가.
  - `resumeToken`을 사용하여 중단된 업로드를 이어받고, 누락 청크만 `missingParts` 큐로 전송.
  - 재시도 횟수(`retryCount`)가 임계치를 넘으면 `HistoryEntry`에 `StorageCommitFailed` 이벤트를 기록하고, 사용자에게 파일 재업로드를 요청하는 알림을 발송.

## Open Considerations
- Align retry/back-off strategy with the queue policy (`docs/design/Phase3_AddinIntegration.md:49`).
- Decide whether a failed job should revert the routing to `PendingApproval` or maintain `Approved` with an error badge; document the choice for UI consistency.
- Ensure W:\ file validation is idempotent when reprocessing failed jobs.

