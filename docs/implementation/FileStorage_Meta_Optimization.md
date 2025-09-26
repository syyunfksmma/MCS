# FileStorage Meta Optimization Plan

## Goal & Context
- ~~단일 워커·단일 캐싱으로 SLA 1초 유지 가능~~ 최근 k6 측정에서 meta_generation_wait_ms p95가 2.5~11초까지 상승하여 근본적인 구조 개선이 필요합니다.
- 목표: 배치 처리와 직렬화 최적화를 통해 meta_generation_wait_ms p95 ≤ 3초(임시) → 추후 1초 재도전.

## Approved Actions
1. **Routing ID 배치 디듀프**
   - 업로드/삭제 이벤트를 300ms 윈도우로 모아 단일 meta.json 쓰기 수행.
   - 배치 집계는 `RoutingMetaUpdateScheduler`에 타이머 큐를 추가해 구현.
2. **캐시 고도화**
   - 최근 3회 `MetaFileCacheEntry` 해시/길이 히스토리를 유지해 반복 쓰기를 즉시 건너뜁니다.
   - HistoryId와 파일 크기 비교 후 달라질 때만 전체 직렬화 수행.
3. **수동 직렬화 및 버퍼 재사용**
   - `Utf8JsonWriter` + `ArrayPool<byte>`로 스트림 복제를 제거합니다.
   - 스트림 쓰기 전후 Stopwatch로 큐 대기/쓰기 시간을 분리 측정합니다.
4. **백그라운드 파이프라인**
   - `QueueJsonWriteAsync` 앞단에 `(routingId, Func<Task<RoutingMetaDto>>)` 채널을 두고 DTO 재사용 구조를 마련합니다.
5. **모니터링**
   - `EventCounters`로 queue length, worker 처리 시간, file IO 시간을 노출합니다.

## Measurement Plan
- k6 `tests/k6/chunk_upload.js` 시나리오를 활용해 변경 전후 p50/p95를 기록합니다.
- CI에 주간 부하 테스트를 추가하고 meta SLA 지표를 Dashboard에 연동합니다.

## Timeline
- 설계/POC: 2025-09-26 ~ 09-30
- 구현/단위 테스트: 2025-10-01 ~ 10-08
- 부하 검증 & 튜닝: 2025-10-09 ~ 10-16
- 재측정 & 보고: 2025-10-17

- 절대 지령: 모든 업무 지시는 문서에 기록하고 기존 지시는 취소선으로 남긴다.
