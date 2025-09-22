# Phase 0 산출물 - SSO·보안·Node 호스팅 정책 메모

## 1. 인증/인가 (SSO)
- **방식**: Azure AD SSO (사내 테넌트), OpenID Connect + PKCE
- **프론트엔드**: msal-browser, 로그인 후 Access Token + Refresh Token 유지 (Silent refresh)
- **백엔드**: 기존 JWT 미들웨어 유지. AAD 발급 토큰을 API 게이트웨이가 검증 후 내부 JWT로 교환하는 BFF 패턴 고려
- **권한 매핑**: AAD 그룹 → MCMS 역할(Viewer/Editor/Approver/Admin). Admin Console에서 추가 매핑 가능
- **감사 로깅**: 로그인/로그아웃/토큰 실패는 Azure AD 로그 + MCMS 감사 DB에 기록

## 2. 보안 정책
- HTTPS 강제, HSTS 6개월 설정
- Content Security Policy: self + 사내 CDN만 허용, Eval 금지
- 파일 업로드: 백엔드에서 MIME/확장자 검사 + 바이러스 스캔 (사내 AV API), 4GB 초과는 Chunk Upload
- 세션/쿠키: SameSite=Strict, Secure, HttpOnly. Access Token은 메모리/Session Storage만 사용
- 코드 스캐닝: SAST(ESLint+Type Checking), DAST(ZAP) CI 파이프라인 연동

## 3. Node 호스팅 가이드
- **환경**: Windows Server 2019, Node.js 20 LTS, Next.js 14
- **프로세스 관리**: NSSM(Windows Service) 또는 PM2 Windows 서비스 모드 중 하나 선택 (Infra Lead 결정 필요)
- **배포**: CI에서 `next build` 후 아티팩트 배포 → 서버에서 `next start --port 3100`
- **역프락시**: IIS + ARR, URL Rewrite (https://portal.mcms.local → Node 3100 포워딩)
- **모니터링**: Prometheus exporter(Windows/Node) + Grafana 대시보드, 앱 로그는 ELK Stack으로 전송
- **장애 대응**: 서비스 헬스체크 실패 시 자동 재시작, 5분 이내 ONCALL 알림 (OpsGenie/Teams)

## 4. 보안 점검 항목 (Phase 2 이전 완료)
- Azure AD 보안 검토 티켓 생성 및 검토 일정 확정
- Node 서비스 포트/방화벽 규칙 문서화 및 인프라 승인
- 정적 자산 제공 시 캐싱 정책/서명URL 검토

## 5. 승인 필요 목록
- Azure AD 앱 등록 및 Redirect URL 승인 (IT Security)
- IIS/Node 호스팅 서버 할당 및 접근 권한(Infra)
- 로그/모니터링 시스템 접근 권한 (Ops)

