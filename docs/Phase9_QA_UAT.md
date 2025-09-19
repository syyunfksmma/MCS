# Phase 9 - QA & UAT 계획

## 1. 테스트 전략 개요
- 자동화 테스트: 단위/통합/엔드투엔드 스크립트 실행.
- 수동 테스트: UI/UX, 승인 워크플로우, SolidWorks/Esprit 연계 확인.
- 회귀 테스트: 주요 기능 업데이트 시 전체 시나리오 재검증.

## 2. 테스트 케이스 분류
| 영역 | 예시 케이스 |
| --- | --- |
| Item 관리 | 품목 생성/Rev 추가/삭제 불가 검증 |
| Routing 관리 | Routing 생성, 파일 업로드, 승인/거절 플로우 |
| FileMapper | 경로 검증, 중복 파일 감지, meta.json 업데이트 |
| History | 이력 조회, Diff 확인, 필터 기능 |
| 권한 | 역할별 접근 제한, 승인 권한 검증 |
| SolidWorks 연계 | 링크 생성/해제, 파일 메타 업데이트 |
| Esprit 연계 | Esprit 실행 성공/실패 시나리오 |
| CMD 서비스 | 배포 명령, 롤백 명령, 실패 처리 |

## 3. 테스트 환경
- QA 서버: Windows Server 2019, SQL Server QA, W:\ 샌드박스.
- 테스트 계정: Viewer/Editor/Approver/Admin 각각 발급.
- 데이터: 파일럿 데이터 복제본 사용 (민감 정보 마스킹).

## 4. 자동화 계획
- 단위 테스트: GitHub Actions/DevOps에서 Pull Request 마다 실행.
- 통합 테스트: QA 환경에 배포 후 스케줄 실행.
- UI 자동화: WPF UI 테스트(White/FlaUI)로 핵심 흐름 (Routing 생성, 승인) 실행.

## 5. UAT 일정
| 주차 | 활동 |
| --- | --- |
| Week 6 | QA 팀 사전 테스트 완료 |
| Week 7 | 파일럿 사용자 UAT (교육 + 시나리오 테스트) |
| Week 8 | 피드백 반영, 재검증 |

## 6. 피드백 수집
- UAT 설문지 (Google Form 또는 사내 툴) 작성.
- 이슈 트래킹: Azure DevOps Board `UAT Feedback` 컬럼 운영.
- 주간 미팅으로 진행 현황 공유.

## 7. 주니어 개발자 지침
- 테스트 케이스 작성 시 Given/When/Then 구조 사용.
- 모든 버그는 재현 절차와 기대/실제 결과 명시.
- 자동화 스크립트 README 작성, 실행 방법 기록.

## 8. 오픈 이슈
- QA 자동화 환경(빌드 에이전트) 준비.
- UAT 일정과 파일럿 사용자 참여 확정.
- 교육 자료(슬라이드) 제작 담당자 지정.
