# Phase 3 산출물 - Design System 개요

## 1. 디자인 토큰 체계
| 카테고리 | 정의 | 예시 |
|---|---|---|
| 색상 | Primary/Secondary/Accent/Neutral/State | `--color-primary: #2F6FED`, `--color-success: #22C55E` |
| 타이포 | Font family, size scale, weight | `font-heading: "Noto Sans KR", 600`, `font-body: 16px` |
| Spacing | 4pt 하위 배수 | `space-1: 4px`, `space-2: 8px`, ..., `space-8: 32px` |
| Radius | 모서리 반경 | `radius-sm: 4px`, `radius-lg: 12px` |
| Shadow | 컴포넌트 깊이 표현 | `shadow-card`, `shadow-dialog` |

- 토큰 저장: `/src/styles/tokens.json`, Tailwind config에 매핑
- 다크 모드/고대비 모드 토큰 Phase 6에서 확장 예정

## 2. 컴포넌트 카탈로그 (최소 스캐폴딩)
| 컴포넌트 | 설명 | 상태 |
|---|---|---|
| Button | Primary/Secondary/Link, Icon 지원 | [33m스캐폴드 필요[0m |
| Table/Grid | 가상 스크롤, 정렬, 선택 | [33m설계 필요[0m |
| Badge/Tag | 상태 표시(승인/실패/대기/오류) | [33m토큰 적용[0m |
| Modal/Drawer | 라우팅 상세/설정 패널 | [33m레이어 규칙 정의[0m |
| Tabs | Workspace 탭 (Stages/Files/Approval/Add-in) | [33m실습 필요[0m |
| Toast/Alert | 성공/오류 피드백 | [33mUX 문구 정의[0m |
| Form Controls | Input, Select, DatePicker | [33m밸리데이션 상태 포함[0m |
| Tree | Item/Revision/Routing 트리 | Virtualized Tree 검토 |

- 구현 전략: 베이스 컴포넌트(Headless UI) + Tailwind + Storybook 문서화

## 3. Storybook & 문서화 계획
- Storybook 8.x 도입, Chromatic 대안 검토 (사내망이라 온프레 설치 필요)
- 컴포넌트별 Docs/Controls 작성, 디자인 토큰 변형 예시 표시
- Testing: Storybook Interaction + Jest/React Testing Library 스냅샷

## 4. 디자이너-개발자 워크플로우
- Figma 파일: `/Teams/MCMS/DesignSystem/NextPortal.fig`
- 디자인 토큰: Figma Tokens 플러그인 → JSON Export → Git 커밋
- 컴포넌트: Figma Variants → Storybook with addon-figma 링크
- 주간 Design/Dev Sync 회의, Jira 티켓 템플릿 정의

## 5. TODO / 리스크
- Tailwind + Mantine/Ant Design 혼합 여부 결정
- 아이콘 세트(Phosphor vs Fluent) 확정
- 반응형 Table 가이드(모바일 대응) 검토
