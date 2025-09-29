# ML Routing Next.js Baseline Implementation Plan (2025-09-29)

## 목표
- Next.js 앱에 ML 추천 기능을 위한 기본 레이아웃과 폴더 구조를 마련한다.

## 구조
- `src/app/ml/layout.tsx`: 추천 패널 포함 기본 레이아웃.
- `src/app/ml/page.tsx`: 실험용 페이지, 서버 컴포넌트에서 데이터 Prefetch.
- State 관리: React Query + Zustand 하이브리드 (`useMlRecommendationStore`).
- Route Protection: Feature flag `feature.ml-routing` 사용.

## 빌드/배포
- dynamic import 활용 → SSR 지원.
- 환경 변수: `NEXT_PUBLIC_ML_API_BASE`.

## 후속
- Storybook 스토리 추가 (`stories/ml/RecommendationPanel.stories.tsx`).
- Lint/Type check 스크립트 업데이트 예정.
