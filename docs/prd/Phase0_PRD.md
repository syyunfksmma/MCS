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
<<<<<<< Updated upstream
# Phase 0 PRD - Alignment & Governance\n\n## 초점 영역\n- Next.js 전환 배경/범위 정리
- SSO·보안·Node 호스팅 정책 확정
- 전환 승인(경영/IT) 의사결정 수립
\n## 산출물\n- Executive Decision Deck
- Stakeholder RACI & 승인 프로세스
- SSO/보안 정책 합의서
\n## 주요 위험\n- SSO 승인 지연
- Node 호스팅 정책 미정
=======
# Phase 0 PRD - Alignment & Governance

## 초점 영역
- Next.js 전환 배경, 이해관계자 역할, 승인 프로세스 정리
- SSO 도입, Node.js 호스팅 정책, 보안 가이드 확립
- 웹-백엔드 통합 영향도와 기존 WPF 지원 종료 계획 수립

## 산출물
- 전환 의사결정 메모(경영 승인)
- Stakeholder RACI 매트릭스
- SSO/보안 정책 합의서

## 주요 위험
- SSO 승인 지연으로 일정 미루어질 수 있음
- 사내망 Node 호스팅 정책 미비
>>>>>>> Stashed changes

