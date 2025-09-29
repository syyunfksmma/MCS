# Phase 2 산출물 - 배포/패키징 절차 메모
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 1. 개요
- 로컬 PC에서 수동 트리거(버전 태그)로 빌드/배포를 진행한다.
- CI는 선택 사항이며, 기본적으로 `npm run lint`/`npm run test`를 수동 실행한다.

## 2. 단계별 작업 (로컬 빌드)
| 단계 | 작업 | 상세 |
|---|---|---|
| Build | Install & Lint | `npm install`, `npm run lint` |
| Test | Regression | `npm run test:regression` (데이터 리셋 → 시드 → E2E → axe) |
| Package | Build Output | `npm run build` → `.next`, `public` 폴더 | 
| Publish | 로컬 배포 | `npm run start -- -p 4000` 또는 pm2 |
| Verify | Health Check + Manual Smoke | `/healthz`, Explorer/Workspace/Admin |
| Rollback | Git Revert | 이전 커밋 체크아웃 후 재빌드 |

## 3. 자동화 스크립트 개요
```powershell
# scripts/testing/bootstrap-uat.ps1
# scripts/testing/seed-test-data.mjs
# scripts/testing/reset-test-data.mjs
~~# scripts/testing/check-smtp.mjs~~ # (제거됨)
```
- `npm run test:data:reset`
- `npm run test:data:seed`
- `npm run test:regression`

## 4. 배포 고려사항
- 배포 전 `backup/YYYYMMDD/.next` 보관.
- `.env.local` 변경 시 암호화 백업.
- 배포 후 `healthz`와 이메일 인증 흐름을 즉시 확인.

## 5. 비밀/보안
- SMTP 비밀번호, JWT Secret은 `.env.local`에만 저장하고 Git에 커밋 금지.
- 필요 시 `Protect-CmsMessage`로 암호화하여 공유.
- 승인/로그인 이벤트 로그는 이메일 주소를 마스킹 처리.

## 6. 관측성
- 배포 로그: `logs/deploy/YYYYMMDD.log`.
- pm2 사용 시 `npx pm2 logs mcms`로 실시간 확인.
- 주요 지표: 빌드 시간, 이메일 발송 성공률, 헬스체크 응답.

## 7. TODO
- `scripts/deploy/rollback-local.ps1` 작성.
- `npm run smtp:check`를 배포 전 필수 절차로 추가.
- GitHub Actions(옵션)에서 lint/test 파이프라인 템플릿 초안 작성.

---
2025-09-29 Codex: 로컬 PC + 이메일 인증 환경에 맞춰 CI/CD 문서를 단순화.
