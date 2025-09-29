# Phase 0 산출물 - 인증·보안·호스팅 정책 메모

## 1. 인증/인가
- ~~방식: Windows Integrated Authentication(Kerberos/NTLM) + AD 그룹 매핑.~~
- 방식: 이메일 기반 자체 회원가입 + Magic Link 인증.
- 가입 흐름: 사용자가 이메일을 입력하면 검증 토큰이 담긴 링크를 발송하고, 링크를 열면 JWT 세션을 발급한다.
- 데이터 저장: Next.js Route Handler + SQLite(개발)/PostgreSQL(향후) 테이블에 사용자, 토큰, 세션을 저장한다.
- 감사 로깅: 가입/로그인/로그아웃/토큰 만료 이벤트를 `logs/auth/YYYYMMDD.log`에 남기고, 오류는 `logs/auth/YYYYMMDD-error.log`에 분리 저장한다.

## 2. 보안 정책
- HTTP(포트 4000)만 노출하고 라우터에서 외부 포트는 모두 차단한다.
- 이메일 토큰 만료 시간 10분, 1회 사용 원칙. 재사용 시 즉시 폐기하고 관리자에게 알림 메일을 발송한다.
- 세션/쿠키: HttpOnly + SameSite=Lax, Secure=false(로컬). Refresh 토큰은 선택적으로 발급하되 24시간 만료를 준수한다.
- Content Security Policy: self + localhost 리소스만 허용, inline script 최소화.
- 파일 업로드: MIME/확장자 검사, 500MB 초과 시 Chunk Upload + SHA-256 검증.
- 코드 스캐닝: ESLint/Type Checking과 offline ZAP baseline을 주 1회 실행해 보고서를 보관한다.

## 3. 호스팅 가이드 (로컬 PC 서버)
- 환경: Windows 11 Pro, Node.js 20 LTS, npm 10.x.
- 프로세스: `npm install` → `npm run build` → `npm run start -- -p 4000`.
- 서비스 자동화: 필요 시 `pm2 start npm --name mcms -- run start -- -p 4000` 또는 작업 스케줄러 이용.
- 이메일 발송: Nodemailer + Gmail/SendGrid SMTP. `.env.local`에 `SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/EMAIL_FROM`을 정의한다.
- 로그 경로: `%USERPROFILE%\AppData\Local\MCMS\logs` (서버), `logs/auth` (인증), `logs/app` (응용프로그램).
- 장애 대응: 프로세스 중단 시 `npm run start` 재실행 → `logs/app/server.log` 확인 → 필요 시 `npm run build` 재시도.

## 4. 보안 점검 항목 (Phase 2 이전 완료)
- 이메일 인증 토큰 스키마/만료 처리 검증.
- Magic Link 재사용 차단 및 토큰 정리 배치 스크립트 작성.
- SMTP 계정 접근 통제: 앱 비밀번호 또는 API Key 발급.
- 로컬 방화벽 규칙 문서화 및 포트 4000 허용 확인.

## 5. 승인 필요 목록
- 로컬 PC에서 Node 프로세스 실행 권한(관리자) 확보.
- SMTP 서비스 계정/비밀번호 발급 및 테스트 메일 허용 확인.
- 이메일 발송 도메인(또는 Gmail/SendGrid) 사용 승인.

## 6. 이메일 인증 검증 로그 (2025-09-29)
- `.env.local`에 SMTP 변수 입력 후 `npm run dev` 실행.
- `/auth/register`에서 `codex+uat@example.com` 가입 → Magic Link 수신 확인.
- 링크를 열어 `/auth/verify?token=...` 호출 시 200 OK인지 확인.
- 가입 완료 후 `user_sessions` 테이블과 `logs/auth/20250929.log`에 기록되는지 점검.
- 오류 발생 시 `logs/auth/20250929-error.log` 내용으로 원인 파악.

---
2025-09-26 Codex: 인증/호스팅 정책을 Azure AD SSO에서 Windows 통합 인증 + 내부망 전용으로 전환.
2025-09-26 Codex: IIS/SPN/권한 매핑 검증 로그 추가 및 run-smoke 자동화 링크 기록.
2025-09-29 Codex: 이메일 기반 자체 회원가입 + Magic Link 인증으로 전환하고, 로컬 PC(Node 20) 호스팅 정책을 정의. SMTP 환경 변수 템플릿과 장애 대응 절차를 업데이트.
