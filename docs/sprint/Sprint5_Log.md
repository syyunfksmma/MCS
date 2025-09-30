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
# Sprint 5 Activity Log — QA & UAT

> 모든 작업 과정과 로그를 기록한다. UAT 피드백/테스트 결과를 상세히 남긴다.
- 2025-09-29 12:13:10 Codex: 접근성 수동 체크리스트(UAT_Manual_Checklist.md) 업데이트.
- 2025-09-29 12:13:00 Codex: Sprint5 Monitoring Plan TODO(Telegraf config, Grafana UID, Alert routing) 업데이트.

## 2025-09-22 Codex
- Sprint5 접근성 계획 수립 및 문서화(Sprint5_AccessibilityPlan.md).
- Playwright axe 스모크 테스트(	ests/e2e/accessibility/axe-smoke.spec.ts), 
pm run test:axe 스크립트 추가.
- Lighthouse CI 가드(scripts/performance/assert-lighthouse.mjs, 
pm run perf:lighthouse:ci) 도입.
- Web Vitals → Grafana 파이프라인 초안(Sprint5_MonitoringPlan.md).
- 메인터넌스 강제 모드 Playwright 시나리오(maintenance-override.spec.ts) 작성 및 게이트 개선.

## 2025-09-29 Codex
- Explorer SSR 작업을 위한 feature/sprint5-explorer-ssr 브랜치 생성 계획 수립(Explorer shell, Global Search scaffold 우선).
- 로컬 localhost:4000(Node.js 단독 서버) 환경에서 SSR 렌더링을 검증하고, 관련 실행 로그와 스크린샷을 Sprint5_Log 부록에 추가 예정.
- Playwright 회귀 시나리오(Explorer 로드, Search Typeahead) 재실행 계획 수립 및 결과 로그 경로(\\MCMS_SHARE\\logs\\playwright\\20250929)를 예약.
- API/Design Sync(2025-09-30) 결과를 반영할 수 있도록 Explorer 컴포넌트의 PRD 대응 ID 매핑 체크리스트 초안 작성.

