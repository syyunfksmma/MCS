# Phase10 Runbook Annex — npm/pm2 & Email Checklist

## 1. npm Commands
- `npm run build` — 프런트엔드 빌드
- `npm run test:regression` — 회귀 테스트
- `npm run lint` — 정적 분석

## 2. pm2 Operations
- `pm2 reload mcms-portal`
- `pm2 logs mcms-portal --lines 200`
- `pm2 save` after deployment

## 3. Email/SMTP 점검
- `.env.local`에서 SMTP_HOST, SMTP_PORT 확인
- Ops 승인 템플릿(Ops_Comms_Template.md) 참고
- 실패 시 Sprint6_DRPlaybook 단일 노드 롤백 절차 실행

## 4. Checklist (배포 후)
- [ ] package-offline 결과 로그 확인
- [ ] run-smoke-monitor.ps1 성공 여부 기록
- [ ] notify-deploy.ps1 Deployed 이벤트 전송

*Codex — 2025-09-29 12:11 KST*
