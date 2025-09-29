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
# Phase9 Accessibility & CAM UAT Coordination (2025-09-29)

## 1. Accessibility Scan (axe)
- 범위: Explorer, Workspace, Admin Settings, Product Dashboard.
- 도구: `axe-core` + Playwright accessibility assertions.
- 체크리스트: 대비, ARIA 레이블, 키보드 포커스, 라이브영역.
- 산출물: `reports/wave17/accessibility_scan_20250930.xlsx`, 이슈는 Jira (ACC-*) 등록.

## 2. CAM Pilot Group UAT 협업
- 참여자: CAM 팀 4명 (Lead: Kim JY), Ops 관찰 1명.
- 일정: 2025-10-01 14:00~16:00 KST (Teams + Remote Desktop).
- 시나리오: Routing 생성/업로드, SolidWorks 경로 복사, 공유 드라이브 동기화 확인.
- 피드백 캡처: `docs/testing/CAM_UAT_Feedback_Log.md`에 기록.
- 성공 기준: 95% 작업 성공, 동기화 지연 < 7분, 사용자 만족도 4/5 이상.

## 커뮤니케이션
- Slack #mcms-cam-pilot 채널 실시간 지원.
- 회의 1시간 전 리마인더 + 체크리스트 공유.

## 후속
- 핵심 이슈는 24시간 내 triage.
- Wave18에서 피드백 반영 계획 수립.

