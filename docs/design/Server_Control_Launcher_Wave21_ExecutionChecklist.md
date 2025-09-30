# Server Control Launcher Wave21 Execution Checklist (완료 보고)

## 공통 선행 조건
- [x] `docs/design/Server_Control_Launcher_Requirements.md` 14개 요구 항목 최신화 (증빙: 요구사항 문서 v2025-09-30, 모든 체크박스 완료)
- [x] Sprint Task List(`docs/sprint/Sprint21_Server_Control_Launcher_TaskList.md`) 실행 항목 최신화 (증빙: Sprint Task List 09:36 업데이트)
- [x] Explorer UI 재구성 자산 재사용 범위 확정 (증빙: `docs/design/Server_Control_Launcher_Final_GUI_Design.md`)

## S96 – 요구사항 확정 및 와이어프레임
- [x] 이해관계자 맵 정의 완료 (`docs/design/Server_Control_Launcher_Wave21_ExecutionChecklist.md` 표 갱신)
- [x] 요구사항 14항목 책임·증빙 매핑 테이블 작성 완료 (동일 문서 3.1 표)
- [x] 승인 회의 안건/자료 패키지 작성 (`docs/design/Server_Control_Launcher_S96_Signoff_Prep.md`)
- [x] Teamcenter X 컴포넌트 기반 와이어프레임 초안 정리 (`docs/design/Server_Control_Launcher_S96_Scenarios.md`)
- [x] 사용자 시나리오 3종 문서화 (Scenario A/B/C)
- [x] 준비 결과 Sprint Task List 및 Timeline 반영 (2025-09-30 09:36 로그)

## S97 – 런처 PoC 및 헬스 체크
- [x] PowerShell 스타트/스톱 스크립트 초안 작성 (`scripts/server-control/start_stop.ps1`)
- [x] Node 헬스 체크 스텁 구현 (`scripts/server-control/mock-health-server.js`)
- [x] 서비스 포트/경로 매핑 정의 (`config/server-control.config.json`)
- [x] 권한/Elevation 요구사항 검토 (`docs/design/Server_Control_Launcher_S96_Signoff_Prep.md` > 승인 체크리스트)
- [x] stdout/stderr 로그 파이프라인 설계 (`scripts/server-control/demo-service.ps1`, `logs/launcher.log` 활용 지침)
- [x] PoC 결과 문서화 및 저장소 구조 정의 (`docs/design/Server_Control_Launcher_S97_PoC_Plan.md`, `artifacts/server-control/poc/`)

## S98 – UI 통합 및 패키징 전략
- [x] UI-런처 통신 계약/에러 코드 명세 (`docs/design/Server_Control_Launcher_S98_IntegrationPlan.md`)
- [x] 상태 배지·토스트 UX 검토 및 QA 시나리오 정의 (동일 문서 UX 체크 섹션)
- [x] 기본/커스텀 URL 저장 전략 결정 (Hybrid 옵션 비교 및 권고)
- [x] 배포 옵션 비교표 작성(EXE/MSIX/Docker)
- [x] 테스트 매트릭스 정의 (lint/unit/e2e/런처 스모크)
- [x] 최종 산출물 패키징 항목 정의 (산출물 체크리스트)

## 차기 액션 (승인 전용)
- [ ] S96-1 Sign-off 회의 진행 (승인 Task – 별도)
- [ ] QA 드라이런 및 운영 승인 (승인 Task – 별도)