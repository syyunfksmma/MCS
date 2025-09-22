# Sprint 5 Activity Log — QA & UAT

> 모든 작업 과정과 로그를 기록한다. UAT 피드백/테스트 결과를 상세히 남긴다.

## 2025-09-22 Codex
- Sprint5 접근성 계획 수립 및 문서화(Sprint5_AccessibilityPlan.md).
- Playwright axe 스모크 테스트(	ests/e2e/accessibility/axe-smoke.spec.ts), 
pm run test:axe 스크립트 추가.
- Lighthouse CI 가드(scripts/performance/assert-lighthouse.mjs, 
pm run perf:lighthouse:ci) 도입.
- Web Vitals → Grafana 파이프라인 초안(Sprint5_MonitoringPlan.md).
- 메인터넌스 강제 모드 Playwright 시나리오(maintenance-override.spec.ts) 작성 및 게이트 개선.
