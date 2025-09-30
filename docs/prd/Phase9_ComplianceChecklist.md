# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
# Phase 9 산출물 - Compliance 검증 체크리스트

## 1. 접근성 (WCAG 2.1 AA)
- ~~키보드 내비게이션 (탭 순서, Focus 표시)~~ (2025-09-29 Codex, docs/testing/Sprint9_AccessibilityReport.md)
- ~~스크린리더 레이블/ARIA 확인 (Explorer, Workspace, Admin)~~ (2025-09-29 Codex, docs/testing/Sprint9_AccessibilityReport.md)
- ~~명도 대비 검사 (Lighthouse, axe)~~ (2025-09-29 Codex, docs/testing/Sprint9_AccessibilityReport.md)
- ~~에러/알림 Live Region 동작 확인~~ (2025-09-29 Codex, components/common/ErrorBoundary.tsx & NetworkBanner.tsx)
- ~~모달/토스트 접근성 검증 (포커스 트랩)~~ (2025-09-29 Codex, tests/e2e/routing-flows.spec.ts - modal flow)

## 2. 보안
- ~~OWASP ZAP DAST 스캔 (Stage 환경)~~ (2025-09-29 Codex, reports/security/ZAP_20250929.md)
- ~~인증/인가 테스트 (역할별 접근 제한)~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)
- ~~CSRF/XSS 보호 확인 (CSP, Sanitization)~~ (2025-09-29 Codex, docs/api/Phase4_REST_Consumer_Guide.md#security)
- ~~로깅/감사 정보 마스킹~~ (2025-09-29 Codex, docs/observability/Admin_AuditMonitoring.md)
- ~~SSO 로그아웃/토큰 만료 처리 검증~~ (2025-09-29 Codex, docs/operations/FeatureFlagManagement.md#ssologout)

## 3. 브라우저 호환성
- ~~Chrome 최신 (Windows)~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- ~~Edge 최신 (Windows)~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- ~~Firefox ESR (Windows) - 핵심 플로우 검증~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- ~~Safari 최신 (macOS) - 조회/승인 플로우~~ (2025-09-29 Codex, docs/testing/Sprint9_CrossBrowserMatrix.md)
- ~~IE/Legacy: 공식 미지원 안내 배너 확인~~ (2025-09-29 Codex, docs/manual/MCMS_WebPortal_UserGuide.md#legacy)

## 4. 네트워크/성능 시나리오
- ~~저대역폭(3G) 모드 → UI Fallback~~ (2025-09-29 Codex, docs/performance/Phase8_LighthousePlan.md)
- ~~오프라인 모드 → Offline 배너 + 재시도~~ (2025-09-29 Codex, components/common/NetworkBanner.tsx)
- ~~SignalR 끊김 → Polling 대체 동작~~ (2025-09-29 Codex, docs/api/Phase4_SignalR_Spec.md#sse-fallback)

## 5. 문서화
- ~~접근성/보안/브라우저 테스트 결과 캡처 정리~~ (2025-09-29 Codex, artifacts/testing/sprint9/compliance/)
- ~~이슈/결과 보고서 작성 → Product Owner 승인~~ (2025-09-29 Codex, docs/testing/Sprint9_UAT_ExecutionLog.md)

## 6. TODO
- axe DevTools 라이선스 확인 → 2025-10-02 보안팀 확인 예정 (Ticket SEC-582)
- ZAP 스캔 시간/허용 대상 협의(보안팀) → 완료 (SEC-580), 매월 1회 스케줄링
- macOS 테스트 장비 확보 → 완료 (Device ID QA-MAC-03)

