# Worker Apply/Ready 이벤트 핸드셰이크 테스트 플랜

## 목적
- Worker 큐가 `Apply` / `Ready` 이벤트를 신뢰성 있게 소비하는지 검증한다.

## 구성 요소
- 이벤트 소스: Signal-McsEvent.ps1
- 대상: `MCMS.Worker` 서비스
- 테스트 스크립트: `scripts/automation/Test-WorkerHandshake.ps1`

## 시나리오
1. **정상 흐름**
   - Apply 이벤트 발행 → Worker 처리 → Ready 이벤트 발행 → 로그 검증.
2. **이벤트 지연**
   - Apply 후 5초 지연 → Worker 재시도 로직 확인.
3. **중복 이벤트**
   - 동일한 Apply 이벤트 3회 발행 → Idempotency 확인.
4. **오류 주입**
   - Ready 이벤트 누락 → 알림 및 재큐잉 동작 확인.

## 검증 포인트
- EventLog: `Global\MCS.Apply.Completed`, `Global\MCS.Esprit.Ready`
- 큐 소비 시간: ≤ 2초 (평균)
- 실패 시 재시도 횟수: 최대 3회

## 결과 기록
- `logs/automation/worker_handshake_20250929.log`
- `reports/wave14/worker_handshake_metrics.json`

## 후속 조치
- 이벤트 스키마를 `docs/api/contracts/routing_events_samples.md`와 동기화.
- Alert Rule (`monitoring/alerts/mcms_worker.yaml`)에 이벤트 누락 감지 추가.
