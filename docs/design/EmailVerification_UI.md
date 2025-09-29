# Email Verification UI Spec — 2025-09-29

## Screens
1. Pending verification (default) — card with instructions and CTA to resend (disabled until backend ready).
2. Success (token valid) — Ant Design `Result` success variant with Explorer redirect.
3. Expired — warning state directing to login.

## Accessibility
- Buttons provide Korean labels and rely on semantic `<button>` elements.
- Alert includes `showIcon` for screen-reader friendly status indicator.

## Implementation
- Next.js route: `web/mcs-portal/src/app/auth/verify-email/page.tsx`.
- Token validation stub: `validateToken` to be replaced with API integration after backend readiness.

> 작성: 2025-09-29 Codex
