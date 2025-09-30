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

# Server Control Launcher Code Audit Plan (Draft 2025-09-30)

## 범위 및 책임
| 영역 | 파일/디렉터리 | 검사 항목 | 책임 | 일정 |
|---|---|---|---|---|
| PowerShell 런처 스크립트 | scripts/server-control/*.ps1 | 함수명, 예외 처리, 주석, 미사용 변수 | Engineering | 2025-10-01 |
| Node 헬스 스텁 | scripts/server-control/mock-health-server.js | 라우팅, 에러 핸들링, 로그 | Engineering | 2025-10-01 |
| 설정 파일 | config/*.json | 스키마 일관성, 기본값, 권한 | Engineering | 2025-10-02 |
| 문서/체커리스트 | docs/design/*.md | 링크/표/체크박스 정확성 | Product/PM | 2025-10-02 |
| Explorer/MCS UI 코드 | src/explorer/**, styles/** | 컴포넌트/토큰/팀센터 준수 | Frontend | 2025-10-03 |

## 감사 절차
1. 정적 분석 도구 실행 (Pwsh ScriptAnalyzer, ESLint, TypeScript)
2. 수동 코드 리뷰 체크리스트 적용
3. Critical/Major/Minor 등급으로 이슈 정리
4. 결과 보고서 `docs/logs/QA_Audit_Report_2025-10-03.md` 작성 예정

## 산출물
- 분석 로그: artifacts/qa/audit/
- 이슈 목록: docs/logs/QA_Audit_Report_YYYY-MM-DD.md
- 후속 액션: Sprint Task List 업데이트, PRD 링크 보완
