# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
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

