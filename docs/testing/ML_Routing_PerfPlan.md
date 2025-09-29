# ML Routing Performance Test Plan (2025-09-29)

## 목표
- 10~30개 추천 요청에 대한 응답 시간을 검증 <= 400ms P95.

## 도구
- k6 스크립트 `scripts/performance/k6/ml-routing.js`
- 시나리오: 5분 Ramp (10→30 VUs), 10분 Steady

## 메트릭
- HTTP req duration, Error rate, Recommendation cache hit ratio.
- 백엔드 로깅: FastAPI latency, Redis hit/miss.

## 성공 기준
- P95 350ms 이하
- Error rate < 0.5%

## 보고
- 결과 `reports/wave18/ml_performance_results.md`

