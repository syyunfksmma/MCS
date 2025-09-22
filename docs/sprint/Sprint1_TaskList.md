# Sprint 1 Checklist — Explorer & History

## 절대 지령
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 Sprint 작업에서도 절대 지령을 동일하게 준수한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.

> 이 문서는 Sprint 1 진행 상황과 로그를 함께 관리한다.

## 작업 목록
### A. 환경 & 빌드 구성
- [x] A1. Next.js 프로젝트 스캐폴딩 및 기본 도구 설정 (Tailwind/ESLint/Prettier 등)
- [x] A2. npm 스크립트/CI 파이프라인 초안 정리 (`dev`, `build`, `lint`, `format` 점검)

### B. SSR & BFF 골격
- [x] B1. `/explorer` 페이지 SSR/Hydration 골격 구성 (App Router)
- [x] B2. Explorer용 BFF(API Route) 기본 구조 및 타입 정의 (Mock 응답 포함)

### C. 데이터 & 상태 관리
- [x] C1. React Query Provider/Hydration 설정, 캐시 키 구조 정의
- [x] C2. Item/Revision Mock 데이터 Prefetch 및 에러 처리 시나리오 초안

### D. UI/UX 스켈레톤
- [x] D1. Explorer 트리(가상 스크롤) 레이아웃 기본 구현
- [x] D2. Routing 요약 카드 + 탭 레이아웃 스켈레톤
- [ ] D3. Add-in 상태 배지·히스토리 섹션 더미 UI 배치

### E. API/문서 연동
- [x] E1. Explorer 관련 REST 엔드포인트 계약 검토 및 BFF ↔ API 매핑 문서화
- [x] E2. Swagger/OpenAPI 샘플 추출 및 README/API 참고 문서 업데이트

### F. 성능 & 관측
- [x] F1. Lighthouse/Web Vitals 초기 측정 및 베이스라인 기록 (계획 문서화)
- [x] F2. 로그/Telemetry 수집 항목 정의(Explorer 페이지)

### G. 테스트 & 검증
- [x] G1. Playwright/Cypress 스모크 테스트 스텁 추가 (로그인 + Explorer 로딩)
- [x] G2. `npm run lint`/`npm run format` CI 체크 안내 문서화

### H. 문서 & 로그
- [x] H1. Sprint1_Log.md에 단계별 진행 로그 및 필요한 다이어그램/코드 스니펫 추가

## 로그 기록
- (예) 2025-09-21 Codex — Task A1 완료, Tailwind/Prettier 설정 및 lint 검증 통과.
