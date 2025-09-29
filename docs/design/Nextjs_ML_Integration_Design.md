# Next.js · ML 통합 UX/흐름 설계

## 개요
- Next.js Web Portal에서 ML 추천 서비스를 호출/표시하는 UX 흐름 정의.

## 사용자 흐름
1. Explorer에서 Routing 생성 버튼 클릭
2. ML 추천 패널 자동 노출 (우측 Drawer)
3. 추천 리스트에서 항목 선택 → 세부 정보 (예상 시간, 신뢰도)
4. 사용자 확정 시 API 호출 `/api/ml/recommendations/{id}/accept`
5. 결과를 Routing Form에 반영 후 저장

## 기술 구성
- Next.js App Router + React Query (ML 추천 캐시)
- API Gateway: `/api/ml/*` → FastAPI 서비스 프록시
- 이벤트 추적: Application Insights + Custom Event `ml_recommendation_used`

## UI 요소
- Drawer 컴포넌트: `components/ml/RecommendationDrawer.tsx`
- 신뢰도 표시: Progress + 색상 그라데이션
- Fallback: 추천 없음 시 안내 문구 + 수동 입력 CTA

## 보안/성능 고려
- Feature Flag `feature.ml-routing`
- 요청당 Timeout 800ms, 3회 재시도
- 민감 데이터 마스킹 (작업자 이름 해시)

## 후속 작업
- 디자인 시안 Storybook 업로드 (2025-09-30)
- API 스키마 확정 후 타입 생성 (`scripts/generate-ml-clients.ts`)
- A/B 테스트 계획 수립 (Wave16)
