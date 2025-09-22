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
