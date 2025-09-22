# Phase 2 산출물 - Next.js + .NET 통합 아키텍처 개요

## 1. 논리 아키텍처
```
[Client Browser]
    | (HTTPS, Azure AD SSO)
    v
[IIS Reverse Proxy]
    | (Rewrite / ARR)
    v
[Next.js SSR Service (Node)]
    |  (BFF API Routes, SignalR Proxy)
    v
[MCMS API (.NET 8 WebAPI)] --- [SQL Server]
    |                         |
    | (Queue/REST)            | (메타데이터, 히스토리)
    v                         v
[MCMS Workers]             [W:\ 공유 드라이브]
    |
    | (HTTPS)
    v
[ESPRIT Edge Add-in]
```

- Next.js API Routes 일부는 BFF 역할: Authentication bridging, Add-in 큐 상태 polling, SSR 데이터 prefetching
- SignalR 이벤트: Node 서버에서 @microsoft/signalr 클라이언트로 구독 → SSE/WebSocket으로 브라우저 전달
- 캐싱: React Query + Edge Cache(Phase 3 검토), Node 레이어에서 Redis 캐시 옵션 추후 고려

## 2. 데이터 흐름
1. 사용자가 SSO 인증 → Next.js 서버에서 Access Token 검증, 필요한 경우 API BFF 호출
2. SSR 시 Next.js에서 MCMS API 호출하여 초기 데이터 fetch → Hydration 후 React Query 관리
3. 사용자가 라우팅 편집/승인요청 시 Next.js API Route(BFF) 통해 API 호출 → JWT 전달/갱신
4. MCMS Workers가 Add-in 결과 큐 처리 → SignalR 허브 → Next.js SSE → UI 배지 갱신

## 3. 주요 컴포넌트
- Next.js SSR Service: Express 기반 custom server(`next start`) + Health check endpoint
- Auth Middleware: Token refresh, role enforcement, 401 리다이렉션 처리
- Logging: winston + Elastic (Node → Logstash), 브라우저 에러는 Sentry(사내 인스턴스)

## 4. 의존성/구성
| 구성 요소 | 버전/설정 |
|---|---|
| Node.js | 20 LTS |
| Next.js | 14.x (App Router), Turbopack 실험적 사용 여부 추후 결정 |
| React Query | v5 이상 |
| SignalR Client | @microsoft/signalr 8.x |
| Tailwind | 3.x |
| 인증 라이브러리 | msal-browser + msal-node |

## 5. 아키텍처 고려 사항
- BFF 패턴으로 API 키/권한 관리를 강화 (브라우저 → Next.js → MCMS API)
- SSR 서버 장애 시 CSR 폴백으로 페이지 렌더 (장애 대응 계획에 포함)
- WPF 클라이언트와 병행 운영 기간 동안 API Rate 제한/기존 토큰 전략 유지

## 6. TODO / 논의 사항
- Redis 캐시 도입 여부(대시보드 등 정적 데이터)
- SignalR 이벤트를 Azure Event Hub로 중계할 필요성 검토
- Next.js API Route에서 대용량 파일 업로드 처리 전략(Streaming ↔ API Direct)
