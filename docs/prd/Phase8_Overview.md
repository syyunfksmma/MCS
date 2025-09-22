# Phase 8 산출물 - Performance & Reliability 개요

## 목표
- Lighthouse/Web Vitals 측정 및 개선 플랜 수립
- SSR 서버 부하/회복 테스트 계획 정의
- 예외/네트워크 장애 대응 UX 시나리오 정리

## 산출물
- `Phase8_PerformancePlan.md`
- `Phase8_LoadRecoveryPlan.md`
- `Phase8_ResilienceUX.md`

## 기간 (예상)
- Sprint 4: 2026-01-06 ~ 2026-01-24

## 성공 지표
- Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- 부하 테스트: 500rps 까지 에러율 < 1%
- 장애 대응: Failover/재시작 15분 이내 완료

## 위험
- 사내망 특성으로 실제 사용자 환경과 시험 환경 차이
- SSR 캐시/Prefetch가 성능 측정에 영향
- 장애 대응 자동화 미흡으로 복구 지연 가능성
