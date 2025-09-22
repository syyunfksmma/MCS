# Phase 4 산출물 - 실시간 메시지 & 파일 정책

## 1. SignalR/SSE 이벤트 규격
| 이벤트 | 채널 | 페이로드 | 설명 |
|---|---|---|---|
| `addin.job.created` | SignalR Hub `/hubs/addin` | `{ jobId, routingId, createdAt }` | Approver가 승인 후 큐 등록 시 브라우저 업데이트 |
| `addin.job.updated` | 같은 채널 | `{ jobId, routingId, status, message, updatedAt }` | Worker가 결과 보고 시 배지 갱신 |
| `routing.approval.changed` | Hub `/hubs/routing` | `{ routingId, status, approvedBy, timestamp }` | 승인/반려 상태 변경 |
| `notification.alert` | SSE `/events/alerts` | `{ type, title, message, severity }` | 시스템 알림/오류 전달 |

- 인증: BFF에서 SignalR Connection Token 발급 → 브라우저는 Access Token 없이 BFF endpoint 구독
- 재연결 전략: Exponential backoff, 5회 실패 시 사용자 알림
- Fallback: SignalR 불가 시 SSE(`/events/updates`) 병행 지원

## 2. 파일 업로드 정책
- 최대 20GB (Chunk Upload)
  - 브라우저: 10MB chunk → Next.js API Route(`/api/upload`) → MCMS API`
  - Resumable upload: Upload ID, offset 기반 재시도
- 바이러스 스캔: 업로드 완료 후 백엔드에서 사내 AV API 호출, 실패 시 상태 `quarantined`
- 보관: 임시 스토리지(Temp) → 검증 후 W:\ 경로로 이동
- 보안: Signed URL / Pre-signed SAS 미사용 (사내망). HTTPS + 인증 필수

## 3. 파일 다운로드 정책
- Streaming: Next.js BFF에서 Range 요청 중계, 대용량 파일 이어받기 지원
- 캐싱: 서버/클라이언트 캐시 비활성 (민감 데이터), 필요 시 `Cache-Control: no-store`
- 무결성: Response Header에 checksum(MD5/SHA256) 포함

## 4. 에러/재시도 처리
- 업로드 실패 시 Toast + 세부 로그, 재시도 버튼 제공
- Add-in 실패 이벤트 → UI 배지 업데이트 + 히스토리 기록
- SignalR 연결 끊김 → UI 배너 표시 후 자동 재연결 시도

## 5. TODO / 논의 사항
- 파일 암호화 필요성 검토(Phase 6 보안 회의)
- SignalR Scale-out (Redis Backplane) 필요 여부 모니터링
- SSE 이벤트를 위한 Server Sent Events polyfill 지원 고려
