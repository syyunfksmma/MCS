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

# Checkbox Clearance Plan (83 Items)

## Wave Structure
- **Wave 1 (20 items)**: `docs/design/Explorer_UI_Rework_ImplementationPlan.md` (9), `docs/ExecutionChecklist.md` (2), `docs/design/Server_Control_Launcher_S96_Signoff_Prep.md` (4), `docs/design/Server_Control_Launcher_S98_IntegrationPlan.md` (5)
- **Wave 2 (20 items)**: `~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)` 항목 1~20
- **Wave 3 (20 items)**: `~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)` 항목 21~32 (12), `docs/setup/Localhost_Test_Playbook.md` (5), `docs/sprint/Sprint20_Explorer_UI_Rework_TaskList.md` (4)
- **Wave 4 (20 items)**: `docs/sprint/Sprint6_Routing_TaskList.md` (9), `docs/sprint/Sprint7_Routing_TaskList.md` (6), `docs/sprint/Sprint8_Routing_TaskList.md` 항목 1~5 (5)
- **Wave 5 (3 items)**: `docs/sprint/Sprint8_Routing_TaskList.md` 잔여 3, `docs/templates/Ops_Comms_Template.md` (1), `docs/Tasks_MCS.md` (2) → 총 6? 조정

조정된 Wave 5:
- `docs/sprint/Sprint8_Routing_TaskList.md` 잔여 3
- `docs/templates/Ops_Comms_Template.md` 1
- `docs/Tasks_MCS.md` 2
- `docs/ops/Access_TableMapping_Plan.md` 4
=> Wave 5 총 10 (잔여 3는 마무리)

## Execution Guidelines
1. 각 Wave 종료 시 관련 문서의 불릿 상태 갱신 + Timeline 로그 기록.
2. 불릿 항목 완료 근거(코드/문서/테스트 결과)를 Sprint Task 또는 QA 보고서에 첨부.
3. 승인 이슈는 별도 Task로 분리해 Wave에 포함시키지 않음.

## Ownership & Scheduling
| Wave | 담당 | 목표일 |
|---|---|---|
| Wave 1 | Product/UX/Engineering 공동 | 2025-10-02 |
| Wave 2 | ML 팀 | 2025-10-04 |
| Wave 3 | ML + Ops | 2025-10-07 |
| Wave 4 | Routing FE 팀 | 2025-10-10 |
| Wave 5 | Ops + PM | 2025-10-11 |

## Reporting
- 각 Wave 완료 후 `docs/logs/Checkbox_Clearance_<wave>.md` 생성.
- Sprint Task List 및 Timeline에 “Wave X 완료” 로그 남김.
- 전체 완료 후 PRD Remaining Tasks 항목을 업데이트.