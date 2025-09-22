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
- [ ] Tokens export (색상/타이포/spacing 업데이트)
- [ ] Component spec (Padding, states, interaction) 문서 링크
- [ ] Accessibility note (Focus, ARIA, Keyboard) 포함
- [ ] Responsive behavior (최소/최대 width) 명시
- [ ] Asset/Icon 확인 (SVG, License)

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
