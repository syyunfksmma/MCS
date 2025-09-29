# MCMS Web Portal Execution Task List (Next.js Transition)

# 절대 조건
- 각 단계는 사용자 승인 후에만 착수한다.
- 단계 착수 전 Phase별 PRD를 재확인하고 범위/위험을 명시한다.
- 선행 단계 산출물에 오류가 있으면 즉시 보고하고 재승인을 득한다.
- 진행 중 변경 사항은 모두 문서화하고 체크리스트를 갱신한다.
- 문서, 코드, 배포 로그 등 모든 산출물은 사내 저장소에 보관한다.

> Approval required before starting each phase.

## Phase 0 - Alignment & Governance
- [x] ~~전환 배경, 범위, 기대효과 요약본(Executive Deck) 작성~~ (2025-09-29 Codex, docs/Phase0_ExecutiveDeck.md)
- [x] ~~이해관계자 RACI 및 의사결정 트랙 승인 완료~~ (2025-09-29 Codex, docs/Phase0_RACI.md)
- [x] ~~SSO/보안 정책, Node 호스팅 가이드 합의~~ (2025-09-29 Codex, docs/Phase0_SSO_NodeHostingGuide.md)

## Phase 1 - Requirements & Information Architecture
- [x] ~~웹 UX 요구사항 수집 및 사용자 여정 재정의~~ (2025-09-29 Codex, docs/Phase1_Requirements.md#7-2025-09-29-ux-requirement-workshop-summary)
- [ ] 네비게이션/IA 다이어그램 승인
- [ ] 접근성/반응형 가이드 초안 배포

## Phase 2 - Architecture & Hosting
- [ ] Next.js + .NET 통합 아키텍처 다이어그램 확정
- [ ] IIS Reverse Proxy + Node 서비스 운영 설계 승인
- [ ] CI/CD 파이프라인(빌드/테스트/배포) 설계서 리뷰 통과

## Phase 3 - Design System & UI Kit
- [ ] 디자인 토큰 JSON/TS 모듈 작성
- [ ] 공통 컴포넌트(버튼, 테이블, 모달, 배지) 코드 스캐폴딩
- [ ] Figma 핸드오프 및 코드 매핑 가이드 배포

## Phase 4 - API Contracts & Integrations
- [ ] REST API 소비자 가이드 업데이트(Next.js 관점)
- [ ] SignalR/SSE 이벤트 규격 문서화
- [ ] 대용량 파일 업로드/다운로드 정책 확정

## Phase 5 - Sprint 1 (Explorer & History)
- [ ] Item/Revision/Routing SSR 페이지 구현 및 테스트
- [ ] React Query 캐싱 전략/Prefetch 구성
- [ ] Add-in 배지 & 히스토리 뷰 UI 완료

## Phase 6 - Sprint 2 (Workspace & Workflow)
- [ ] Routing Workspace Drag & Drop 기능 구현
- [ ] Add-in Control Panel(큐 모니터링, 재시도) 제공
- [ ] 승인/반려 코멘트 플로우 통합 테스트

## Phase 7 - Admin & Settings
- [ ] API 키, 파라미터, AD 롤 매핑 UI 구축
- [ ] 감사 로그/감시 뷰 구현
- [ ] Feature Flag / 환경변수 관리 화면 배포

## Phase 8 - Performance & Reliability
- [ ] Lighthouse/Web Vitals 측정 및 개선 플랜 수립
- [ ] SSR 서버 로드/회복 테스트 수행
- [ ] 예외/네트워크 장애 대응 UX 설계

## Phase 9 - QA & UAT
- [ ] E2E 테스트 스위트(Cypress/Playwright) 작성 및 실행
- [ ] UAT 시나리오 수행, 피드백 수집/반영 계획 수립
- [ ] 접근성/보안/브라우저 호환성 검증 완료

## Phase 10 - Deployment & Operations
- [ ] IIS + Node 배포 스크립트/Runbook 작성
- [ ] 롤백 전략(Blue/Green or Canary) 문서화
- [ ] 모니터링/알람 대시보드 개편 및 검증

## Phase 11 - Documentation & Training
- [ ] 사용자/운영 매뉴얼 업데이트 (웹 기준)
- [ ] 교육 자료(동영상, 가이드) 제작 및 세션 진행
- [ ] 전환 결과 보고 및 후속 개선 로드맵 수립

