# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
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

