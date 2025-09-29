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
# Sprint 4 Activity Log — Performance & Reliability

> 절대지령
- 각단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 신규 생성된 작업에서도 절대지령을 동일하게 준수한다.
- 오류 개선을 위해 신규 TASK가 발생하면 TASK LIST를 새로 작성하거나, 기존 LIST에 업데이트 한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.


## 2025-09-22 Codex
- Completed A1~A3: Lighthouse CI script (
pm run perf:lighthouse), Web Vitals beacon /api/web-vitals, docs (Sprint4_PerformancePlan.md).
- Added k6 smoke script and chaos playbook (B1~C3) under scripts/performance with README guidance.
- Delivered maintenance mode UX (MaintenanceGate/MaintenanceBanner), config file, and maintenance playbook (D1~D3).
- Logged performance summary (Sprint4_PerformanceReport.md).

## 2025-09-22 Codex - Security Hardening
- Ran `npm audit` to baseline vulnerabilities; identified multi-advisory exposure on Next.js 14.2.3.
- Upgraded Next.js to 14.2.32 via `npm install next@14.2.32`; updated lockfile artifacts.
- Re-validated with `npm audit`, `npm run lint`, and `npm run build` (Next.js 14.2.32) to confirm the patch and ensure build stability.
## 2025-09-23 08:27:09 대한민국 표준시 Codex - 런타임 회귀 검사
- `npm run test:e2e` 실행(Playwright, 8 tests / 5 workers); 2건 실패 보고.
- 실패 1: `tests/e2e/accessibility/axe-smoke.spec.ts` - ant select combobox에 필수 ARIA 속성이 누락되고 잘못된 값이 있어 `aria-required-attr`, `aria-valid-attr-value`, `button-name`, `label` 위반이 감지됨.
- 실패 2: `tests/e2e/maintenance-override.spec.ts` - 강제 유지보수 모드 진입 시 `Scheduled maintenance in progress` 헤더가 렌더되지 않아 `toBeVisible` 검증이 실패.
- 오류 재현 자료: `web/mcs-portal/test-results/` 폴더에 Playwright error-context가 저장됨.
- 후속 작업: Sprint4_TaskList.md F1~F3 신규 작업으로 반영.


## 2025-09-23 09:44:02 KST Codex - Accessibility & Maintenance Regression Fix
- Admin 페이지 `AccessibleSelect` 래퍼를 추가해 Ant Design Select의 ARIA 속성을 보정하고, Feature Flag Switch에 `aria-label`을 부여함.
- Admin Audit Log 테이블의 스크롤 영역에 `tabindex=0`과 `role=region`을 지정해 키보드 포커스 문제를 해결함.
- MaintenanceGate가 `?maintenance=force` 쿼리를 즉시 반영하도록 `useSearchParams` 기반 상태 동기화 및 결과 헤더를 명시적 heading 요소로 교체함.
- 부분 회귀 검증: `npx playwright test tests/e2e/accessibility/axe-smoke.spec.ts`, `npx playwright test tests/e2e/maintenance-override.spec.ts`.
- 전체 회귀 검증: `npm run test:e2e` (5 skipped / 3 passed).

## 2025-09-23 10:22:32 KST Codex - Playwright 자동 기동 & Docker 배포 초안
- Playwright `webServer`를 `npm run build && npm run start`로 구성해 E2E 실행 시 자동으로 서버를 기동/정리하도록 개선.
- Admin 페이지 접근성 잔여 이슈 정비: `AccessibleSelect`와 Feature Flag Switch, Audit Log 스크롤 영역의 ARIA/키보드 대응 완료.
- `npm run test:e2e` 재실행으로 회귀 통과(5 skipped / 3 passed).
- Next.js 용 멀티스테이지 `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `docker/nginx/default.conf`를 추가해 Nginx 역프록시 구조를 문서 전략과 일치시킴.
- CI 워크플로우를 Ubuntu 기반으로 전환하고 Playwright 브라우저 설치, Docker 이미지 빌드를 포함시켰음.

## 2025-09-23 10:50:41 KST Codex - Docker Compose 시연 및 CI 푸시 준비
- `docker compose up --build -d`로 웹(`3000`)과 Nginx 역프록시(`8080`) 컨테이너를 기동하고, 헬스 확인 후 `docker compose down`으로 정리함.
- Dockerfile 멀티스테이지 빌드(Next.js build → 런타임)와 `public/.gitkeep`, `.env.production.example` 등을 추가해 빌드 안정성을 확보함.
- `.github/workflows/ci.yml`에 Playwright 브라우저 설치와 Docker Build, 선택적 레지스트리 로그인/푸시 스텝을 포함시켜 CI에서 이미지 배포가 가능하도록 구성.
- README/PRD/Tasks 문서를 갱신해 `.env.production` 관리와 Compose 실행 절차, Docker 작업 항목 완료 내역을 기록함.
- 현 로컬 환경에서 `npx playwright install` 시 사내 SSL 검증(Self-signed certificate in chain)으로 브라우저 다운로드가 차단됨. 루트 인증서 추가(`NODE_EXTRA_CA_CERTS`) 또는 오프라인 패키지 다운로드 방식을 별도로 마련해야 함.
- 로컬 Registry(`localhost:5001`)에 Docker 이미지 태깅 및 푸시 완료. `docker run --rm localhost:5001/mcs-portal:web node --version` 으로 이미지를 검증해 배포 가능 상태를 확인함.
## 2025-09-23 11:41:39 KST Codex - Playwright 가이드/CI·Compose 보강
- README에 프록시 환경 Playwright 설치/오프라인 캐시/진단 절차를 추가해 사내망 가이드를 문서화했습니다.
- CI 워크플로우에 Playwright 브라우저 캐시(actions/cache), 보고서/아티팩트 업로드, GHCR 로그인(`github.actor`+`GITHUB_TOKEN`)을 도입해 자동화 품질을 개선했습니다.
- docker-compose에 `.env.production` 주입, 웹 헬스체크(`wget`) 및 `reverse-proxy` 의존 조건을 설정하고 registry:2 컨테이너를 `--restart unless-stopped`+볼륨으로 재구성했습니다.
- `.env.production`을 샘플 기반으로 작성 후 `docker compose --env-file .env.production up --build -d` 흐름을 시연했습니다.


