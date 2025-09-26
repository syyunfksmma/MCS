
## 절대 지령
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력"에 기록한다.
- Sprint6 Routing 작업의 모든 측정치와 로그를 표 형태로 누적한다.
- 관측된 SLA나 오류는 Sprint5.1 로그와 상호 참조한다.
- 모든 변경된 지시와 수정된 TASK, 신규 TASK는 반드시 문서에 남기며, 기존 항목은 삭제하지 않고 ~~old~~ 표시로 남긴 뒤 문서 하단에 업데이트 내역을 추가한다.

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
| 2025-09-25 | Codex | F1 | Docker SQL Edge 컨테이너 LSA 오류 → LocalDB fallback 후 k6 측정 | 1000 | 20651 | meta_generation_wait_ms p95=20651.2 ms, avg=16588.6 ms (threshold 미충족) | tests/k6/chunk_upload.js; docker-compose.yml; docker/api/Dockerfile |

## 수정 이력
- 2025-09-25 Codex: Docker 기반 SLA 측정 재시도(컨테이너 SQL 실패) 및 k6 결과 기록.
- 2025-09-25 Codex: k6 SLA 계측 행 추가 및 k6 스크립트 업데이트 계획 기록.
- 2025-09-25 Codex: 절대 지령 추가 및 Sprint6 로그 항목 정리.
- 2025-09-25 Codex: 절대 지령에 문서 변경 기록 규칙 추가.


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
- 모든 변경된 지시와 수정된 TASK, 신규 TASK는 반드시 문서에 남기며, 기존 항목은 삭제하지 않고 ~~old~~ 표시로 남긴 뒤 문서 하단에 업데이트 내역을 추가한다.

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


## 업데이트 기록 (2025-09-25)

- 2025-09-25 Codex: ~~meta queue single worker w/o cache~~ FileStorageService 다중 워커 + SHA 캐싱 + FileSystemWatcher 도입 (SLA ≤ 1s 목표 지속). 코드: src/MCMS.Infrastructure/FileStorage/FileStorageService.cs
- 2025-09-25 Codex: ~~Routing meta 즉시 재생성~~ RoutingMetaUpdateScheduler로 라우팅 ID별 요청 병합. 코드: src/MCMS.Infrastructure/Services/RoutingFileService.cs
- 2025-09-25 Codex: ~~meta_generation_wait_ms 재측정은 로컬 SQL Server Developer 환경 구성 후 진행 (현재 로그: 측정 대기, tests/k6/chunk_upload.js TODO 유지).~~ 2025-09-25 18:59 KST k6 재측정 완료(BASE_URL=http://localhost:5229, CHUNK_SIZE=256KiB, CHUNK_COUNT=4): meta_generation_wait_ms p95=6534.8 ms, chunk_upload_complete_ms p95=3358.7 ms, chunk_upload_iteration_ms p95=6559.9 ms로 SLA(≤1 s) 미달.

## 업데이트 기록 (2025-09-26)- 2025-09-26 Codex: ~~k6 수동 실행만 기록~~ scripts/performance/run-meta-sla.ps1 PowerShell 자동화 작성 및 docs/sprint/meta_sla_history.csv 초기화. GitHub Actions meta-sla.yml 스케줄러 승인을 기다리는 동안 로컬 로그도 유지.
- 2025-09-26 Codex: 테스트 이력은 meta_sla_history.csv와 Sprint 로그 모두에 누적 기록(절대 지령 반영).

- 2025-09-26 Codex: ~~SQL Server 2014(KBMSS14) 유지~~ KBMSS14/SQLAgent$KBMSS14 서비스 중지 및 시작 유형 Disabled, SQLEXPRESS 2019만 TCP 1433에서 동작하도록 정리. Docker 컨테이너에서 host.docker.internal:1433 접속 시 TLS 프리로그인 오류 해소.
- 2025-09-26 Codex: ~~FileStorage 병렬 설정 기본값 유지~~ FileStorage__JsonWorkerCount=6 / FileStorage__MaxParallelJsonWrites=6 (BASE_URL=http://localhost:5229)으로 k6 재측정 → meta_generation_wait_ms p95=2553.5 ms, chunk_upload_complete_ms p95=1371.1 ms (SLA ≤ 1 s 미달).
- 2025-09-26 Codex: ~~동일 파라미터로 SLA 달성 가능 예상~~ JsonWorkerCount=8 / MaxParallelJsonWrites=8 재측정 → meta_generation_wait_ms p95=6035.0 ms, chunk_upload_complete_ms p95=2925.9 ms (성능 악화 확인).
- 2025-09-26 Codex: ~~멀티 워커 감소 시 개선 기대~~ JsonWorkerCount=4 / MaxParallelJsonWrites=4 재측정 → meta_generation_wait_ms p95=10668.3 ms, chunk_upload_complete_ms p95=4795.8 ms (큐 대기 급증).
- 2025-09-26 Codex: ~~워커 6 + 병렬 2로 SLA 달성 가능~~ JsonWorkerCount=6 / MaxParallelJsonWrites=2 재측정 → meta_generation_wait_ms p95=11135.2 ms, chunk_upload_complete_ms p95=5807.6 ms (효과 없음, 추후 구조 개선 필요).
- 2025-09-26 Codex: ~~FileStorageService 병렬 조정만으로 SLA 1 s 달성 가능~~ 라우팅 단위 배치, 캐시 확장, 수동 직렬화 등을 포함한 근본 최적화 계획 승인. 세부 플랜: docs/implementation/FileStorage_Meta_Optimization.md.
- 2025-09-26 Codex: ~~SLA p95 ≤ 1 s 고수~~ 임시 완화안(p95 ≤ 3 s, p99 ≤ 5 s) 검토 승인. 최적화 완료 전까지 측정 로그를 지속 기록하고 재협상 시 재평가.
- 2025-09-26 Codex: ~~GUI 일정 미정~~ Sprint7 GUI 마일스톤(M1~M5) 확정 및 Codex 담당. 상세 일정은 docs/design/Sprint7_GUI_Metatask.md 참고.
- 절대 지령: 모든 업무 지시는 문서에 기록하고 기존 지시는 취소선으로 남긴다.



- 절대 지령: 모든 업무 지시는 문서에 기록하고 기존 지시는 취소선으로 남긴다.


