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
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
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
# Sprint6/7 UX 테스트 착수 계획
## 절대 지령
- 기존 내용을 삭제하지 않고 문서 하단 "수정 이력"에 기록한다.
- Storybook/Playwright 산출물은 Sprint6/7 Task List의 E·F 항목과 연결해 로그에 남긴다.
- 모든 측정치는 Sprint6_Routing_Log.md 또는 Sprint7_Log.md에 추가한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강

## 1. Storybook Kickoff (Sprint6 E1~E2)
| 단계 | 액션 | 산출물 |
|------|------|---------|
| 1 | `npx storybook@latest init --builder vite` 실행 (web/mcs-portal) | `.storybook` 구성, package.json script `storybook` |
| 2 | 디자인 토큰 매핑: `styles/tokens.css`에서 GUI 참조 이미지(`docs/design/reference/gui_reference*.jpg`) 컬러 추출 | Storybook preview.ts 스타일 주입 |
| 3 | RibbonBar/FilterRail 컴포넌트 스토리 초안 | `stories/explorer/RibbonBar.stories.tsx` |
| 4 | `@storybook/addon-a11y`, `@storybook/addon-interactions` 추가 | 접근성/상호작용 패널 |
| 5 | CI 파이프라인 연동 계획 | Github Actions `storybook-build` 잡 초안 |

## 2. Playwright Regression (Sprint7 E3, Sprint7 F1~F3)
- 대상 시나리오: ExplorerShell Hover Quick Menu, Ribbon 권한 토글, Workspace Upload 병렬 진행률.
- 테스트 파일 구조: `tests/e2e/explorer/hover-menu.spec.ts`, `tests/e2e/workspace/upload-parallel.spec.ts`.
- 확장 계획: Storybook의 `@storybook/test-runner`와 Playwright를 연동해 시각 회귀 캡처.
- SLA 검증: 업로드 시나리오에서 `page.on('response')` 후킹으로 `/files/chunks` 요청 시간을 수집 → Sprint 로그에 `observedMs` 기록.

## 3. 로깅 & 보고
- Storybook 실행/빌드 결과는 `docs/sprint/Sprint6_Routing_Log.md` Ops 행에 링크로 남긴다.
- Playwright 회귀 시나리오는 `docs/sprint/Sprint7_TaskList.md` 로그 구역에 불릿 상태 갱신로 반영한다.
- 실패/차단 사유 발생 시 Sprint6_Routing_Log.md Notes 필드에 구체적 오류와 재시도 계획을 기록한다.

## 수정 이력
- 2025-09-25 Codex: Storybook/Playwright 착수 계획 초안 작성.

