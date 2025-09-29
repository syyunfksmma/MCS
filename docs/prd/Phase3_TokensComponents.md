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
# Phase 3 산출물 - 디자인 토큰 & 컴포넌트 세부 정의

## 1. 색상 토큰 (예시)
```json
{
  "color": {
    "primary": "#2F6FED",
    "primary-dark": "#1D4ED8",
    "secondary": "#22B8CF",
    "accent": "#FACC15",
    "danger": "#EF4444",
    "success": "#22C55E",
    "warning": "#F97316",
    "neutral-0": "#FFFFFF",
    "neutral-100": "#F3F4F6",
    "neutral-500": "#6B7280",
    "neutral-900": "#111827"
  }
}
```

## 2. 타이포그래피 스케일
| Token | 크기 | 용도 |
|---|---|---|
| heading-xl | 28px / 40px | Page Title |
| heading-lg | 22px / 32px | Section Header |
| heading-md | 18px / 28px | Card Title |
| body-lg | 16px / 24px | 기본 본문 |
| body-sm | 14px / 20px | 보조 텍스트 |
| caption | 12px / 16px | 라벨/설명 |

## 3. 컴포넌트 설계 노트
### Button
- Variants: Primary, Secondary, Ghost, Destructive
- States: Default, Hover, Active, Disabled, Loading
- Icon Support: Leading/Trailing Icon, Icon-only 버튼
- 접근성: aria-label (Icon-only), focus-visible 스타일

### Table
- 기능: Column sort, filter, row selection, virtual scroll(>1000 rows)
- Row 상태: Draft/Approved/Rejected/Failed(A/B 배지 포함)
- Empty/Error states: 안내 메시지 + Call-to-action

### Badge
- 유형: Success(완료), Danger(실패), Warning(대기), Info(진행 중)
- 크기: sm(12px), md(16px)
- Add-in 배지: Tooltip에 메시지 표시

### Modal/Drawer
- Modal: 작업 확인, 설정 변경. ESC, outside click dismiss 옵션
- Drawer: Routing 상세 패널(우측 슬라이드)
- Layout: Header(타이틀/Close), Body(scroll), Footer(Action)

### Tabs
- Tabs + Panels. Routing Workspace 탭: Stages, Files, Approval, Add-in, History
- 키보드 내비게이션: Arrow key 이동, Tab 활성화 on Enter/Space

### Form
- Validation: inline message, summary toast, ARIA-describedby
- File Upload: Drag & Drop, progress, chunk upload 표시

## 4. 스타일 가이드 라인
- Shadow: Card `0 4px 16px rgba(17,24,39,0.1)`, Modal `0 10px 30px rgba(17,24,39,0.2)`
- Radius: Button 8px, Card 12px, Modal 16px
- Animation: Transition 150ms ease-in-out, Skeleton shimmer 1200ms linear

## 5. Storybook 작업 우선순위
1. Button, Badge → 상태 & 접근성 검증
2. Table → Column 설정, Empty/Error state
3. Modal/Drawer → Layout, Responsive
4. Tabs → Routing Workspace 탭 구조
5. Toast/Alert → Global 피드백 패턴

## 6. TODO
- 아이콘 패키지 확정(Phosphor 예상)
- Design token 자동 동기화(Style Dictionary 도입 여부)
- 다크 모드/고대비 지원 기준 논의


> Updated 2025-09-29 Codex — Synced with web/mcs-portal/src/styles/tokens.ts
