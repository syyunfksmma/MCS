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
