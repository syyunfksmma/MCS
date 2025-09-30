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

