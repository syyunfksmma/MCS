# Phase 2 PRD - Hosting & Architecture

## 초점 영역
- 로컬 PC(Node.js 20) 기반 SSR 서비스 구조 정의
- 이메일 인증(Magic Link) + JWT 세션 흐름 확정
- MCMS API 연동 BFF, 파일 업로드, 로그 체계 설계

## 산출물
- 아키텍처 다이어그램(Next.js ↔ MCMS API)
- 인증/세션 ERD 및 토큰 만료 정책
- `/healthz`, `/auth/*`, `/api/*` 엔드포인트 명세

## 주요 위험
- 이메일 발송 실패 시 인증 차질
- 로컬 PC 리소스 부족으로 성능 저하
- SMTP 자격 증명 유출 위험
