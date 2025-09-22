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

