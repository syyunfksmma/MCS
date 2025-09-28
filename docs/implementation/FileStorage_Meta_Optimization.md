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
- Use scripts/performance/monitor-meta-json.ps1 (see docs/ops/FileStorage_EventMonitoring.md) to capture EventCounter trends and correlate with k6 runs.
- CI에 주간 부하 테스트를 추가하고 meta SLA 지표를 Dashboard에 연동합니다.

## Timeline
- 설계/POC: 2025-09-26 ~ 09-30
- 구현/단위 테스트: 2025-10-01 ~ 10-08
- 부하 검증 & 튜닝: 2025-10-09 ~ 10-16
- 재측정 & 보고: 2025-10-17

- 절대 지령: 모든 업무 지시는 문서에 기록하고 기존 지시는 취소선으로 남긴다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강
## 업데이트 기록 (2025-09-26)
- Codex: FileStorageService JsonWrite 큐 멀티 워커, MaxParallelJsonWrites 세마포어, MetaFileCacheHistory(최근 3회) 및 PooledByteBufferWriter 직렬화 경로 구현.
- Codex: RoutingFileService에 RoutingMetaFingerprintHistory(3-slot) 도입으로 라우팅별 중복 meta write 스킵 범위 확대.
- Codex: run-meta-sla.ps1 퍼센타일 파싱 수정 및 meta_sla_history.csv 자동 누적 검증(k6 p95=13.631 s).




