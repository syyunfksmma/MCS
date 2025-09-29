# Phase 10 산출물 - 배포 Runbook

> ~~기존 기준: Windows Server + IIS + Installer 기반 배포~~
> 현재 문서는 로컬 PC(Node.js 20) + 이메일 승인 흐름을 기준으로 한다.
## 절대 지령
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력"에 기록한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs 문제 해결 후 배포한다.
- 배포/롤백 로그는 `logs/deploy/YYYYMMDD.log`에 남긴다.

## 1. 사전 준비 (로컬 PC)
1. Node.js 20 LTS 설치 (`node -v` 확인) 및 npm 10 이상 유지.
2. 레포지토리 최신 상태로 업데이트:
   ```bash
   git pull origin feature/sprint5-explorer-ssr
   npm install
   ```
3. 환경 변수 설정 (`.env.local`):
   ```dotenv
   NODE_ENV=production
   PORT=4000
   SMTP_HOST=...
   SMTP_PORT=587
   SMTP_USER=...
   SMTP_PASS=...
   EMAIL_FROM="MCMS Routing <noreply@example.com>"
   ```
4. 로그 디렉터리 생성: `%USERPROFILE%\AppData\Local\MCMS\logs`.
5. 백업: 기존 `build/` 및 `.next/` 폴더를 `backup/YYYYMMDD`로 복사.

## 2. 배포 절차
1. 빌드 실행:
   ```bash
   npm run build
   ```
2. 서비스 기동:
   ```bash
   npm run start -- -p 4000 > %USERPROFILE%\AppData\Local\MCMS\logs\server.log 2>&1
   ```
3. pm2 사용 시:
   ```bash
   npx pm2 start npm --name mcms -- run start -- -p 4000
   npx pm2 save
   ```
4. 헬스체크:
   ```powershell
   Invoke-WebRequest http://localhost:4000/healthz
   ```
   - 200 OK 확인 후 `logs/deploy/YYYYMMDD.log`에 기록.
5. 가입/로그인 검증:
   - `/auth/register`에서 테스트 이메일로 가입 → 메일함에서 링크 클릭.
   - `/auth/verify` 응답 200인지 확인.
6. 주요 화면 스모크 테스트:
   - Explorer SSR 로딩 → Workspace Upload 모달 표시 → Admin Feature Flag 페이지 접근.

## 3. 배포 후 체크리스트
- `logs/app/server.log`에 에러가 없는지 확인.
- Nodemailer가 정상 발송했는지 dev inbox/실제 메일에서 확인.
- `npm run test:data:reset && npm run test:data:seed`로 기본 더미 데이터를 초기화.
- `npm run test:e2e`(환경 준비 시) 실행 후 보고서를 `test-results/e2e/YYYYMMDD/`에 저장.
- QA Report(Sprint5_QAReport.md) 상태 업데이트.

## 4. 문제 발생 시
1. 서비스 중단:
   - `Ctrl+C` 또는 `npx pm2 stop mcms`로 프로세스 중지.
2. 로그 확인:
   - `logs/app/server.log`, `logs/auth/*.log` 분석.
3. 롤백:
   - `backup/YYYYMMDD` 폴더의 `.next/` 및 `public/`을 복구.
   - `npm run start -- -p 4000` 재실행.
4. 보고:
   - Sprint6_Log.md에 시간/조치 사항 기록.

## 5. 문서화 및 감사
- 배포 로그: `logs/deploy/YYYYMMDD.log`.
- Helathz/Smoke 캡처: `docs/sprint/screenshots/`에 저장.
- Lessons Learned: `docs/ops/Deployment_Lessons.md` 업데이트.

## 수정 이력
- 2025-09-25 Codex: 절대 지령/변경 이력 규칙 반영.
- 2025-09-26 Codex: Windows 서버 기준 Runbook 작성.
- 2025-09-29 Codex: 로컬 PC(Node.js 20) + 이메일 인증 환경으로 Runbook 전면 수정.
