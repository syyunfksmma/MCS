# Phase 4 산출물 - 범위 개요

## 목표
- Next.js 포털에서 소비할 REST API 계약을 재검증하고 개발자 가이드를 제공한다.
- SignalR/SSE 기반 실시간 이벤트 흐름을 정의한다.
- 대용량 파일 업로드/다운로드 보안·성능 정책을 확정한다.

## 주요 항목
1. REST API 스펙: Item/Revision/Routing, Approval, Add-in, Admin, Monitoring
2. 인증/권한: AAD 토큰 → API JWT 교환, 역할 검증 흐름
3. 실시간 이벤트: SignalR 허브 경로, 메시지 타입, SSE 라우트
4. 파일 전송 정책: Chunk Upload Flow, 다운로드 스트리밍 전략, 바이러스 스캔

## 산출물
- `Phase4_RESTGuide.md`
- `Phase4_RealTimeSpec.md`
- `Phase4_FilePolicy.md`

## 위험
- 대용량 업로드 브라우저 제한 → 백엔드 중계 설계 필요
- SignalR 인증 실패 시 재연결 전략 필요
- 기존 API와의 호환성(버전 관리) 위험
