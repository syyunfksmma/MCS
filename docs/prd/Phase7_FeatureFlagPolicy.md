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
# Phase 7 산출물 - Feature Flag & 환경변수 정책

## 1. Feature Flag 체계
- 도구: LaunchDarkly 대안 → 자체 YAML/DB 기반 토글 (사내망 제한)
- 구성: `flagName`, `description`, `enabled`, `targetGroups`
- 적용: Next.js 서버에서 flags.json 로드 → React Context 공급
- 배포: Git 저장소 관리 + Admin Console에서 토글(Hot reload)

## 2. 환경변수 관리
- Next.js `.env` (Server only), MCMS API appsettings 공유
- 민감 정보: Key Vault/Secret Manager → Deploy 스크립트로 주입
- 변경 절차: Jira Change Request → 승인 후 반영

## 3. 운영 프로세스
1. Feature 추가 시 Jira 티켓에 Flag 명세
2. 개발/테스트 → Stage 플래그 On → Prod On (PO 승인)
3. Flag 종료: 특정 버전 이후 제거, 코드/문서 정리

## 4. 감사/추적
- Flag 변경 이벤트 감사 로그 기록 (사용자, 이전/현재 값)
- 롤백: 이전 JSON/DB 상태 복원 스크립트

## 5. TODO
- 토글 UI Prototype → Phase 8에서 테스트
- Secret Rotation 주기 명시 (6개월)
- LaunchDarkly 등 외부 서비스 도입 가능성 검토

