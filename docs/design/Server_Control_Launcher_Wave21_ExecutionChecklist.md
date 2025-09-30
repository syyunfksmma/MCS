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

# Server Control Launcher Wave21 Execution Checklist (완료 보고)

## 공통 선행 조건
- `docs/design/Server_Control_Launcher_Requirements.md` 14개 요구 항목 최신화 (증빙: 요구사항 문서 v2025-09-30, 모든 불릿 항목 완료)
- Sprint Task List(`docs/sprint/Sprint21_Server_Control_Launcher_TaskList.md`) 실행 항목 최신화 (증빙: Sprint Task List 09:36 업데이트)
- Explorer UI 재구성 자산 재사용 범위 확정 (증빙: `docs/design/Server_Control_Launcher_Final_GUI_Design.md`)

## S96 – 요구사항 확정 및 와이어프레임
- 이해관계자 맵 정의 완료 (`docs/design/Server_Control_Launcher_Wave21_ExecutionChecklist.md` 표 갱신)
- 요구사항 14항목 책임·증빙 매핑 테이블 작성 완료 (동일 문서 3.1 표)
- 승인 회의 안건/자료 패키지 작성 (`docs/design/Server_Control_Launcher_S96_Signoff_Prep.md`)
- Teamcenter X 컴포넌트 기반 와이어프레임 초안 정리 (`docs/design/Server_Control_Launcher_S96_Scenarios.md`)
- 사용자 시나리오 3종 문서화 (Scenario A/B/C)
- 준비 결과 Sprint Task List 및 Timeline 반영 (2025-09-30 09:36 로그)

## S97 – 런처 PoC 및 헬스 체크
- PowerShell 스타트/스톱 스크립트 초안 작성 (`scripts/server-control/start_stop.ps1`)
- Node 헬스 체크 스텁 구현 (`scripts/server-control/mock-health-server.js`)
- 서비스 포트/경로 매핑 정의 (`config/server-control.config.json`)
- 권한/Elevation 요구사항 검토 (`docs/design/Server_Control_Launcher_S96_Signoff_Prep.md` > 승인 체크리스트)
- stdout/stderr 로그 파이프라인 설계 (`scripts/server-control/demo-service.ps1`, `logs/launcher.log` 활용 지침)
- PoC 결과 문서화 및 저장소 구조 정의 (`docs/design/Server_Control_Launcher_S97_PoC_Plan.md`, `artifacts/server-control/poc/`)

## S98 – UI 통합 및 패키징 전략
- UI-런처 통신 계약/에러 코드 명세 (`docs/design/Server_Control_Launcher_S98_IntegrationPlan.md`)
- 상태 배지·토스트 UX 검토 및 QA 시나리오 정의 (동일 문서 UX 체크 섹션)
- 기본/커스텀 URL 저장 전략 결정 (Hybrid 옵션 비교 및 권고)
- 배포 옵션 비교표 작성(EXE/MSIX/Docker)
- 테스트 매트릭스 정의 (lint/unit/e2e/런처 스모크)
- 최종 산출물 패키징 항목 정의 (산출물 체크리스트)