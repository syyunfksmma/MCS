# Dashboard Aggregation API Draft (2025-09-30)
- 작성: Codex
- 목적: Sprint 8 D1 과업을 위한 제품 대시보드 집계 엔드포인트 설계 초안.

## 1. Endpoint 개요
| 항목 | 값 |
| --- | --- |
| HTTP Method | GET |
| URL | `/api/dashboard/summary` |
| 인증 | JWT (MCMS 내부 토큰), Role: `Admin` 또는 `Planner` |
| 응답 포맷 | `application/json` |
| 캐싱 | 서버: MemoryCache 30초, 클라이언트: React Query staleTime 15초 |

## 2. 요청 파라미터
| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| range | string | 선택 | `daily`, `weekly`, `monthly`, 기본값 `daily` |
| includeBreakdown | boolean | 선택 | true일 경우 설비/인원 세부 지표 포함 |

## 3. 응답 스키마
```json
{
  "totals": {
    "unassigned": 0,
    "inProgress": 0,
    "completed": 0
  },
  "sla": {
    "targetMs": 1500,
    "p95Ms": 0,
    "p99Ms": 0
  },
  "breakdown": {
    "byOwner": [
      { "owner": "string", "count": 0 }
    ],
    "byMachine": [
      { "machine": "string", "count": 0 }
    ]
  },
  "period": {
    "range": "daily",
    "start": "2025-09-30T00:00:00Z",
    "end": "2025-09-30T23:59:59Z"
  }
}
```
- breakdown 필드는 includeBreakdown=false일 때 생략.

## 4. 데이터 소스 & 쿼리 전략
- 원본: `products_dashboard_v2` View.
- 추가 집계: `routing_assignments` 테이블 상태별 count, `machine_load` 뷰 설비별 작업량.
- 쿼리 템플릿:
```sql
SELECT
  SUM(CASE WHEN status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned,
  SUM(CASE WHEN status IN ('InProgress','Ready') THEN 1 ELSE 0 END) AS in_progress,
  SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_ms) AS p95,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_ms) AS p99
FROM products_dashboard_v2
WHERE snapshot_date BETWEEN @start AND @end;
```
- 성능 목표: DB 응답 500ms 이하, HTTP 응답 800ms 이하.

## 5. 캐싱 & 무효화
- MemoryCache 키: `dashboard:range:{range}:breakdown:{include}`.
- 무효화 트리거: Routing 생성/업데이트 SignalR 이벤트, ETL 완료 웹훅.

## 6. 오류 처리
| 코드 | 메시지 | 설명 |
| --- | --- | --- |
| 401 | Unauthorized | 토큰 누락/만료 |
| 403 | Forbidden | 권한 부족 |
| 503 | Dashboard data not ready | ETL 완료 전 요청 |

## 7. TODO
- ETL 웹훅 경로 확정 및 캐시 무효화 wiring.
- React Query hook(useDashboardSummary) 초안 작성.
- k6 시나리오에 `/api/dashboard/summary` P95 측정 추가.
