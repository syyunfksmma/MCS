# Sprint 1 Activity Log — Explorer & History

> 모든 작업 과정과 로그를 기록한다. 필요 시 다이어그램, 코드 스니펫, API 설명을 추가한다.

## 2025-09-21 Codex
- Task 1 완료: Tailwind, PostCSS, Prettier, ESLint 설정 및 README 업데이트.
- `npm run lint` 실행, 경고/오류 없음.


## 2025-09-22 Codex
- Task A2 완료: GitHub Actions CI 워크플로우 생성(.github/workflows/ci.yml).
- Sprint1_CIPlan.md 문서로 파이프라인 요약/향후 계획 기록.
- README에 CI 섹션 추가.
- Lint/Build 검증은 워크플로우에 포함됨.

## 2025-09-22 Codex
- Task B1 진행: `/explorer` SSR 페이지 및 ExplorerShell 구성.
- `src/app/explorer/page.tsx`에서 서버 데이터 로딩(`getExplorerMockData`) 구현.
- `src/app/api/explorer/route.ts` BFF API 생성 및 `src/lib/explorer.ts`에 Mock 데이터 정리.
- `TreePanel`을 데이터 기반으로 리팩터링하고 ExplorerShell에서 선택 상태 Hydration 구현.
- `tsconfig.json`에 `@/*` 경로 alias 추가.
- Lint 재실행 (`npm run lint`) 결과 정상.

## 2025-09-22 Codex
- Task B2 완료: Explorer BFF 구조 확립.
  - `src/lib/env.ts` 추가하여 `MCMS_API_BASE_URL` 환경설정 정리.
  - `src/lib/explorer.ts`에 API 연동 함수(`fetchExplorerData`)와 mock fallback 구현.
  - `/api/explorer` Route가 API/Mock 선택적으로 응답하도록 개선.
  - Explorer 타입(`ExplorerResponse`)에 source 필드 도입, UI에 표시.
- `npm run lint` 재실행 (결과 정상).

## 2025-09-22 Codex
- Task C1 완료: React Query Provider/Hydration 기본 설정.
  - `ReactQueryProvider`와 `HydrateClient` 컴포넌트 추가.
  - 글로벌 레이아웃에서 QueryClientProvider로 앱 래핑.
  - 추후 서버 Prefetch 연동을 위한 기반 마련.
- `npm run lint` 재실행 (정상).

## 2025-09-22 Codex
- Task C2 완료: Explorer 데이터 Prefetch/Hydration 구성.
  - React Query 키(`lib/queryKeys.ts`)와 `useExplorerData` 훅 추가.
  - `/explorer` 페이지에서 QueryClient Prefetch → Hydrate 적용.
  - ExplorerShell이 React Query 데이터를 활용하도록 수정.
- `npm run lint` 재실행 (정상).
- Prefetch/Error 시나리오 메모: `docs/sprint/Sprint1_PrefetchPlan.md` 작성.

- Task D1 진행: Ant Design Tree 컴포넌트 가상 스크롤 활성화 (`virtual`, `height` 설정) 및 레이아웃 높이 조정.
- `npm run lint` 재실행 (정상).

- Task D2 완료: Explorer 요약 카드 및 탭 스켈레톤 강화. 로딩/에러 상태 표시, 요약 그리드/스피너/Alert 적용.
- `npm run lint` 재실행 (정상).

- Task D3 완료: Add-in 상태 배지/히스토리 UI 더미 구성.
  - `AddinBadge` 컴포넌트 추가, ExplorerShell에 Add-in 카드/Timeline 배치.
  - SignalR 연동 시 확장할 수 있도록 안내 문구 포함.
- `npm run lint` 재실행 (정상).

- Task E1 완료: Explorer REST 계약 문서화(`Sprint1_APIContract.md`).

- Task E2 완료: Explorer OpenAPI 발췌(`Sprint1_OpenAPIExcerpt.yaml`) 작성.

- Task F1 진행: Lighthouse/Web Vitals 측정 계획 문서화(`Sprint1_PerformanceBaseline.md`). 로컬 브라우저 실행 제한으로 측정은 Phase 8에서 재시도 예정.

- Task F2 완료: Explorer Telemetry 항목 정의(`Sprint1_TelemetryPlan.md`).

- Task G1 완료: Playwright 스모크 테스트 스텁 추가(`tests/e2e/explorer.spec.ts`), 서버 기동 전까지 skip 처리.
  - `playwright.config.ts` 생성, `npm install -D @playwright/test`, `npm run test:e2e` 스크립트 등록.

- Task G2 완료: Lint/Format 체크 가이드(`Sprint1_CIChecklist.md`) 문서화.

- Task H1 진행: 로그 업데이트 및 Explorer 데이터 플로우 다이어그램(`Sprint1_ExplorerFlow.md`) 추가.

- 2025-09-22 00:41 UTC Codex — Sprint3~7 TaskList & Log 템플릿 생성. 절대 지령 반영 완료.
- 2025-09-26 Codex: GitHub Actions CI workflow retired; internal install builder introduced.
## 2025-09-29 Codex
- Add-in 상태 배지·히스토리 더미 UI 구성(AddinHistoryPanel)을 ExplorerShell에 연결하고 상태 타임라인/이벤트 리스트를 Mock 데이터로 노출.
- 라우팅 선택 여부에 따른 배지 툴팁을 검증하고, SignalR 연동 전까지 HTTP-only 환경에서 표시되는 안내 문구를 추가.
- 스크린샷: (추가 예정) explorer_addin_history_20250929.png — src/components/explorer/AddinHistoryPanel.tsx 기준 렌더링 확인.
