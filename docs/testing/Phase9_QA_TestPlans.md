# Phase9 QA Execution Plans (Wave16)

## 1. Component Tests (Product Dashboard / Routing Card / Detail Modal)
- Framework: Vitest + React Testing Library.
- 케이스: empty state, SolidWorks badge, routing status pill, detail modal history tab errors.
- Mock 데이터: `tests/unit/fixtures/routingSamples.ts` 업데이트.

## 2. Playwright End-to-End Flows
- 시나리오: 제품 생성 → 라우팅 업로드 → 레거시 버전 다운로드 → 검색 필터링.
- Test id: `tests/e2e/routing-flows.spec.ts` 확장.
- Artifacts: 영상 캡처, `playwright-report` 보관 경로 `artifacts/e2e/20250929`.

## 3. Cross-Browser Regression (Chromium/Edge/Firefox)
- Drag-and-drop, 파일 업로드, wizard step 이동 확인.
- GitHub Actions matrix job: `ci/routing-ci.yml`에 browser matrix 정의.
- 결과 요약: `reports/wave16/cross-browser-summary.md` 작성 예정.

## 후속
- 테스트 실행 전 환경 정리: `pnpm install`, `pnpm test:unit -- --run`, `pnpm test:e2e`.
- 미완료 항목(Accessibility, CAM UAT)은 Wave17으로 이관.
- 타임라인: Wave16 S38~S40 기록.
