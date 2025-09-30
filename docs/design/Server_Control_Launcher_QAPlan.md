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

# Server Control Launcher QA Focus Areas (Draft 2025-09-30)

## 1. 우선순위 모듈 지정
- **Server Control Launcher**
  - PowerShell 제어 스크립트(`scripts/server-control/start_stop.ps1`, `demo-service.ps1`)
  - 설정 파일(`config/server-control.config.json`)
  - 헬스 체크 스텁(`mock-health-server.js`)
  - 요구사항/체크리스트 문서(`docs/design/Server_Control_Launcher_Requirements.md`, `...ExecutionChecklist.md`)
- **Explorer/MCS UI 재사용 자산**
  - 레이아웃 및 Ribbon 컴포넌트(`src/explorer/...` 위치 추후 확인 필요)
  - 색상/토큰 정의(`styles/tokens.ts`, `globals.css`)
- **문서/승인 흐름**
  - Sign-off 준비 문서(`docs/design/Server_Control_Launcher_S96_Signoff_Prep.md`)
  - 통합/배포 계획(`docs/design/Server_Control_Launcher_S98_IntegrationPlan.md`)

우선순위: Server Launcher > Explorer 재사용 자산 > 문서 체커리스트

## 담당 범위 및 QA 체크포인트
| 영역 | 주제 | 우선도 | 검사 항목 |
|---|---|---|---|
| Launcher Scripts | 서비스 기동/중지/헬스 | High | 함수명 일관성, 예외 처리, 로그 기록, 환경 변수 |
| Config | 서비스 매핑/로그 경로 | High | 포트/명칭 정확성, 권한 필요 여부 |
| UI Assets | 컴포넌트 재사용 | Medium | Teamcenter 토큰 적용, hover/drag 상태 정의 |
| Docs | 체크리스트/승인 흐름 | Medium | 요구사항-산출물 매핑, 미완료 항목 표시 |

## 2025-09-30 초기 점검 결과
- PowerShell 런처 스크립트: 경로 절대화/로그 리디렉션 미비 → 수정 완료(start_stop.ps1)
- 데모 서비스: 종료 훅 부재(향후 개선 항목)
- Config: 경로 공백 대비 필요(workingDirectory 절대화 처리 완료)
- 헬스 스텁: 오류 응답 세부 메시지 수집 필요(향후 보완)
- 헬스 체크 스텁: 상태 변경/에러 로깅 추가(mock-health-server.js)
- 데모 서비스: Ctrl+C/Stop Signal 대응 및 종료 로그 추가
- config: 서비스별 stop 신호 경로 추가(config/server-control.config.json)
