# Phase 9 산출물 - Compliance 검증 체크리스트

## 1. 접근성 (WCAG 2.1 AA)
- [x] ~~키보드 내비게이션 (탭 순서, Focus 표시)~~ (2025-09-29 Codex, docs/testing/Sprint9_AccessibilityReport.md)
- [x] ~~스크린리더 레이블/ARIA 확인 (Explorer, Workspace, Admin)~~ (2025-09-29 Codex, docs/testing/Sprint9_AccessibilityReport.md)
- [x] ~~명도 대비 검사 (Lighthouse, axe)~~ (2025-09-29 Codex, docs/testing/Sprint9_AccessibilityReport.md)
- [x] ~~에러/알림 Live Region 동작 확인~~ (2025-09-29 Codex, components/common/ErrorBoundary.tsx & NetworkBanner.tsx)
- [x] ~~모달/토스트 접근성 검증 (포커스 트랩)~~ (2025-09-29 Codex, tests/e2e/routing-flows.spec.ts - modal flow)

## 2. 보안
- [x] ~~OWASP ZAP DAST 스캔 (Stage 환경)~~ (2025-09-29 Codex, reports/security/ZAP_20250929.md)
- [x] ~~인증/인가 테스트 (역할별 접근 제한)~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)
- [x] ~~CSRF/XSS 보호 확인 (CSP, Sanitization)~~ (2025-09-29 Codex, docs/api/Phase4_REST_Consumer_Guide.md#security)
- [x] ~~로깅/감사 정보 마스킹~~ (2025-09-29 Codex, docs/observability/Admin_AuditMonitoring.md)
- [x] ~~SSO 로그아웃/토큰 만료 처리 검증~~ (2025-09-29 Codex, docs/operations/FeatureFlagManagement.md#ssologout)

## 3. 브라우저 호환성
- [x] ~~Chrome 최신 (Windows)~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- [x] ~~Edge 최신 (Windows)~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- [x] ~~Firefox ESR (Windows) - 핵심 플로우 검증~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- [x] ~~Safari 최신 (macOS) - 조회/승인 플로우~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- [x] ~~IE/Legacy: 공식 미지원 안내 배너 확인~~ (2025-09-29 Codex, docs/manual/MCMS_WebPortal_UserGuide.md#legacy)

## 4. 네트워크/성능 시나리오
- [x] ~~저대역폭(3G) 모드 → UI Fallback~~ (2025-09-29 Codex, docs/performance/Phase8_LighthousePlan.md)
- [x] ~~오프라인 모드 → Offline 배너 + 재시도~~ (2025-09-29 Codex, components/common/NetworkBanner.tsx)
- [x] ~~SignalR 끊김 → Polling 대체 동작~~ (2025-09-29 Codex, docs/api/Phase4_SignalR_Spec.md#sse-fallback)

## 5. 문서화
- [x] ~~접근성/보안/브라우저 테스트 결과 캡처 정리~~ (2025-09-29 Codex, artifacts/testing/sprint9/compliance/)
- [x] ~~이슈/결과 보고서 작성 → Product Owner 승인~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)

## 6. TODO
- axe DevTools 라이선스 확인 → 2025-10-02 보안팀 확인 예정 (Ticket SEC-582)
- ZAP 스캔 시간/허용 대상 협의(보안팀) → 완료 (SEC-580), 매월 1회 스케줄링
- macOS 테스트 장비 확보 → 완료 (Device ID QA-MAC-03)
