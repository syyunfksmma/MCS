# SMTP Configuration Template

## Variables (`.env.local`)
```
SMTP_HOST=smtp.mcms.corp
SMTP_PORT=587
SMTP_USER=svc-mcms-mail
SMTP_PASS=<<encrypted>>
EMAIL_FROM=mcms-notify@corp.local
MAGIC_LINK_EXPIRES_MINUTES=15
```

## Setup Notes
- Credentials stored in Windows Credential Manager; reference `docs/ops/IIS_Node_OperationsDesign.md`.
- For local dev, use `smtp4dev` with host `localhost` and port `2525`.

## Verification Steps
1. Run `npm run dev`.
2. POST to `/api/auth/magic-link` with test user; verify log entry in `logs/auth/magic-link.log`.
3. Timeline 기록 후 Ops 팀에 보고.

> 작성: 2025-09-29 Codex
