# Implementation Phase 2 - MCMS API 라우팅/파일/승인 API 보강 (2025-09-19)

## 절대 조건 확인
- 각 단계는 승인 후에만 진행한다. ✅
- 단계 착수 전 해당 단계 전체 범위를 리뷰하고 오류를 선제적으로 파악한다. ✅ (PRD, 설계 Phase1~4, Implementation Phase1 문서 재검토)
- 오류가 발견되면 수정 전에 승인 재요청한다. ✅
- 이전 단계 오류가 없음을 확인한 뒤 다음 단계 승인을 요청한다. ✅ (최근 빌드/테스트 통과)
- 모든 단계 작업은 백그라운드로 수행한다. ✅
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 후 진행한다. ✅
- Task list 체크박스를 하나씩 업데이트하면서 문서를 업데이트 한다. ✅
- 모든 작업은 문서로 남긴다. ✅ (본 문서 작성)

## 작업 범위 요약
- 기존 MCMS API(Project: src/MCMS.Api, MCMS.Infrastructure)에 라우팅/파일/승인 관련 엔드포인트 및 서비스 로직 확장
- Add-in 통합 문서에서 정의한 OpenAPI 초안 반영
- 승인 요청/승인/반려, 파일 업로드/다운로드, meta.json 동기화 흐름 구현

---

## 1. Routing 승인 API 보강
### 변경사항
- Routing 엔터티에 ApprovalStatus, ApprovalRequestedAt, ApprovalRequestedBy 필드 추가
- RoutingApprovalService 신규 클래스 추가
- 컨트롤러 엔드포인트
  - POST /api/routings/{id}/request-approval
  - POST /api/routings/{id}/approve
  - POST /api/routings/{id}/reject
  - GET /api/routings/{id}/approval-history

### 코드 스니펫 (요약)
`csharp
public async Task<RoutingDto> RequestApprovalAsync(Guid routingId, string requestedBy)
{
    var routing = await _context.Routings.FindAsync(routingId)
        ?? throw new KeyNotFoundException("Routing not found");

    routing.ApprovalStatus = ApprovalStatus.Pending;
    routing.ApprovalRequestedAt = DateTimeOffset.UtcNow;
    routing.ApprovalRequestedBy = requestedBy;

    await _context.SaveChangesAsync();

    await _historyService.RecordAsync(new HistoryEntryDto(
        Guid.NewGuid(), routing.Id, "ApprovalRequested", null, null,
        ApprovalOutcome.Pending, routing.ApprovalRequestedAt.Value, requestedBy, null));

    return Map(routing);
}
`

---

## 2. 파일 / meta.json API
### 변경사항
- RoutingFileController 신규/보강
  - GET /api/routings/{id}/files
  - POST /api/routings/{id}/files (multipart, meta.json 포함)
  - DELETE /api/routings/{id}/files/{fileId}
- FileStorageService 확장: meta.json 동기화, checksum 검증

### meta.json 생성 로직
`csharp
var meta = new RoutingMetaDto
{
    RoutingId = routingId,
    CamRevision = routing.CamRevision,
    Files = routing.Files.Select(f => new RoutingMetaFile
    {
        FileName = f.FileName,
        FileType = f.FileType.ToString(),
        RelativePath = f.RelativePath,
        Checksum = f.Checksum,
        UploadedBy = f.CreatedBy,
        UploadedAt = f.CreatedAt
    }).ToList(),
    HistoryId = routing.HistoryEntries.LastOrDefault()?.Id
};
await _fileStorage.WriteJsonAsync(metaPath, meta);
`

### 업로드 흐름
1. UI에서 파일 업로드 (meta.json 자동 생성)
2. API가 W:\ 경로에 파일 저장 + DB 업데이트 + checksum 계산
3. History 기록 및 응답 반환
4. Add-in은 GET /api/routings/{id}/files 호출로 최신 meta 가져옴

---

## 3. OpenAPI(Swagger) 업데이트
- docs/api/openapi_mcs.yaml (추후 실제 파일 업데이트 필요)
- Swagger 설정에 승인/파일 API 설명 추가

---

## 4. 테스트
- 단위 테스트 RoutingApprovalServiceTests 추가 (Happy path, NotFound, AlreadyPending 등)
- 단위 테스트 RoutingFileServiceTests (meta.json 생성, checksum 비교)

---

## 5. 오픈 이슈
- Large 파일 스트리밍 방식 (Range 요청 지원 여부)
- 승인 Notification(이메일/알림) 구현 시점
- 파일 버전 롤백 기능 포함 여부

