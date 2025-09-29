# Sprint 12 - Optimized Data Path Benchmark Backlog Entry

## User Story
운영팀 엔지니어로서, 최적화된 데이터 경로(EF Core + SQL Server 튜닝)가 실제 생산 부하에서 요구 성능을 충족하는지 확인하고 싶다. 이를 위해 자동화된 벤치마크와 수용 기준을 정립하여 릴리스 전에 검증하고자 한다.

## Benchmark Scope
- MCMS.Api Item/Routing 조회 엔드포인트 (EF Core 컴파일 쿼리, `AsNoTracking`, Split Query 적용).
- History Append/Read 경로 (Columnstore 인덱스 + 비동기 스트리밍).
- Worker 큐 소비 속도 (Memory-Optimized Queue 테이블 + 네이티브 프로시저).

## Benchmark Steps
1. **환경 준비**
   - CI 파이프라인에서 최신 마이그레이션 적용 후 `dotnet ef dbcontext optimize` 실행 아티팩트 배포.
   - SQL Server에 Columnstore/Memory-Optimized 구성이 반영되었는지 스크립트(`ops/sql/verify_data_path.sql`)로 검증.
2. **API 조회 테스트**
   - k6 시나리오 `k6/scripts/routing_list_compiled.js`로 5분 간 50 VU 부하 생성.
   - 응답에 포함된 Routing/History 레코드를 `await foreach` 스트리밍 방식으로 소비하여 메모리 사용량 수집.
3. **History 기록 테스트**
   - `scripts/tests/History-BatchInsert.ps1`을 사용하여 분당 200건 변경 이벤트 삽입.
   - SQL Server Extended Events로 Columnstore 압축 지표 및 대기 시간 기록.
4. **Worker 큐 테스트**
   - `scripts/tests/Worker-QueueBench.ps1`로 1,000건 작업을 Enqueue 후 처리 시간 측정.
   - Query Store 자동 계획 경고가 없는지 `ops/sql/query_store_regression.sql` 보고서 확인.
5. **결과 수집 및 리포트**
   - Grafana 대시보드 스냅샷 + SQL Server DMV 통계 정리.
   - `docs/testing/BenchmarkResults` 폴더에 HTML 리포트 저장.

## Acceptance Criteria
- Routing 조회 P95 응답시간 ≤ 1.8초, 서버 메모리 피크 65% 이하.
- History Append 실패율 0%, Columnstore 압축 비율 ≥ 8x.
- Worker 큐 처리량: 1,000건 작업이 3분 이내 완료, 대기 시간 평균 5초 이하.
- Query Store에 자동 계획 회귀 경고(Severity ≥ Medium)가 존재하지 않는다.
- 벤치마크 결과가 QA 리포트에 첨부되고, 성능 태그 `perf-optimized`로 릴리스 노트 업데이트.

## Definition of Done Checklist
- [ ] 벤치마크 스크립트가 CI 파이프라인에서 실행되도록 YAML 업데이트.
- [ ] SQL 모니터링 스크립트가 ops 저장소에 병합됨.
- [ ] 결과 리포트가 문서화되고 팀 리뷰 완료.
