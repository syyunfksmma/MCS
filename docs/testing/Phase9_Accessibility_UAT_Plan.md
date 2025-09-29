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
