# Sprint 2 Add-in Control Panel

## 개요
- Add-in 작업을 한눈에 관리할 수 있도록 큐 테이블, 상태 필터, 검색 입력을 추가했다.
- 재시도/취소에 대한 확인 모달과 모의 SignalR 이벤트 스트림을 구성했다.
- 연결 상태(SignalR) 표시 및 재연결 트리거 버튼을 제공한다.

## UI 요소
- 상태 필터: `Segmented` 컴포넌트를 사용하여 전체/대기/진행/성공/실패/취소 탭 전환.
- 검색창: Routing 코드, 품목명, Revision, 요청자, 최근 메시지를 대상으로 실시간 필터링.
- 작업 테이블: Routing 정보, 상태 태그, 요청자, 생성 시간, 최근 메시지, 액션 버튼 열로 구성.
- 연결 상태 배지: `connected`, `reconnecting`, `disconnected` 3단계 표시.
- 상단 배지: 현재 선택된 Routing과 매핑된 Add-in 상태를 `AddinBadge`로 시각화.

## 액션 흐름
1. **Add-in 작업 추가**
   - Routing 선택 후 “Add-in 작업 추가” 클릭 → 새 작업이 `queued` 상태로 큐 맨 앞에 삽입.
   - 메시지 센터에 성공 토스트 출력.
2. **재시도**
   - `failed`/`cancelled` 행에서 “재시도” → 확인 모달 → 승인 시 상태가 `queued`로 변경.
3. **취소**
   - `queued`/`running` 행에서 “취소” → 확인 모달 → 승인 시 상태가 `cancelled`로 변경 및 경고 토스트 노출.

## SignalR 이벤트 스텁
- 3.2초 간격 타이머가 `queued → running → succeeded/failed` 순환 이벤트를 발생.
- `running` 완료 시 85% 확률로 성공, 15% 확률로 실패.
- 각 단계 전환마다 메시지 센터가 Info/Success/Error 토스트를 발행.

## 재연결 로직
- 25초 간격으로 8% 확률의 연결 끊김을 시뮬레이션.
- `disconnected` 전환 시 경고 토스트, 2초 후 `reconnecting`, 1.5초 후 `connected` 복구.
- 사용자가 “재연결 시도” 버튼을 누르면 즉시 `reconnecting` 상태로 진입.

## 후속 작업 제안
- BFF 연결 시 SignalR 허브 URL/토큰 구성 → 현재 스텁을 실제 이벤트 핸들러로 교체.
- 재시도/취소 API 연동 시 optimistic update + 에러 롤백 로직 추가.
- 작업 이력(승인 타임라인)과 Add-in 큐 동기화 필요 (Sprint 2 D2, D3와 연계).