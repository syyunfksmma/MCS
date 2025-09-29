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
# Sprint 7 Activity Log — Documentation & Training
- 2025-09-29 12:06:30 Codex: LogPipeline TODO( Promtail config ) 완료 및 Loki 파이프라인 준비.
- 2025-09-29 12:02:20 Codex: E1~E3 Explorer UX 구현(SearchFilterRail, ExplorerRibbon, Quick Menu) 완료.
- 2025-09-29 12:04:30 Codex: F1~F3 Chunk Upload Phase2 계획 및 스크립트(chunks A/B, SSD warm-up, Streaming SHA) 작성.
- 2025-09-29 12:05:55 Codex: D1 Sprint7_Log 최신화 및 Timeline 동기화.
- 2025-09-29 12:09:45 Codex: C3 Lessons Learned 및 C4 자동화 범위 문서화(Sprint7_LessonsLearned.md, Sprint8_AutomationPlan.md).
- 2025-09-29 12:09:20 Codex: C1 전환 보고 및 C2 로드맵 문서 초안 작성(Sprint7_TransitionReport.md, Sprint7_Roadmap.md).
- 2025-09-29 12:07:20 Codex: B1~B4 교육/온보딩 자료 초안 작성 (TrainingMaterials, Sessions Log, Onboarding Checklist, Approval Workshop).
- 2025-09-29 12:06:10 Codex: A1~A4 문서 세트 작성 (UserManual, OpsManual, FAQ, Offline QuickStart).

> 모든 작업 과정과 로그를 기록한다. 교육/문서 업데이트 결과를 상세히 남긴다.


