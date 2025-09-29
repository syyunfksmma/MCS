# OWASP ZAP Scan Summary (Placeholder)

- Date: 2025-09-29
- Command: `zap-baseline.py -t http://localhost:3100 -r zap-report-20250929.html`
- Status: Scheduled after HTTP-only staging deployment.

| 카테고리 | 예상 결과 |
| --- | --- |
| 인증/인가 | Windows Auth로 인한 인증 필요, Baseline은 401 허용 |
| XSS | Form/검색 입력 필터 확인 예정 |
| CSRF | POST 엔드포인트 탐지 후 로그 분석 |

Raw HTML 보고서는 `web/mcs-portal/test-results/security/zap-report-20250929.html`로 저장 예정.
