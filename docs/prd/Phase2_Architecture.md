# Phase 2 산출물 - Next.js + 이메일 인증 아키텍처 개요

## 1. 논리 아키텍처
```
[Client Browser]
    | (HTTP, Magic Link)
    v
[Next.js SSR Service (Node 20, localhost:4000)]
    |  (API Routes, Email Service, Upload API)
    v
[MCMS API (.NET 8 WebAPI)] --- [SQLite/SQL Server]
    |                          |
    | (Queue/REST)             | (메타데이터, 히스토리)
    v                          v
[Background Workers]        [Shared Drive]
```
- Next.js API Routes는 BFF 역할: 이메일 인증, Add-in 큐 상태 polling, SSR 데이터 prefetch.
- SignalR 대체: Polling/SSE (향후) → 현재는 Mock 데이터 기반.
- 캐싱: React Query + In-memory cache, Redis는 선택사항.

## 2. 데이터 흐름
1. 사용자가 이메일로 가입 요청 → Next.js가 Magic Link 토큰 생성 후 SMTP로 발송.
2. 사용자가 링크 클릭 → `/auth/verify`에서 토큰 검증 → JWT 세션 발급 → 쿠키 저장.
3. SSR 시 Next.js가 MCMS API를 호출하여 Explorer 초기 데이터를 가져오고 Hydration.
4. 라우팅 편집/승인 요청 시 Next.js BFF가 MCMS API를 호출하고 결과를 UI에 반영.
5. 파일 업로드는 Next.js Upload Route에서 chunk 처리 → 백엔드 API/공유 드라이브에 전송.

## 3. 주요 컴포넌트
- Next.js SSR Service: `npm run start -- -p 4000`으로 실행, Health Check `/healthz` 제공.
- Auth Module: Magic Link 생성, 토큰 저장(`auth_tokens`), 만료/폐기 배치.
- Email Service: Nodemailer + SMTP (Gmail/SendGrid) → 로그 `logs/auth`에 기록.
- Logging: winston + 로컬 파일(`logs/app`, `logs/auth`), 필요 시 Elastic Stack 연동.

## 4. 의존성/구성
- Node.js 20 LTS, npm 10.
- SQLite (개발) / SQL Server (운영) 사용자·세션 테이블.
- SMTP 계정, `.env.local` 설정.
- pm2(선택) 또는 Scheduled Task로 서비스 자동화.

## 5. 보안/컴플라이언스 고려
- Magic Link 토큰 만료 10분, 재사용 차단.
- 이메일 발송 실패 시 재전송 로직 및 관리자 알림.
- HTTP만 사용하므로 라우터/PC 방화벽을 통해 외부 접근 차단.

## 6. 향후 계획
- SSE/SignalR 대체 통합.
- Redis 기반 캐싱 검토.
- SMTP ↔ API Key 회전 정책 수립.
