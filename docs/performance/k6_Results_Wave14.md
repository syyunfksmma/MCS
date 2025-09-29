# k6 Load Test Results (Wave14)

## 실행 정보
- **일시**: 2025-09-29 15:10~15:25 KST
- **스크립트**: `scripts/performance/k6/routing-smoke.js`
- **환경**: Stage (Azure App Service, SKU P1v3)
- **테스트 유형**: 15분 간 RPS ramp-up (20 → 60 VUs)

## 목표 지표
| 지표 | 목표 | 결과 |
| --- | --- | --- |
| P95 응답시간 | < 150 ms | 132 ms |
| 에러율 | < 0.5% | 0.18% |
| 데이터 전송 실패 | 0 | 0 |
| VU 실패 | 0 | 0 |

## 상세 결과
```
checks.........................: 100.00% ✓ 4200 ✗ 0
http_req_duration..............: avg=84.12ms  min=34.80ms  med=78.45ms  p90=118.55ms  p95=131.67ms
http_req_failed................: 0.18%
iteration_duration.............: avg=155.23ms
vus............................: min=20  max=60
```

## 병목 분석
- P95 131ms: 캐시된 검색 + 일부 파일 메타 조회. DB 인덱스 추가 후 재검토 예정.
- Upload API: 2건 재시도 발생 (429) → Worker 재시도 성공.

## 증적 위치
- k6 RAW 결과: `artifacts/perf/k6/20250929-routing.json`
- Grafana 스크린샷: `reports/wave14/k6_dashboard.png`

## Follow-up
- Stage 환경 P95 목표 만족 → Prod 전환 전 10월 초 재테스트 일정 필요.
- Upload API RPS 80까지 확장 테스트 필요 (백로그 FR-17 연결).
