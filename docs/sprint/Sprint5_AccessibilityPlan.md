# Sprint 5 접근성 & 자동화 계획

## 1. 목표
- axe-core와 Lighthouse를 활용해 Admin/Workspace 주요 화면의 접근성 회귀 검사를 자동화한다.
- Playwright 시나리오에 접근성 검증 단계를 추가하고 CI에서 선택적으로 실행할 수 있도록 스크립트를 제공한다.
- Sprint5 TaskList C1~C3 달성을 위한 체크포인트를 문서화한다.

## 2. 접근성 테스트 전략
1. **Playwright + axe-core**
   - 새 테스트 경로: 	ests/e2e/accessibility/axes-admin.spec.ts
   - 의존성: @axe-core/playwright
   - 검증 대상: /admin, / 기본 화면의 WCAG 위반 여부
   - 스킵 조건: PLAYWRIGHT_A11Y=skip 환경 변수를 통해 CI에서 선택 실행 가능
2. **Lighthouse 접근성**
   - 기존 
pm run perf:lighthouse 스크립트에 접근성 점수 임계치(≥90) 검증을 추가
   - 실패 시 CI 실패 처리
3. **수동 검증 체크리스트**
   - 고대비/키보드 탐색, 오류 메시지 ARIA 라벨, 라이브리전 영역 노출 등

## 3. 작업 항목
- [x] Playwright 접근성 스펙 추가 및 실행 스크립트 작성
- [x] package.json에 	est:axe 스크립트 등록
- [x] UAT 전 접근성 수동 체크리스트(Jira-XXX) 업데이트 (QA 담당자 배정 완료, docs/accessibility/UAT_Manual_Checklist.md)

## 4. 산출물 위치
- 접근성 테스트 코드: web/mcs-portal/tests/e2e/accessibility/*
- 실행 문서: docs/sprint/Sprint5_AccessibilityPlan.md
- 결과 리포트: CI 아티팩트(추가 예정)

## 5. 향후 개선
- 시각 장애 사용자 스크린 리더 테스트(VoiceOver/NVDA) 세션 녹화
- WCAG 2.2 이동성 기준 적용(포커스 표시, 드래그 대체 입력)
- axe 결과를 JUnit(XML) 형태로 변환하여 PR 코멘트 자동화
