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
# Phase 3 산출물 - Figma → 코드 핸드오프 가이드

## 1. 프로세스 개요
1. 디자이너가 Figma에서 컴포넌트/화면 설계
2. Figma Tokens 플러그인으로 디자인 토큰 JSON export → Git 저장소 commit
3. Storybook/Next.js 개발자는 tokens.json → Tailwind config 반영 (`pnpm run sync:tokens`)
4. Figma Variants ↔ Storybook 컴포넌트 Documentation 링크 유지
5. 변경 사항 리뷰: Design Review(Teams 회의, 주 1회), Dev Review(Storybook PR)

## 2. Figma 관리 규칙
- 파일 구조: `DesignSystem/` (Tokens, Components), `Screens/` (Flows별)
- Naming convention: `Component/Variant/State` (예: `Button/Primary/Disabled`)
- Auto Layout, constraints 설정 필수 (반응형 대응 검증)
- 라이브러리 퍼블리시 주기: 주 1회, 릴리즈 노트 공유

## 3. 개발 핸드오프 체크리스트
- ~~Tokens export (색상/타이포/spacing 업데이트)~~ (2025-09-29 Codex, web/mcs-portal/src/styles/tokens.ts & docs/prd/Phase3_TokensComponents.md)
- ~~Component spec (Padding, states, interaction) 문서 링크~~ (2025-09-29 Codex, docs/design/ExplorerRibbon_FinalSpec.md)
- ~~Accessibility note (Focus, ARIA, Keyboard) 포함~~ (2025-09-29 Codex, docs/design/Skeleton_Loading_Standards.md#accessibility)
- ~~Responsive behavior (최소/최대 width) 명시~~ (2025-09-29 Codex, docs/design/ExplorerRibbon_FinalSpec.md#responsive)
- ~~Asset/Icon 확인 (SVG, License)~~ (2025-09-29 Codex, docs/design/ExplorerRibbon_FinalSpec.md#assets)

## 4. 협업 도구
- Design review: Figma Comment + Teams 회의
- 개발 Issue: Jira 티켓 (Design Ready → Dev Ready)
- 문서: Confluence 페이지 `MCMS/DesignSystem`
- 버전 관리: tokens, 컴포넌트 specs → Git(`/docs/design-system/`)

## 5. 승인 흐름
1. 디자이너 → Product Owner 디자인 승인 요청
2. Product Owner 승인 후 Jira 티켓 `Dev Ready` 전환
3. 개발자는 Storybook 브랜치에서 구현 → PR + Storybook preview 공유
4. 디자이너/QA 리뷰 후 Merge

## 6. 기타
- 비동기 커뮤니케이션을 위한 Slack/Teams 채널 `#mcms-design-dev`
- 긴급 수정: Hotfix 브랜치 사용, Figma 주석으로 변경 사항 표시
- 실험적 컴포넌트는 `labs/` 네임스페이스로 구분

