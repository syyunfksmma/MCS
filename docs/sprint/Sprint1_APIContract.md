# Sprint 1 - Explorer REST API & BFF 매핑

## BFF 엔드포인트
| 경로 | 메서드 | 설명 | 백엔드 매핑 |
|---|---|---|---|
| `/api/explorer` | GET | Explorer 데이터 조회 (Mock → 향후 MCMS API) | `MCMS_API_BASE_URL/api/explorer` |

## 응답 스키마 (요약)
```json
{
  "source": "mock",
  "generatedAt": "2025-09-22T10:00:00Z",
  "items": [
    {
      "id": "item_a",
      "code": "Item_A",
      "name": "엔진 브래킷",
      "revisions": [
        {
          "id": "item_a_rev01",
          "code": "Rev01",
          "routings": [
            {
              "id": "routing_gt310001",
              "code": "GT310001",
              "status": "Approved",
              "camRevision": "1.2.0",
              "files": [
                { "id": "file_esp", "name": "GT310001.esp", "type": "esprit" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 향후 연동 TODO
- MCMS API 실제 엔드포인트 URI 확정 (Phase 4 문서 참고).
- 인증 헤더 전달 (AAD 토큰 → API JWT 변환).
- 에러 코드 맵핑 정의.
