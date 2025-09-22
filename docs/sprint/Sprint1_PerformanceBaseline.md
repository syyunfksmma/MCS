# Sprint 1 - 성능 베이스라인

## 측정 시나리오 (계획)
1. `npm run build` → `npm run start` (Production 모드)
2. `lighthouse http://localhost:3000/explorer --preset=desktop --quiet --output=json`
3. 주요 지표 추출: LCP, FID, CLS, TTFB

## 현재 상태
- 로컬 자동화 환경에서 브라우저 실행 권한이 제한되어 Lighthouse 실행은 보류.
- 빌드 결과와 라우팅 구조가 마련되어 있어 추후 측정 시 자동 스크립트로 연결 예정.

## TODO
- CI 파이프라인에 Lighthouse CI 또는 WebPageTest 에이전트 연결 (Phase 8)
- Explorer 초기 렌더링 컴포넌트 수를 기반으로 TTFB 목표 검증
