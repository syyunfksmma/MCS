# Phase 1 산출물 - 접근성 & 반응형 가이드 초안

## 1. 접근성 (WCAG 2.1 AA 기준)
- **키보드 내비게이션**: 모든 인터랙티브 요소 tabindex 명시, Skip to content 링크 제공
- **스크린리더**: Landmark(role=main/nav/banner), ARIA 레이블, 트리/테이블 ARIA 속성
- **명도 대비**: 텍스트 대비 4.5:1 이상, 버튼/배지 대비 3:1 이상
- **포커스 스타일**: Tailwind focus-visible 유틸 + 커스텀 윤곽선(색상 #1D4ED8)
- **에러/피드백**: 시각+텍스트+아이콘 제공, 스크린리더용 Live Region 적용
- **양식**: 라벨 연결, 도움말/에러 메시지 함께 읽히도록 aria-describedby 사용
- **표/그리드**: Header row/column, aria-sort, aria-busy 등 상태 전달

## 2. 반응형 가이드
| Breakpoint | 레이아웃 가이드 |
|---|---|
| ≥1440px | 3열(사이드바 + 메인 + 컨텍스트 패널), 고정 폭 카드 |
| 1280–1439px | 사이드바 축소(아이콘 모드), 컨텍스트 패널 오버레이 |
| 1024–1279px | 2열 구조, 트리/세부 정보 탭 전환, 그래프 Stack |
| 768–1023px | 중요한 카드 우선, 테이블 가로 스크롤, 사이드바 Drawer |
| <768px | 모바일 대응 검토 대상(Phase 6 이후 결정) |

- Typography: 기본 16px, 타이틀/헤더 상대 단위(rem), 최소 줄간격 1.4
- Grid: 12-column CSS Grid, Gap 16px, Container 1200px (Desktop)
- 스켈레톤: 카드/테이블 로딩 시 width/height 고정 유지

## 3. 성능 고려
- Critical CSS inlining (Tailwind + twin.macro)
- 이미지 Lazy-loading, component-level code splitting
- React Query prefetch로 SSR 후 캐시 Hydration

## 4. 검증 계획
- Lighthouse + axe DevTools로 접근성 스캔
- Keyboard 테스트 체크리스트(QA에 포함)
- NVDA/JAWS 기본 시나리오 테스트(Approval, 파일 업로드)
- 주요 해상도(1920/1440/1280/1024) 스냅샷 비교

## 5. 추가 TODO
- 색각 보정 테마(High Contrast) 여부 논의
- 다국어 지원 필요성 검토(일/영)
- 모바일 대응 여부 Phase 6에서 재검토
