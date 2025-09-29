# ML Routing UI Components Plan (2025-09-29)

## 구성 요소
1. `RecommendationDrawer`
   - Drawer + Step-by-step rationale.
   - Accept/Reject 버튼, 확률 Progress bar.
2. `ConfidenceBadge`
   - 신뢰도 시각화 (High/Medium/Low).
3. `ReasonList`
   - 추천 이유 목록, Tooltip로 Feature 중요도 표시.
4. `FeedbackForm`
   - 사용자가 추가 코멘트 입력 → API `/ml/feedback` 전송.

## 상호 작용
- Drag & Drop으로 추천 순서 조정 가능.
- Clipboard copy for path suggestions.

## 접근성
- 키보드 포커스 순환, ARIA role 적용.
- Screen reader 텍스트 제공.

## 테스트
- Vitest: 렌더링, 버튼 이벤트.
- Storybook: Controls 제공, QA 리뷰에 사용.
