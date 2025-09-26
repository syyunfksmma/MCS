# Phase 0 산출물 - 인증·보안·호스팅 정책 메모

## 1. 인증/인가
- ~~방식: Azure AD SSO (사내 테넌트), OpenID Connect + PKCE~~
- ~~프론트엔드: msal-browser, 로그인 후 Access Token + Refresh Token 유지 (Silent refresh)~~
- ~~백엔드: 기존 JWT 미들웨어 유지. AAD 발급 토큰을 API 게이트웨이가 검증 후 내부 JWT로 교환하는 BFF 패턴 고려~~
- ~~권한 매핑: AAD 그룹 → MCMS 역할(Viewer/Editor/Approver/Admin). Admin Console에서 추가 매핑 가능~~
- ~~감사 로깅: 로그인/로그아웃/토큰 실패는 Azure AD 로그 + MCMS 감사 DB에 기록~~
- 방식: Windows Integrated Authentication(Kerberos/NTLM) + AD 그룹 매핑.
- 프론트엔드: 브라우저에서 자동으로 도메인 계정을 사용하고, 백엔드에서는 UseIISIntegration() + WindowsAuthentication으로 사용자 정보를 읽어 역할 매핑.
- 권한 매핑: AD 보안 그룹(MCMS_Viewer 등)을 MCMS 역할과 1:1 매핑, Admin Console에서 추가 매핑 유지.
- 감사 로깅: 로그인/로그아웃 이벤트를 MCMS 감사 DB + Windows Event Log(Security)로 기록.

## 2. 보안 정책
- HTTPS 강제, HSTS 6개월 설정.
- Content Security Policy: self + 사내 CDN만 허용, Eval 금지.
- 파일 업로드: 백엔드에서 MIME/확장자 검사 + 사내 AV 엔진(오프라인 CLI) 연동, 4GB 초과는 Chunk Upload.
- 세션/쿠키: SameSite=Strict, Secure, HttpOnly. Windows Auth 쿠키는 IIS가 관리하므로 앱에서는 추가 토큰 저장 금지.
- 코드 스캐닝: ESLint/Type Checking과 오프라인 DAST(ZAP Portable)를 빌드 PC에서 주기적으로 실행하여 로그 보관.

## 3. 호스팅 가이드 (Windows Server 전용)
- 환경: Windows Server 2022, Node.js 20 LTS, .NET 8 + .NET Framework 4.8.
- 프로세스 관리: NSSM 서비스로 Next.js(SSR)와 MCMS Worker를 Windows 서비스로 등록.
- 배포: 오프라인 설치 패키지가 C:\MCMS\deploy에 파일을 배치하고 
ext start --port 3100 서비스가 재시작되도록 설계.
- 역프락시: IIS + ARR, URL Rewrite(https://mcms.internal → Node 3100) + Windows 인증.
- 모니터링: Windows Performance Counter + Event Log 수집(사내 ELK 또는 파일 공유) / Prometheus Agent는 오프라인 모드 사용.
- 장애 대응: 서비스 헬스체크 실패 시 Restart-Service 자동 실행, 5분 이내 온콜은 내선/이메일로 통보.

## 4. 보안 점검 항목 (Phase 2 이전 완료)
- ~~Azure AD 보안 검토 티켓 생성 및 검토 일정 확정~~
- Windows 인증을 위한 SPN 등록 및 Kerberos 테스트 완료.
- Node 서비스 포트/방화벽 규칙 문서화 및 인프라 승인.
- 정적 자산 제공 시 캐싱 정책/서명URL 검토.

## 5. 승인 필요 목록
- ~~Azure AD 앱 등록 및 Redirect URL 승인 (IT Security)~~
- IIS/Node 호스팅 서버 할당 및 접근 권한(Infra).
- 로그/모니터링 시스템 접근 권한 (Ops).
- Windows 인증 그룹 및 권한 매핑에 대한 보안팀 검토.

---
2025-09-26 Codex: 인증/호스팅 정책을 Azure AD SSO에서 Windows 통합 인증 + 내부망 전용으로 전환.
