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
# Phase 6 산출물 - Sprint 2 범위 개요

## 목표
- Routing Workspace Drag & Drop 에디터 완성
- Add-in Control Panel 구축 및 재시도/취소 기능 제공
- 승인/반려 코멘트 플로우 통합 테스트 계획 수립

## 산출물
- `Phase6_WorkspacePlan.md`
- `Phase6_AddinControlPlan.md`
- `Phase6_ApprovalFlowTestPlan.md`

## 기간 (예상)
- Sprint 2: 2025-11-10 ~ 2025-11-28

## 성공 지표
- Routing Workspace Drag & Drop 응답시간 200ms 이내
- Add-in 재시도/취소 성공률 99% 이상 (테스트 환경)
- 승인/반려 플로우 E2E 테스트 100% 통과

## 위험
- Drag & Drop 접근성 보장 미흡 → 키보드 대안 필요
- Add-in 재시도 시 API Rate Limit 초과 위험
- 승인 코멘트 롤백 시 히스토리 일관성 문제

