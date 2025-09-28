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
- ~~단위 테스트: GitHub Actions/DevOps에서 Pull Request 마다 실행.~~
- 단위 테스트: 내부 빌드 PC 예약 작업으로 야간 실행(dotnet test --filter Category=Unit).
- 통합 테스트: QA 서버에 설치 패키지 배포 후 scripts\\tests\\run-integration.ps1로 수동/자동 실행.
- UI 자동화: WPF UI 테스트(White/FlaUI)를 Windows 인증 계정으로 실행해 routing 생성/승인 흐름을 검증하고, 결과 로그를 \\MCMS_SHARE\\logs\\qa에 저장.
- 성능 회귀 가드레일: QA 환경에 주 2회 예약된 k6 스크립트를 실행해 Item/ Routing/ Esprit API 주요 시나리오의 응답시간 및 오류율을 수집하고, OpenTelemetry(OTLP)로 전송한 메트릭을 Grafana Loki/Tempo 대시보드와 비교 분석한다. 기준선 대비 10% 이상 악화되면 자동으로 UAT 승인 차단 상태를 생성하고 QA 채널에 경고 메시지를 게시한다.

## 5. UAT 일정
| 주차 | 활동 |
| --- | --- |
| Week 6 | QA 팀 사전 테스트 완료 |
| Week 7 | 파일럿 사용자 UAT (교육 + 시나리오 테스트) |
| Week 8 | 피드백 반영, 재검증 |

## 6. 피드백 수집
- ~~UAT 설문지 (Google Form 또는 사내 툴) 작성.~~
- ~~이슈 트래킹: Azure DevOps Board UAT Feedback 컬럼 운영.~~
- Excel 양식 대신 내부 이슈 트래커(예: Confluence + JIRA on-prem 또는 자체 Portal)에 `UAT-Feedback` 프로젝트를 생성하고, 모든 피드백을 컴포넌트/시나리오별 티켓으로 등록한다. 등록 시 UAT 테스트 케이스 ID, 재현 로그, OpenTelemetry Trace ID를 필수 필드로 연결해 실제 사용자 행동과 성능 이벤트를 연계한다.
- 대시보드: 이슈 트래커의 Kanban 보드와 Grafana 패널을 연결해 티켓 상태별(신규/분석/해결/검증) 진행률과 관련 OTel 지표(응답시간, 오류율)를 자동 표시한다.
- docs/sprint/Sprint9_UAT_Log.md에는 요약 지표(티켓 수, 해결률, 평균 리드타임)와 주요 텔레메트리 스냅샷 URL을 기록해 승인 로그와 연동한다.
- 주간 미팅으로 진행 현황 공유.

## 7. 릴리스 승인 기준
- 기능 회귀: 핵심 시나리오 자동화 테스트 100% 통과.
- 성능 회귀: k6 + OTel 비교 리포트에서 기준선 대비 P95 응답시간 10% 이내, 오류율 1% 이하 유지. 기준 초과 시 릴리스 차단 및 원인 분석 완료 후 재측정.
- UAT 피드백: `UAT-Feedback` 프로젝트 내 Critical/High 티켓 0건, Medium 이하는 해결 계획 문서화.

## 8. 주니어 개발자 지침
- 테스트 케이스 작성 시 Given/When/Then 구조 사용.
- 모든 버그는 재현 절차와 기대/실제 결과 명시.
- 자동화 스크립트 README 작성, 실행 방법 기록.

## 9. 오픈 이슈
- QA 자동화 환경(빌드 에이전트) 준비.
- UAT 일정과 파일럿 사용자 참여 확정.
- 교육 자료(슬라이드) 제작 담당자 지정.

---
2025-09-26 Codex: QA/UAT 계획을 내부망 설치형 시나리오에 맞게 조정하고 GitHub/DevOps 의존 항목에 취소선 적용.
