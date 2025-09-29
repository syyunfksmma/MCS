# Local Deployment & Email Operations Runbook (2025-09-29)

## 1. Local PC Deployment Checklist (Node.js 20 + pm2)
- 전제: Node.js 20.10 LTS, pnpm 8, pm2 5.x 설치.
- 단계: `pnpm install` → `pnpm build` → `pm2 start ecosystem.config.js --only mcms-web`.
- 검증: `http://localhost:3000/healthz`, `logs/local/smoke`에 결과 저장.
- Smoke: `scripts/deploy/run-local-smoke.ps1` 실행 후 보고서 `reports/wave17/local_smoke.md`.

## 2. Git Revert + pm2 Restart Rollback Playbook
- 대상: 이메일 인증 환경 (mcms-email-auth).
- 절차: `git revert <sha>` → `pnpm build` → `pm2 restart mcms-email-auth`.
- 롤백 확인: `/api/healthz` 200, queue 길이 < 5.
- 로그 보관: `logs/rollback/<date>/pm2_restart.log`.

## 3. Email Verification Failure Handling
- 탐지: Application Insights `email_verification_failed` 이벤트, Threshold 5/min.
- 대응: 토큰 강제 만료(`DELETE /api/auth/email-token/{id}`) 후 재발송.
- 고객 안내: 템플릿 `templates/email/verification_retry.md`.
- 사후 보고: `docs/ops/Email_Verification_Incident_Log.md` 업데이트.

## 4. Local Log Paths & Email Queue Monitoring
- 로그 경로: `C:\MCMS\logs\api`, `C:\MCMS\logs\worker`, `C:\MCMS\logs\email`.
- Queue 확인: `GET /api/email/queue` → pending/failed
- 주기: 매일 09:00 Ops 담당 확인, 결과 `logs/ops/daily_email_queue_<date>.log` 기록.

## 참조 스크립트
- `scripts/deploy/local/pm2-ecosystem.config.js`
- `scripts/ops/Flush-EmailQueue.ps1`

## 타임라인
- Wave17 S49~S52에 기록.
