# Sprint 5 Activity Log — QA & UAT

> 모든 작업 과정과 로그를 기록한다. UAT 피드백/테스트 결과를 상세히 남긴다.

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
- SMTP 점검 스크립트(`check-smtp.mjs`)에 dotenv 로딩을 추가하고 `npm install dotenv` 완료.
- SMTP 점검 스크립트에서 `.env.local`을 직접 로드하도록 dotenv `config({ path })` 적용.
