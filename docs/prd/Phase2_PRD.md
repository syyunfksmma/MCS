<<<<<<< Updated upstream
# Phase 2 PRD - Hosting & Architecture
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 초점 영역
- 로컬 PC(Node.js 20) 기반 SSR 서비스 구조 정의
- ~~이메일 인증(Magic Link) + JWT 세션 흐름 확정~~
- 이메일 가입 + 관리자 승인 기반의 세션 흐름 확정
- MCMS API 연동 BFF, 파일 업로드, 로그 체계 설계

## 산출물
- 아키텍처 다이어그램(Next.js ↔ MCMS API)
- 인증/세션 ERD 및 토큰 만료 정책
- `/healthz`, `/auth/*`, `/api/*` 엔드포인트 명세

## 주요 위험
- 이메일 발송 실패 시 인증 차질
- 로컬 PC 리소스 부족으로 성능 저하
- SMTP 자격 증명 유출 위험
=======
# Phase 2 PRD - Architecture & Hosting

## 초점 영역
- Next.js SSR/ISR 구조, BFF/API Gateway 설계
- IIS Reverse Proxy와 Node Service 구성도 정의
- CI/CD 파이프라인(빌드, Lint, Test) 설계

## 산출물
- Web Architecture Diagram
- Hosting Runbook (IIS + Node)
- CI/CD 파이프라인 설계서

## 주요 위험
- SSR 서버 장애 대응 미정
- NPM 저장소 미러 구성 필요
>>>>>>> Stashed changes
