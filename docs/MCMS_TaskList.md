# MCMS Web Portal Execution Task List (Next.js Transition)

# 절대 지령
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Phase별 PRD를 재확인하고 범위/위험을 명시한다.
- 선행 단계 산출물에 오류가 있으면 즉시 보고하고 재승인을 득한다.
- 진행 중 변경 사항은 모두 문서화하고 체크리스트를 갱신한다.
- 모든 작업 과정과 로그를 문서에 남기며 필요 시 다이어그램을 추가한다.
- Task List와 체크박스를 유지하며 Sprint 작업에서도 동일하게 준수한다.
- PoC 기준은 1인 기업(1인 개발) 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.

> 절대 지령은 전체 프로젝트와 각 Sprint 작업에 동일하게 적용된다.

## Phase 0 - Alignment & Governance
- [x] 전환 배경 및 기대효과 Executive Deck 작성
- [x] 이해관계자 RACI, 의사결정 플로우 승인
- [x] SSO/보안 정책, Node 호스팅 가이드 합의

## Phase 1 - Requirements & Information Architecture
- [x] 사용자 여정 및 UX 요구사항 재정의
- [x] IA/내비게이션 다이어그램 승인
- [x] 접근성·반응형 가이드 초안 배포

## Phase 2 - Architecture & Hosting
- [x] Next.js + .NET 통합 아키텍처 다이어그램 확정
- [x] IIS Reverse Proxy + Node 서비스 운영 설계 승인
- [x] CI/CD 파이프라인 설계 문서 리뷰 통과

## Phase 3 - Design System & UI Kit
- [x] 디자인 토큰 JSON/TS 모듈 작성
- [x] 핵심 컴포넌트(Button/Table/Modal/Badge) 스캐폴딩
- [x] Figma → 코드 매핑 가이드 배포

## Phase 4 - API Contracts & Integrations
- [x] REST API 소비 가이드(Next.js 관점) 업데이트
- [x] SignalR/SSE 이벤트 규격 문서화
- [x] 대용량 파일 업·다운로드 정책 확정

## Phase 5 - Sprint 1 (Explorer & History)
- [x] Item/Revision/Routing SSR 페이지 구현
- [x] React Query 캐싱/Prefetch 전략 적용
- [x] Add-in 배지 & 히스토리 뷰 UI 완료

## Phase 6 - Sprint 2 (Workspace & Workflow)
- [x] Routing Workspace Drag & Drop 기능 구현
- [x] Add-in Control Panel(큐 모니터링/재시도) 제공
- [x] 승인/반려 코멘트 플로우 통합 테스트

## Phase 7 - Admin & Settings
- [x] API 키·파라미터, AD 롤 매핑 UI 구축
- [x] 감사 로그/모니터링 뷰 구현
- [x] Feature Flag/환경변수 관리 화면 배포

## Phase 8 - Performance & Reliability
- [x] Lighthouse/Web Vitals 측정 및 개선 플랜 수립
- [x] SSR 서버 부하·회복 테스트 수행
- [x] 예외/네트워크 장애 대응 UX 설계

## Phase 9 - QA & UAT
- [x] E2E 테스트 스위트(Cypress/Playwright) 작성 및 실행
- [x] UAT 시나리오 수행 및 피드백 반영 계획 수립
- [x] 접근성/보안/브라우저 호환성 검증 완료

## Phase 10 - Deployment & Operations
- [x] IIS + Node 배포 스크립트/Runbook 작성
- [x] 롤백 전략(Blue/Green 또는 Canary) 문서화
- [x] 모니터링/알람 대시보드 개편 및 검증

## Phase 11 - Documentation & Training
- [x] 사용자/운영 매뉴얼 업데이트 (웹 기준)
- [x] 교육 자료(동영상, 가이드) 제작 및 세션 진행
- [x] 전환 결과 보고 및 후속 개선 로드맵 수립
