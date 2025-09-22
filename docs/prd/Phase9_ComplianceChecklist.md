# Phase 9 산출물 - Compliance 검증 체크리스트

## 1. 접근성 (WCAG 2.1 AA)
- [ ] 키보드 내비게이션 (탭 순서, Focus 표시)
- [ ] 스크린리더 레이블/ARIA 확인 (Explorer, Workspace, Admin)
- [ ] 명도 대비 검사 (Lighthouse, axe)
- [ ] 에러/알림 Live Region 동작 확인
- [ ] 모달/토스트 접근성 검증 (포커스 트랩)

## 2. 보안
- [ ] OWASP ZAP DAST 스캔 (Stage 환경)
- [ ] 인증/인가 테스트 (역할별 접근 제한)
- [ ] CSRF/XSS 보호 확인 (CSP, Sanitization)
- [ ] 로깅/감사 정보 마스킹
- [ ] SSO 로그아웃/토큰 만료 처리 검증

## 3. 브라우저 호환성
- [ ] Chrome 최신 (Windows)
- [ ] Edge 최신 (Windows)
- [ ] Firefox ESR (Windows) - 핵심 플로우 검증
- [ ] Safari 최신 (macOS) - 조회/승인 플로우
- [ ] IE/Legacy: 공식 미지원 안내 배너 확인

## 4. 네트워크/성능 시나리오
- [ ] 저대역폭(3G) 모드 → UI Fallback
- [ ] 오프라인 모드 → Offline 배너 + 재시도
- [ ] SignalR 끊김 → Polling 대체 동작

## 5. 문서화
- [ ] 접근성/보안/브라우저 테스트 결과 캡처 정리
- [ ] 이슈/결과 보고서 작성 → Product Owner 승인

## 6. TODO
- axe DevTools 라이선스 확인
- ZAP 스캔 시간/허용 대상 협의(보안팀)
- macOS 테스트 장비 확보
