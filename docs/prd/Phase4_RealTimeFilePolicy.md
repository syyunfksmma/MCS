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

