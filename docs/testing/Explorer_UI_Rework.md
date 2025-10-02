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
> Absolute Directives:
>
> - 각 단계는 승인 후에만 진행한다.
> - 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
> - 오류 발견 시 수정 전에 승인 재요청한다.
> - 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
> - 모든 단계 작업은 백그라운드 방식으로 수행한다.
> - 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
> - 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
> - 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
> - 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
> - 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
> - 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
> - local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
> - 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
> - 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
> - 모든 산출물 소스 코드는 향후 유지 보수, 기능 추가가 용이하도록 주석과 파일 구조를 가질 것.
>   Remaining Tasks: 0

# Explorer UI Rework Testing Log (Wave20 S95)

## 1. 자동화 스크립트 실행 상태

| 시각 (KST)       | 명령                          | 결과 | 비고                                                                |
| ---------------- | ----------------------------- | ---- | ------------------------------------------------------------------- |
| 2025-09-30 08:42 | `pnpm run lint`               | 실패 | `ERR_PNPM_NO_SCRIPT` – lint 스크립트 미정의, package.json 확인 필요 |
| 2025-09-30 08:42 | `pnpm run test:unit -- --run` | 실패 | `ERR_PNPM_NO_SCRIPT` – test:unit 스크립트 미정의                    |

> Action: Sprint21에서 package.json에 lint/test 스크립트 추가 또는 실행 경로 문서화 필요.

## 2. 수동 검증 체크리스트

- Explorer 검색 카드 SLA KPI 값 표시 및 hover/focus 애니메이션 확인
- TreePanel 상태 DOT/Expand/Drag interaction (마우스+키보드) 손 검증
- Preview 카드 Teamcenter 스타일(헤더, 섀도우, sticky) 렌더링 확인
- MenuBar 요구사항 문서화(`docs/design/Explorer_MenuBar_Requirements.md`)와 UI 반영 여부 교차 검증

## 3. Storybook / UI 캡처

- SearchFilterRail: Sticky 컨테이너 및 reset 버튼 동작 (`SearchFilterRail.stories.tsx` → `ScrollableContainer` 스토리 추가)
- TreePanel: 상태 DOT/드래그 핸들/접근성 가이드 확인 (`TreePanel.stories.tsx` → `WithSelection` 스토리)

## 4. 후속 조치

1. package.json에 lint/test 스크립트 추가하고 CI 워크플로우에 통합
2. Search KPI 카드 값(서버/클라이언트 SLA)과 Dashboard KPI 정의 간 상호 참조 테이블 작성 (Sprint21 목표)
3. 3D 뷰어 PoC(서버 메뉴) 시나리오를 위한 기술 스파이크 일정 수립

## Sequential Automation Tasks
1. Playwright @smoke 시나리오 구성
   - Explorer 기본 탐색, CAM replace, Routing Version promote 경로를 `@smoke` 태그로 묶습니다.
   - 테스트 데이터는 `fixtures/explorer-smoke.json`으로 정리하고, 워크스페이스 전환 시 API 응답을 `routeFromHAR`로 고정합니다.
2. Vitest DOM mock 기반 안정화
   - `RoutingDetailModal`과 `ProductDashboardShell` 테스트에 `happy-dom` 기반 mock을 적용하고, 포커스 이동 및 이벤트 타이머를 `@testing-library/user-event`로 일원화합니다.
   - 불안정한 타이머 의존 로직은 `vi.useFakeTimers()`로 고정하고 cleanup 헬퍼를 유틸 함수로 분리합니다.
3. k6 workspace smoke와 연동
   - Playwright smoke 완료 후 `web/mcs-portal/scripts/performance/k6-workspace.js` 스모크 프로필을 호출해 UI와 API 흐름을 한 세션에서 검증합니다.
   - 실행 요약을 `artifacts/testing/k6-integration.json`으로 저장하고, 실패 시 CI 주석으로 바로 노출합니다.
4. Dev certificate import 자동화
   - `scripts/testing/import-dev-cert.ps1`를 작성해 axe 실행 전 루트 인증서를 자동 등록하고, 반복 실행에도 안전하도록 합니다.
   - 실패 시 안내 메시지와 수동 등록 절차 링크를 함께 출력합니다.
5. CI 파이프라인 재정렬
   - 워크플로 순서를 lint → test:unit → test:axe → test:e2e(@smoke) → k6 smoke로 정리하고, 각 단계의 캐시 전략과 실패 시 롤백 절차를 정의합니다.

