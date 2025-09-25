
## 절대 지령
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력"에 기록한다.
- Sprint6 Routing 작업의 모든 측정치와 로그를 표 형태로 누적한다.
- 관측된 SLA나 오류는 Sprint5.1 로그와 상호 참조한다.

| Date       | Owner | Track | Description | Target SLA (ms) | Observed (ms) | Notes | Artifacts |
|------------|-------|-------|-------------|-----------------|---------------|-------|-----------|
| 2025-09-24 | Codex | H2    | ExplorerShell ↔ RoutingCreationWizard 연동, 생성 성공/실패 메시지 및 실행 로그 캡처 | 1200 | 1185 | Creation wizard modal wired to ExplorerShell; success toast logs persisted to Sprint6 logbook. | docs/sprint/Sprint6_Log.md#L12 |
| 2025-09-24 | Codex | H2    | RoutingDetailModal skeleton 구성, 실 SLA 추적용 telemetry stub 작성 | 900 | 946 | Modal tabs render history/upload placeholders; telemetry stub wrote to Sprint6 planning notes. | docs/design/Phase2_UIWireframe.md#L80 |
| 2025-09-25 | Codex | H3    | ExplorerShell 검색 UI(useRoutingSearch) 연결 및 SLA 로그 연동 | 3500 | 857 | 서버 345 ms, 클라이언트 857 ms (Sprint5.1 로그와 연계) | web/mcs-portal/src/components/explorer/ExplorerShell.tsx |
| 2025-09-25 | Codex | Ops | GitHub Actions npm cache 경로 수정 (cache-dependency-path 적용) | N/A | N/A | Lockfile 경고 제거 예정 | .github/workflows/ci.yml |
| 2025-09-25 | Codex | F2    | k6 청크 크기 A/B (256/512/1024KiB) 측정 | 3500 | 3729 | 256KiB 최저 p95 3.73s, 대형 청크는 4.5~5.9s (Phase6 문서 9장 참고) | tests/k6/chunk_upload.js |
| 2025-09-25 | Codex | E1    | 필터 레일·리본·Hover UX 확장안 문서화 | N/A | N/A | docs/design/Sprint6_Explorer_UX_Plan.md 작성, Teamcenter Alignment | docs/design/Sprint6_Explorer_UX_Plan.md |
| 2025-09-25 | Codex | Ops | GitHub Actions 워크플로 재실행 시도 (권한 미부여) | N/A | N/A | GitHub API 404(사설 저장소) 및 로컬 PAT 미존재로 재실행 불가, 재시도 계획: PAT 발급 후 gh run rerun 명령 사용. | N/A |
| 2025-09-25 | Codex | F1 | Streaming SHA-256 & 병렬 병합 PoC 구현 (FE/BE) | 3500 | N/A | 프런트 스트리밍 해시·병렬 업로드, 서버 MergeChunksAsync 병렬 버킷화 적용. Docker Desktop 미기동으로 k6 재측정 실패(재시도 시 Docker 시작 필요). | web/mcs-portal/src/lib/uploads/uploadRoutingFileChunks.ts |
| 2025-09-25 | Codex | F1 | FileStorageService 동시 접근 허용(FileShare.ReadWrite, 재시도) | 3500 | N/A | meta.json 잠금으로 500 발생 → 파일 공유/재시도 로직 적용 | src/MCMS.Infrastructure/FileStorage/FileStorageService.cs |
| 2025-09-25 | Codex | F1 | Meta write async 큐 SLA 계측 및 k6 스크립트 업데이트 | 1000 | N/A | meta_generation_wait_ms 추가, 테스트 환경 미기동으로 측정 대기 (k6 log capture 예정) | tests/k6/chunk_upload.js; scripts/performance/k6-workspace.js |

## 수정 이력\r\n- 2025-09-25 Codex: k6 SLA 계측 행 추가 및 k6 스크립트 업데이트 계획 기록.\r\n- 2025-09-25 Codex: 절대 지령 추가 및 Sprint6 로그 항목 정리.


=======
# Sprint 6 Routing Logbook (Workspace & Workflow)

## 절대 지령
- 본 문서는 1인 개발팀 운영 원칙을 따르며, 모든 실행 주체는 Codex이다.
- 모든 코드와 API 작성은 Codex가 수행하며, 자동화 작업 역시 Codex가 직접 검토한다.
- 작업 전후 활동은 영어 로그와 주석으로 남겨 추적성을 확보한다.
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별하고 이상 없을시에만 해당 task를 [x] 표시한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 신규 생성된 작업에서도 절대 지령을 동일하게 준수한다.
- 오류 개선을 위해 신규 TASK가 발생하면 TASK LIST를 새로 작성하거나 기존 LIST에 업데이트 한다.
- PoC 기준은 1인 기업 관점으로 계획한다.

> 영어로 상세 로그 작성. 각 Task ID 별 최소 하루 1회 갱신.

## Log Template
| Date (UTC) | Owner | Task ID | Summary (English) | Code Comments Added | Evidence Links |
| --- | --- | --- | --- | --- | --- |

## Sections
- **G1** Group drag-and-drop
- **G2** Inline edits & soft delete
- **H1** Routing creation wizard
- **H2** Routing detail modal
- **I1** File uploader
- **I2** Download bundle & checksum
- **I3** Version table
- **J1** SolidWorks UI
- **J2** Explorer protocol integration

> Example: `| 2025-10-15 | Codex | I1 | Implemented chunk retry with exponential backoff | // Document chunk size rationale in FileUploader.ts | PR #210, retry diagram |`




| 2025-09-23 | Codex | G1 | Added routing group hierarchy plus optimistic drag/drop reorder with rollback + mock persistence | ExplorerShell.tsx handleReorder comment documents optimistic rollback contract | web/mcs-portal/src/types/explorer.ts; web/mcs-portal/src/lib/explorer.ts; web/mcs-portal/src/components/TreePanel.tsx; web/mcs-portal/src/components/explorer/ExplorerShell.tsx; web/mcs-portal/src/lib/routingGroups.ts |
| 2025-09-24 | Codex | G2 | Implemented routing group inline rename + soft delete with optimistic UI and state rollback | ExplorerShell.tsx mutateGroup helper documents Flow G2 soft delete flags | web/mcs-portal/src/components/TreePanel.tsx; web/mcs-portal/src/components/explorer/ExplorerShell.tsx; web/mcs-portal/src/lib/explorer.ts |
| 2025-09-24 | Codex | H1 | Wired routing creation wizard modal into ExplorerShell with success/error messaging and shared-drive path stub | ExplorerShell.tsx handleRoutingCreateSubmit 주석 + message telemetry note | web/mcs-portal/src/components/explorer/ExplorerShell.tsx; web/mcs-portal/src/components/explorer/RoutingCreationWizard.tsx |
| 2025-09-24 | Codex | H2 | Added routing detail modal skeleton with stub telemetry hooks and placeholder panes for Flow I handoff | RoutingDetailModal.tsx header comment documents modal contract | web/mcs-portal/src/components/explorer/RoutingDetailModal.tsx; web/mcs-portal/src/components/explorer/ExplorerShell.tsx |
| 2025-09-24 | Codex | I1 | Captured baseline routing detail fetch SLA at 842 ms before Flow I uploader wiring | ExplorerShell.tsx telemetry note + RoutingDetailModal Flow H2 stub | web/mcs-portal/src/components/explorer/ExplorerShell.tsx; web/mcs-portal/src/components/explorer/RoutingDetailModal.tsx; web/mcs-portal/src/hooks/useRoutingDetail.ts |



