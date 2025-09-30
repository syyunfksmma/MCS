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
# ExplorerShell Routing API Integration Plan

## Overview
- Goal: Replace the local-only ExplorerShell state with backend-backed mutations for Flow G/H tasks (group ordering, inline edit/soft delete, routing creation wizard).
- Backend target: `MCMS.API` with new endpoints under `/api/explorer`.

## Proposed Endpoints
| Endpoint | Verb | Payload | Notes |
|----------|------|---------|-------|
| `/api/explorer/groups/reorder` | PATCH | `{ groupId, dropSiblingId, position }` | Persists display order, returns refreshed Explorer payload. |
| `/api/explorer/groups/{id}` | PATCH | `{ name?, isDeleted? }` | Inline rename/soft delete toggle; audit logged. |
| `/api/explorer/groups/{id}/routings` | POST | `{ code, owner, status, sharedDriveReady, notes }` | Creates routing and returns Explorer fragment. |

### Contracts
- Response: `ExplorerResponse` maintains existing shape so frontend diff is minimal.
- Errors: 409 for conflicting display order, 422 for invalid routing code.
- Telemetry: Application Insights event `ExplorerMutation` with keys `mutation`, `latencyMs`, `queueWaitMs`.

## Sequence Flow (Routing Creation)
1. UI opens wizard (current UX).
2. On submit call `POST /api/explorer/groups/{id}/routings`.
3. API validates shared-drive readiness (`IRoutingService.EnsureSharedDrive`).
4. API returns new routing; frontend merges via `setItemsState` until server payload update is integrated.
5. When chunk upload completes, `meta_sla_history.csv` update triggered by existing scripts.

## Storage Considerations
- Add `RoutingGroups.DisplayOrder` column + index if missing.
- Introduce optimistic concurrency token (rowversion) to prevent lost updates.
- Inline rename/soft delete reuses `UpdatedBy`/`UpdatedAt` columns for audit.

## Telemetry & Alerts
- Use `FileStorageEventSource` counters for mutation-induced meta writes.
- Add custom metric `ExplorerMutation.latency_ms` capturing end-to-end API time.

## Implementation Checklist
1. Add DTOs + validators (`ExplorerReorderRequest`, `ExplorerRoutingCreateRequest`).
2. Extend `IRoutingService` with `CreateRoutingAsync` hooking shared-drive validation.
3. Update `ExplorerController` to expose new endpoints and maintain backward compatibility for GET.
4. Update `ExplorerShell` frontend to call APIs and reconcile state via server payload (remove temporary local clones post-rollout).
5. Extend Playwright plan (see `docs/testing/Sprint6_FlowG_H_Regressions.md`).
6. Document contract in `docs/api/openapi_mcs.yaml` (new operations).

## Rollout Strategy
- Phase 1: Deploy API endpoints behind feature flag `feature.explorer.mutations`.
- Phase 2: Frontend toggled to server-backed path in staging.
- Phase 3: Enable flag in production, monitor counters via new monitoring pipeline.
- Rollback: Toggle allows frontend to stay in local-only mode.

## Dependencies
- Shared-drive callback service for validation.
- Updated meta SLA dashboard (see FileStorage Event Monitoring Playbook).
- Esprit automation workflow delivering consistent Setup values post-routing creation.

