# ML Routing Unit Test Plan (2025-09-29)

## 대상
- Next.js 추천 패널 컴포넌트
- Zustand store / React Query hooks
- FastAPI 서비스 유틸리티 함수

## 툴
- Frontend: Vitest + Testing Library
- Backend: Pytest + coverage

## 주요 케이스
1. 추천 결과 파싱 및 정렬
2. Confidence Badge 색상 로직
3. FastAPI 추천 응답 변환
4. Fallback 메시지 렌더링

## 품질 기준
- 커버리지 80% 이상
- Snapshot 테스트 최소 3건

## 자동화
- GitHub Actions 워크플로우 `ci/ml-unit.yml`
