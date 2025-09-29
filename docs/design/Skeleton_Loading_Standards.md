# Skeleton & Loading Standards

## 1. Components
- Explorer list skeleton: 3 cards with shimmer.
- Routing detail skeleton: tabs + content placeholders.

## 2. Timing
- Show skeleton if response > 300ms.
- Switch to toast error if > 10s.

## 3. Accessibility
- `aria-busy="true"` on containers.
- Skeleton elements hidden from screen readers (`aria-hidden="true"`).

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Skeleton/Loading 표준 정리 |
