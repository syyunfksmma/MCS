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
# 신규 요구사항 백로그 (Stage4 준비)

## 수집 소스
- PoC 킥오프 전 유관 부서 인터뷰 (CAM, 품질, IT 보안)
- Jira MCMSNEXT 프로젝트 신규 이슈 (FR-11 ~ FR-18)
- Training/Reporting 팀 전환 요청 메일 (2025-09-28 수신)

## 백로그 테이블
| ID | 유형 | 요청 부서 | 설명 | 영향 범위 | 우선순위 | 예정 Sprint |
| --- | --- | --- | --- | --- | --- | --- |
| FR-11 | 기능 | CAM | Routing Wizard 단계별 승인자 지정 | Web Portal | High | Sprint7 |
| FR-12 | 기능 | 품질 | 품질 승인 시 전자 서명 캡쳐 | API/DB | Medium | Sprint8 |
| FR-13 | 비기능 | IT 보안 | AD MFA 강제, 실패 로그 아카이브 | Auth | High | Sprint6 |
| FR-14 | 데이터 | Reporting | 공유 드라이브 파일 변경 이력 Export | Worker | Medium | Sprint7 |
| FR-15 | 교육 | Training | 신규 사용자 온보딩 투어 모듈 | Web | Low | Sprint9 |
| FR-16 | 통합 | CAM | ESPRIT Add-in 버전 자동 체크 | Add-in | Medium | Sprint8 |
| FR-17 | 운영 | Ops | 설치 자동화 상태 대시보드 | Installers | Medium | Sprint6 |
| FR-18 | 품질 | QA | Selenium Edge 스모크 테스트 추가 | Testing | High | Sprint6 |

## 우선순위 기준
1. 규제/보안 요구 → 최우선 처리.
2. PoC 성공 지표에 직접 연관된 항목 → Sprint6~7 배치.
3. 교육/문서 항목은 Sprint9 이후 배치.

## 의존성 및 Assignee
- FR-11, FR-12: API 계약 업데이트 필요 (design/api 팀 공조).
- FR-13: Azure AD 팀 승인 필요, 보안 감사 증적 첨부.
- FR-17: `scripts/install` 리포트 확장 + Grafana 패널 신설.
- FR-18: 본 Wave에서 테스트 플랜 작성으로 선행 처리.

## 다음 단계
- 2025-09-30 API/Design Sync에서 백로그 검토 → 승인 후 Jira 업데이트.
- 승인된 항목은 MCMS_TaskList Phase 6~8 섹션에 반영.
- 거부/보류 항목은 2025-10-02 Steering Committee에서 재논의.

