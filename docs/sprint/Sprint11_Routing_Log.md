# Sprint 11 Routing Logbook (Documentation & Training)

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
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

> 모든 문서/교육 작업 내용을 영어로 기록하고, 산출물 링크를 포함한다.

## Log Template
| Date (UTC) | Owner | Task ID | Summary (English) | Code Comments Added | Evidence Links |
| --- | --- | --- | --- | --- | --- |
| 2025-12-29 | Codex | X1 | Refreshed routing user guide with hierarchy/detail/search context. | <!-- HTML tips + screenshot sources embedded --> | docs/ops/Routing_UserGuide.md |
| 2025-12-29 | Codex | X2 | Authored storyboard + narration for quick-start video/GIF. | <!-- Embed location noted in media plan --> | docs/ops/Routing_QuickStart_Media.md |
| 2025-12-29 | Codex | Y1 | Delivered admin handbook covering shared-drive + health panel ops. | <!-- Inline tip comments for handbook actions --> | docs/ops/Routing_AdminHandbook.md |
| 2025-12-29 | Codex | Y2 | Published support FAQ and escalation checklist with SLA targets. | <!-- FAQ references support template in comments --> | docs/ops/Routing_SupportFAQ.md |
| 2025-12-29 | Codex | Z1 | Documented shared-drive path/permissions with approval notes. | <!-- Config reference comment links to appsettings --> | docs/ops/Routing_SharedDrive_Decisions.md |
| 2025-12-29 | Codex | Z2 | Finalized version naming and mandatory file policy mapping to PRD. | <!-- PRD reference comment captured in policy --> | docs/ops/Routing_Versioning_Policy.md |

## Sections
- **X1** User guide update
- **X2** Quick-start media
- **Y1** Admin handbook
- **Y2** Support FAQ
- **Z1** Shared-drive decisions
- **Z2** Version naming & mandatory files

> Example: `| 2025-12-28 | Codex | Z2 | Finalized version naming (v###) + optional .stl policy | <!-- Document reason in PRD section 15 --> | PR #395, meeting notes |`




