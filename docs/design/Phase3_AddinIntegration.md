# Phase 3 - ESPRIT Add-in ↔ MCMS API 연동 시나리오 & OpenAPI 업데이트 (2025-09-19)

## 절대 조건 확인
- 각 단계는 승인 후에만 진행한다. ✅
- 단계 착수 전 해당 단계 전체 범위를 리뷰하고 오류를 선제적으로 파악한다. ✅ (Phase1/2 문서 및 PRD 재검토)
- 오류가 발견되면 수정 전에 승인 재요청한다. ✅ (현재 오류 없음)
- 이전 단계에 오류가 없음을 확인한 뒤 다음 단계 승인을 요청한다. ✅ (빌드/테스트 성공 상태)
- 모든 단계 작업은 백그라운드로 수행한다. ✅
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 후 진행한다. ✅
- Task list 체크박스를 하나씩 업데이트하면서 문서를 업데이트 한다. ✅
- 모든 작업은 문서로 남긴다. ✅

## 1. 연동 시나리오
### 1-1. API 키 갱신 & Add-in 적용
1. Admin이 MCMS 웹 포털에서 "API 키 재발급" 클릭 → POST /api/addin/keys/renew
2. MCMS API가 새로운 키 생성 → DB 저장 → 응답으로 키/만료 시간 반환
3. ESPRIT Add-in 팝업에서 "값 새로고침" 클릭 → GET /api/addin/keys/current
4. Add-in이 키 값을 팝업 필드에 표시, 동시에 로컬 캐시(암호화) 저장

### 1-2. 라우팅 승인 후 Add-in 실행
1. 주니어가 라우팅 수정 후 승인 요청 → POST /api/routings/{id}/request-approval
2. Approver가 승인 → POST /api/routings/{id}/approve
3. MCMS API가 상태 업데이트 & History 작성 → Worker 큐에 RoutingApproved 메시지
4. MCMS Worker가 Add-in API 호출 → POST /api/addin/jobs (라우팅 ID, 파라미터)
5. ESPRIT Add-in이 폴링/SignalR으로 메시지 수신 → GET /api/addin/jobs/next
6. Add-in 팝업 자동 입력 → ESPRIT 실행 → 결과 POST /api/addin/jobs/{jobId}/complete

### 1-3. 파일/Meta 데이터 전달
1. 웹에서 파일 업로드 → POST /api/routings/{id}/files
2. ESPRIT Add-in이 실행 시 GET /api/routings/{id}/files 호출, 최신 meta.json 수신
3. Add-in이 파일 유효성 검증 후 W:\ 경로 접근

## 2. OpenAPI 변경 (요약)
- /api/addin/keys/current: GET, Add-in 현행 키 조회
- /api/addin/keys/renew: POST, 키 재발급
- /api/addin/jobs: POST(작업 등록), GET(다음 작업 요청)
- /api/addin/jobs/{jobId}/complete: POST, Add-in 완료 보고

## 3. DTO 초안
`csharp
public record AddinKeyDto(Guid KeyId, string Value, DateTimeOffset ExpiresAt);
public record AddinJobCreateRequest(Guid RoutingId, Dictionary<string, string> Parameters);
public record AddinJobDto(Guid JobId, Guid RoutingId, string Status, DateTimeOffset CreatedAt, Dictionary<string, string> Parameters);
public record AddinJobCompleteRequest(string ResultStatus, string? Message);
`

## 4. 검증 포인트
- Add-in 키는 DB에 암호화 저장, API 응답은 HTTPS 전제
- Worker → Add-in 큐 재시도 정책(기본 5회) 설정
- Add-in 실패 보고 시 History 기록 및 UI 알림

## 5. 오픈 이슈
- Add-in 오프라인 시 큐 보존 기간 (기본 24시간, 정책 협의)
- SignalR 도입 시점 (초기 Polling, 추후 SignalR 고려)
- Add-in 요청 인증: API 키 + 기기 ID 필요 여부 검토

## 6. 산출물
- 본 문서: docs/design/Phase3_AddinIntegration.md
- OpenAPI 수정 사항: docs/api/openapi_mcs.yaml에 추후 반영
- Add-in 개발 가이드: xtensions/esprit-edge/README.md 보강 예정
