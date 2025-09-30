# SignalR Presence & Tree Hub Specification (2025-09-30)
- 작성: Codex
- 목적: Sprint 8 Flow S1/S2를 완결시키기 위한 Presence 및 파일 트리 실시간 허브의 상세 설계 문서.

## 1. 허브 엔드포인트
| 허브 | 경로 | 설명 |
| --- | --- | --- |
| PresenceHub | /hubs/presence | 사용자 세션, 편집 잠금, 상태 브로드캐스트 |
| TreeHub | /hubs/tree | 제품/리비전/그룹/라우팅 노드 변경 이벤트 스트림 |

- 인증: JWT (Bearer) + AD SSO 토큰. 연결 시 access_token 쿼리 문자열 사용.
- 전송: WebSockets 우선, SSE fallback 금지.
- 재연결: retryDelaysMs = [1000, 2000, 5000, 10000], 5회 실패 시 토스트 노출.

## 2. PresenceHub 계약
### 2.1 서버 → 클라이언트
| 메서드 | Payload | 설명 |
| --- | --- | --- |
| PresenceUpdated | { userId, productCode, routingId, status, lastSeenUtc } | 참여자 상태 변경 시 브로드캐스트 |
| LockAcquired | { routingId, lockOwner, expiresUtc } | 라우팅 잠금 획득 알림 |
| LockReleased | { routingId } | 잠금 해제 알림 |

### 2.2 클라이언트 → 서버
| 메서드 | 매개변수 | 설명 |
| --- | --- | --- |
| JoinContext | productCode, routingId | 현재 탐색 중인 컨텍스트 등록 |
| LeaveContext | productCode, routingId | 컨텍스트 떠날 때 호출 |
| RequestLock | routingId | 잠금 요청 |
| ReleaseLock | routingId | 잠금 해제 |

- 서버는 사용자 연결 해제 시 ReleaseLock 자동 실행.
- Presence heartbeat 주기: 15초. 미응답 45초 시 세션 제거.

## 3. TreeHub 계약
### 3.1 이벤트
| 이벤트 | Payload | 설명 |
| --- | --- | --- |
| ItemCreated | { level, parentId, item } | 트리 노드 생성 |
| ItemUpdated | { level, itemId, patch } | 이름/속성 변경 |
| ItemDeleted | { level, itemId } | 노드 삭제 (soft-delete 포함) |
| GroupOrderChanged | { revisionId, orderedGroupIds } | 그룹 재정렬 반영 |

### 3.2 ACK/검증
- 서버는 작업 성공 시 200 OK equivalent ACK 반환.
- 충돌 시 HubException + 코드 409_CONFLICT.
- API /api/tree/sync에서 스냅샷 가져와 초기화.

## 4. 보안/권한
- Role ➜ 이벤트 권한 매트릭스: Admin/Engineer는 작성 가능, Reviewer는 읽기 전용.
- HubFilter 로깅: 연결 ID, 사용자 ID, 권한.
- Audit: PresenceHubLog, TreeHubLog 테이블에 event 저장.

## 5. 클라이언트 구현 체크리스트
- useSignalRConnection 훅 생성, Presence/Tree에 인스턴스 제공.
- 연결 상태 UI: 앱 헤더에 Connected/Retrying/Failed 배지.
- Retry 횟수 초과 시 ExplorerShell 상단에 경고 토스트.
- React Query 캐시 무효화: TreeHub 이벤트 수신 시 invalidateQueries(['explorer','tree']).

## 6. 테스트 계획
- 단위 테스트: Hub 메서드 모킹, 권한 거부 케이스.
- 통합 테스트: Playwright에서 두 세션으로 Presence/Lock 동작 검증.
- 부하 테스트: k6 WebSocket 스크립트로 50 동시 사용자, 10분 유지.

## 7. TODO 요약
- [ ] PresenceHub/TreeHub 클래스 생성.
- [ ] SignalR 인증 핸들러 with JWT.
- [ ] 프론트 훅 + 상태 배지 구현.
- [ ] QA: 연결 끊김 시나리오 녹화.
