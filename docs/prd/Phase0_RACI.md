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

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
# Phase 0 산출물 - Stakeholder RACI & 승인 플로우

## 1. 핵심 이해관계자
| 역할 | 이름/조직 | 주요 관심 | 비고 |
|---|---|---|---|
| Executive Sponsor | 제조혁신실장 | 전환 ROI, 일정 | 최종 승인권자 |
| Product Owner | CAM 운영팀장 | 기능 범위, 사용자 만족도 | 데일리 의사결정 |
| IT Security Lead | 보안실 과장 | SSO, 정책 준수 | 보안 승인 |
| Infra/Network Lead | 인프라팀 | Node 호스팅, 네트워크 정책 | 배포 승인 |
| Add-in Owner | ESPRIT 담당 엔지니어 | Add-in 연동 영향 | 기능 검증 |

## 2. RACI 매트릭스
| 작업 | Product Owner | Exec Sponsor | IT Security | Infra Lead | Add-in Owner |
|---|---|---|---|---|---|
| Next.js 전환 승인 | A | R | C | C | C |
| SSO 정책 합의 | C | I | R | C | I |
| Node 호스팅 방식 결정 | C | I | C | R | I |
| Add-in 연동 영향 검토 | C | I | I | I | R |
| 일정/예산 확정 | R | A | C | C | I |

- **R**esponsible: 실행 주체, **A**ccountable: 최종 책임, **C**onsulted: 자문, **I**nformed: 통보

## 3. 승인 플로우
1. Product Owner가 Phase 0 산출물(Executive Deck, RACI, 정책 메모)을 취합
2. IT Security, Infra Lead가 각각 SSO/호스팅 정책 리뷰 후 코멘트
3. 모든 피드백 수렴 후 Executive Sponsor에게 최종 승인 요청
4. 승인 완료 시 Phase 1 킥오프 회의 일정 확정

## 4. 회의/커뮤니케이션 계획
- Steering 회의: 월 2회 (Exec Sponsor, Product Owner, IT/Infra Leads)
- 작업 그룹 회의: 주 1회 (Product Owner 주관)
- 기록: Confluence 페이지 + Teams 채널에서 공유

## 5. 준비해야 할 추가 자료
- SSO 아키텍처 다이어그램 (IT Security 요구)
- Node 서비스 재시작/모니터링 Runbook 초안 (Infra 요구)
- Add-in 영향 분석 메모 (Add-in Owner 요구)

