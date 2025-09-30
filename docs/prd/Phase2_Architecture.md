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
# Phase 2 산출물 - Next.js + 이메일 인증 아키텍처 개요
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 1. 논리 아키텍처
```
[Client Browser]
    | (HTTP, 관리자 승인)
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
- Auth Module: 이메일 가입 요청 저장, 관리자 승인, 세션 생성.
- Email Service: Nodemailer + SMTP (Gmail/SendGrid) → 로그 `logs/auth`에 기록.
- Logging: winston + 로컬 파일(`logs/app`, `logs/auth`), 필요 시 Elastic Stack 연동.

## 4. 의존성/구성
- Node.js 20 LTS, npm 10.
- SQLite (개발) / SQL Server (운영) 사용자·세션 테이블.
- SMTP 계정, `.env.local` 설정.
- pm2(선택) 또는 Scheduled Task로 서비스 자동화.

## 5. 보안/컴플라이언스 고려
- 승인 대기 사용자 정리: 일정 기간(예: 30일)마다 미승인 사용자 삭제.
- 이메일 발송 실패 시 재전송 로직 및 관리자 알림.
- HTTP만 사용하므로 라우터/PC 방화벽을 통해 외부 접근 차단.

## 6. 향후 계획
- SSE/SignalR 대체 통합.
- Redis 기반 캐싱 검토.
- SMTP ↔ API Key 회전 정책 수립.

