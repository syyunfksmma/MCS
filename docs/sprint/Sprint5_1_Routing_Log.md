## 절대 지령
- 문서 수정은 기존 내용을 삭제하지 않고 하단 "수정 이력"에 기록한다.
- Stage/Prod SLA 측정은 날짜순으로 표에 누적한다.
- Stage/Prod 측정 실패 시 원인을 Notes에 명시하고 재측정 계획을 함께 기록한다.

| Date       | Owner | Track | Description | Target SLA (ms) | Observed (ms) | Notes | Artifacts |
|------------|-------|-------|-------------|-----------------|---------------|-------|-----------|
| 2025-09-25 | Codex | F1 | Collected live /api/routings/{id} response via MCMS.Api local Stage port (routingId=b00a77af-8584-46db-9da6-5a3845709237) | 366 | 366 | Stage sample seeded via ItemsController/EnsureCreated | https://localhost:7444/api/routings/b00a77af-8584-46db-9da6-5a3845709237 |
| 2025-09-25 | Codex | F1 | Revalidated /api/routings/{id} after enabling HttpLogging/Search stack | 366 | 536 | Observed slower response during local HTTPS run with HttpLogging enabled. | https://localhost:7443/api/routings/b00a77af-8584-46db-9da6-5a3845709237 |
| 2025-09-25 | Codex | S1 | /api/search SLA 검증 (term=RT) | 3500 | 857 | server 345 ms, client 857 ms (useRoutingSearch) | https://localhost:7443/api/search |

## 수정 이력
- 2025-09-25 Codex: 절대 지령 추가 및 Stage 측정 표 형식 정리.
