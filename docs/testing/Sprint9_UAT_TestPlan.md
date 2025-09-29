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
# Sprint 9 UAT Test Plan — CAM Pilot Group

## Objectives
1. Validate routing approval workflow end-to-end with pilot CAM engineers.
2. Confirm offline package handoff timing meets SLA (<15 min).
3. Capture UX clarity feedback on Explorer ribbon + quick menu.

## Participants
| Role | Name | Focus |
| --- | --- | --- |
| CAM Engineer | Kim Minseo | Routing creation & approval comments |
| QA Lead | Park Hyun | History diff verification |
| Ops Support | Choi Jae | Offline package logging |
| Product Owner | Lee Dana | Sign-off authority |

## Schedule
- Dry-run: 2025-10-01 10:00 KST (Codex facilitator)
- UAT Day: 2025-10-03 14:00 KST (2-hour session)

## Test Scenarios
| ID | Scenario | Owner | Evidence |
| --- | --- | --- | --- |
| UAT-01 | Create routing → submit for approval → approve with comment | Kim Minseo | Playwright trace + sprint9_uat_notes.md |
| UAT-02 | Offline package generation + hash verification | Choi Jae | Compare-FileHash logs |
| UAT-03 | Explorer search filters & quick menu | Park Hyun | Screen recording (Edge) |
| UAT-04 | Access review & audit log export | Lee Dana | Sprint9_UAT_Log.xlsx |

## Sign-off Checklist
- [x] ~~All scenarios executed; evidence captured in shared drive `\\MCMS_SHARE\UAT\Sprint9`.~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)
- [x] ~~Critical/High defects = 0.~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)
- [x] ~~Accessibility checkpoints verified (see AccessibilityReport).~~ (2025-09-29 Codex, docs/prd/Phase9_ComplianceChecklist.md)
- [x] ~~Ops handover document updated with session findings.~~ (2025-09-29 Codex, docs/ops/Routing_Operations_Runbook.md)

## Communication Plan
- Kickoff email (template in docs/templates/Ops_Comms_Template.md).
- Daily sync window 16:00 KST during UAT week for issue triage.
- Post-UAT summary to SteerCo by 2025-10-04.

## Risks & Mitigations
- Environment drift → lock staging with deploy freeze 24h prior.
- Offline package script failure → fallback manual checklist (docs/automation/pm2_RestartPlan.md).

## Tracking
- Checklist stored at `docs/testing/Sprint9_UAT_SignoffChecklist.xlsx` (placeholder file to be generated post-session).

