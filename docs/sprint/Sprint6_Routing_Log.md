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

## 수정 이력
- 2025-09-25 Codex: 절대 지령 추가 및 Sprint6 로그 항목 정리.


