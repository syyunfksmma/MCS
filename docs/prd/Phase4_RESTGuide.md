# Phase 4 산출물 - REST API 소비 가이드

## 인증 흐름
1. 브라우저에서 Azure AD 로그인 → Access Token 발급
2. Next.js BFF(API Route)가 Access Token 검증 후 MCMS API용 JWT 교환 (Client Credential)
3. 브라우저 요청은 BFF를 통해 전달, Direct 호출은 제한 (CORS 최소화)

## 핵심 엔드포인트
| 기능 | 메서드 | 경로 | 설명 |
|---|---|---|---|
| Item 조회 | GET | /api/items | Item + Revision Summary |
| Routing 상세 | GET | /api/routings/{id} | 단계/파일/히스토리 포함 |
| Routing 업데이트 | PUT | /api/routings/{id} | 단계/메타 수정 |
| 승인 요청 | POST | /api/routings/{id}/request-approval | 승인 플로우 시작 |
| 승인/반려 | POST | /api/routings/{id}/approve, /reject | 승인 처리 |
| 파일 업로드 | POST | /api/routings/{id}/files | multipart, chunk 옵션 |
| Add-in 큐 등록 | POST | /api/addin/jobs | Worker 큐 등록 |
| Add-in 큐 조회 | GET | /api/addin/jobs/next | Add-in Polling |
| Add-in 결과 | POST | /api/addin/jobs/{jobId}/complete | Worker 결과 처리 |
| Admin API 키 | GET/POST | /api/addin/keys | 키 조회/갱신 |
| Metrics | GET | /api/metrics/dashboard | KPI 데이터 |

## 요청/응답 규칙
- 모든 요청은 `Authorization: Bearer <JWT>` 헤더 필요 (BFF에서 자동 첨부)
- 실패 응답: RFC7807 Problem Details, TraceId 포함 
- 페이지네이션: `page`, `pageSize`, `sort`, `filter` 쿼리 표준화 
- Retry-After 헤더: Rate Limit(429) 대응

## Postman/Insomnia 컬렉션
- `/docs/api/mcms.postman_collection.json` 업데이트 (BFF 경로 기준)
- Collection includes example auth flow, file upload 단계별 샘플

## 오픈 API 스키마 관리
- 기존 `docs/api/openapi_mcs.yaml` → Branch별 자동 생성 (Swashbuckle)
- Next.js 개발자는 openapi-typescript-codegen 활용해 타입 생성
- 버전 정책: `/v1/` 경로 유지, Breaking change는 v2로 분리

## TODO
- Admin API 인증(권한) 세부 정책 문서화
- Rate limit 값 확정 (기본 100 req/min)
- 일부 엔드포인트 GraphQL 전환 검토(장기)