## 2025-09-29 Codex — Sprint5 A-block 착수
- Playwright workspace/admin 시나리오(workspace-admin.spec.ts) 초안 작성, E2E_BASE_URL 미설정 시 자동 skip 로직 포함.
- 테스트 데이터 시드/리셋 스크립트(`scripts/testing/seed-test-data.mjs`, `reset-test-data.mjs`) 추가 및 `npm run test:data:*` 스크립트 정의.
- 회귀 스위트 스크립트 `npm run test:regression` 구성(데이터 리셋→시드→E2E→axe 순).
### B-block 업데이트
- UAT 체크리스트/시나리오 패키지를 `docs/sprint/Sprint5_UAT_Checklist.md`로 확정하고 승인 기준을 명시.
- `scripts/testing/bootstrap-uat.ps1` 스크립트로 기본 계정/데이터 리셋 로그를 남기도록 구성, 실제 AD 매핑은 사용자 개입 필요 항목으로 분리.
- 피드백 수집 템플릿(`docs/sprint/Sprint5_UAT_Feedback.md`)과 대응 프로세스를 정의.
#### User Input Needed
- AD 보안 그룹 매핑 및 실제 UAT 계정 발급은 인프라 팀 승인 필요 (B2 후속).
### C-block 준비
- 접근성 검사 결과 리포트 초안(`test-results/accessibility/axe-report-20250929.md`) 작성, HTTP-only 배포 이후 실행 계획 명시.
- OWASP ZAP 베이스라인 스캔 계획을 `test-results/security/zap-report-20250929.md`에 정리.
- 브라우저 매트릭스 체크리스트(`test-results/browser/matrix-20250929.md`)로 크로스브라우저 검증 범위 정의.
- [사용자 확인 필요] Lighthouse/axe/ZAP 실측 실행은 배포 환경 준비 후 수행 예정.
### D-block 업데이트
- QA Report 초안(`docs/sprint/Sprint5_QAReport.md`) 작성 및 리스크/후속 조치 정의.
- UAT 로그 템플릿은 Sprint5_Log 연동 (피드백 템플릿과 연계).
- 의존성: nodemailer 추가(`npm install nodemailer@^6.9.12`) 예정.
2025-09-29 Codex — SMTP 준비 단계
- `.env.local`에 SMTP/EMAIL_FROM/JWT_SECRET 플레이스홀더를 추가하고 `logs/app`, `logs/auth`, `logs/deploy` 폴더를 생성.
- `npm install` 실행하여 nodemailer 의존성을 포함한 패키지 재설치를 수행(경고 있음, 완료 로그 확인 필요).
- ~~SMTP 점검 스크립트(`check-smtp.mjs`)에 dotenv 로딩을 추가하고 `npm install dotenv` 완료.~~ (이후 수동 승인 플로우로 전환하며 스크립트 제거)
- SMTP 점검 스크립트에서 `.env.local`을 직접 로드하도록 dotenv `config({ path })` 적용.
### 2025-09-29 Codex — 이메일 수동 승인 플로우 전환
- Magic Link/SMTP 계획을 폐기하고, 가입 정보를 로컬 JSON에 저장한 뒤 관리자가 수동 승인하는 흐름으로 재정의.
- `/api/auth/register`, `/api/auth/approve`, `/api/auth/login` API와 `/auth/*` 페이지를 추가해 승인/로그인 과정을 시각화.
- nodemailer/SMTP 관련 스크립트(`check-smtp`, `purge-expired`) 제거.
## 2025-09-29 10:24:44 Codex — 다음 단계 계획
1. Sprint5.1 검색 기능 (/api/search, Typeahead UI, SLA 기록, feature flag) 구현 및 로그 유지.
2. Sprint6 라우팅/운영 태스크(Routing Wizard, Detail Modal, 업로드/다운로드, Grafana/pm2) 순차 진행.
3. HTTP-only 스테이징 준비 후 
pm run test:regression, axe, ZAP, 브라우저 매트릭스 실측 실행.
4. 각 단계 완료 시 docs/logs/Timeline_2025-09-29.md, Sprint 로그, QA Report에 시간별 기록을 추가.
## 2025-09-29 10:29:05 Codex — Sprint5.1 검색 작업 착수
- /api/auth 수동 승인 흐름 기반 시스템에서 검색 기능을 확장하기 위해 Sprint5.1 TaskList(D/E/F) 수행을 시작합니다.
- 단계별 결과는 docs/logs/Timeline_2025-09-29.md 및 Sprint5_Log.md에 시간 단위로 기록합니다.
## 2025-09-29 10:45:17 Codex — Sprint5.1 검색 구현 하위 계획
1. /api/search (mock) 엔드포인트 작성 → initialData 재활용 vs 별도 fetch 결정.
2. Typeahead UI 구현: ExplorerShell 또는 별도 SearchBar 컴포넌트 확장.
3. Facet 필터 패널/결과 테이블 구성.
4. SLA 측정 로직 및 feature flag (
eature.search-routing) 적용.
5. 각 단계 완료 시 Timeline 로그 및 Sprint5_Log.md에 기록.
### 2025-09-29 10:46:23 Codex — Sprint5.1 D1 진행 현황
-  `/api/search` mock 구현 및 useRoutingSearch 훅 SLA 측정 로직 적용. 
### 2025-09-29 10:48:37 Codex — Sprint5.1 D2 Typeahead 작업 시작
- 2025-09-29 10:52:51 Sprint5.1 D2 Typeahead 처리: 입력 Debounce(350ms) 및 자동 검색을 ExplorerShell에 적용.
- 2025-09-29 10:54:10 남은 체크박스 총 256건 (Sprint5.1 D1/D2 완료 후).
### 2025-09-29 10:55:20 Codex — Sprint5.1 E 단계 착수 계획
- E1 Facet 필터 패널 구성(중복 항목 점검, 필요 시 통합).
- E2 검색 결과 테이블/Quick Action 구현, 기존 Explorer 카드와 중복 로직 취소선 처리 예정.
- 완료마다 Timeline/Sprint 로그 및 정량 보고를 갱신.
- 2025-09-29 11:00:42 Sprint5.1 E1/E2 완료: Select 기반 필터 + 결과 테이블 Quick Action(열기/다운로드) 및 필터 초기화 추가.
- 2025-09-29 11:02:51 남은 체크박스 총 254건 (Sprint5.1 E1/E2 완료 포함).
### 2025-09-29 11:05:29 Codex — Sprint5.1 F 단계 착수
- 성능 측정(SLA ≤ 1.5s), feature flag fallback 구현 계획을 실행합니다.
- 2025-09-29 11:09:32 Sprint5.1 F1: `/api/search` SLA 타겟 파라미터 및 ExplorerShell SLA 요약(목표/서버/클라이언트, % 표시) 구현.
- 2025-09-29 11:10:24 남은 체크박스 총 253건 (Sprint5.1 F1 완료 반영).
### 2025-09-29 11:11:03 Codex — Sprint5.1 F2 feature flag 작업 시작
- `feature.search-routing` 플래그 및 레거시 폴백을 구현하고 로그를 남길 예정입니다.
- 2025-09-29 11:28:55 Sprint5.1 F2 완료: feature.search-routing 토글, ExplorerShell legacy fallback, state reset 메시지 처리.
- 2025-09-29 11:29:02 남은 체크박스 252건 (Sprint5.1 D1~F2 완료 반영).

