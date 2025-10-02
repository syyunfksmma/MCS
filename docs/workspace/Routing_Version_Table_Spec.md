# Routing Version Table & API Contract (2025-10-02)

## 1. 목적
- Routing Revision마다 CAM/3D 상태와 메타 정보를 한눈에 파악하고, 승인/승격 이력을 명시적으로 관리한다.
- 기존 History 파생 방식에서 전용 테이블(`RoutingVersions`)과 뷰 모델을 도입해 Explorer · Workspace UI가 일관된 데이터를 소비하도록 한다.

## 2. 데이터베이스 스키마 제안
```sql
CREATE TABLE RoutingVersions (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    RoutingId UNIQUEIDENTIFIER NOT NULL,
    VersionCode NVARCHAR(32) NOT NULL,
    IsPrimary BIT NOT NULL DEFAULT(0),
    CamRevision NVARCHAR(32) NULL,
    Is3DModeled BIT NOT NULL DEFAULT(0),
    IsPgCompleted BIT NOT NULL DEFAULT(0),
    Last3DModeledAt DATETIMEOFFSET NULL,
    LastPgCompletedAt DATETIMEOFFSET NULL,
    LegacyHiddenAt DATETIMEOFFSET NULL,
    LegacyHiddenBy NVARCHAR(64) NULL,
    CreatedAt DATETIMEOFFSET NOT NULL,
    CreatedBy NVARCHAR(64) NOT NULL,
    UpdatedAt DATETIMEOFFSET NULL,
    UpdatedBy NVARCHAR(64) NULL,
    CONSTRAINT FK_RoutingVersions_Routings FOREIGN KEY (RoutingId)
        REFERENCES Routings(Id)
);
CREATE UNIQUE INDEX IX_RoutingVersions_RoutingId_VersionCode
    ON RoutingVersions(RoutingId, VersionCode);
CREATE INDEX IX_RoutingVersions_RoutingId_Primary
    ON RoutingVersions(RoutingId, IsPrimary DESC, UpdatedAt DESC);
```
- `IsPrimary`는 Routing별 단일 true가 되도록 API 계층에서 보장한다 (DB 제약은 filtered index + trigger 검토).
- CAM 버튼 상태는 `CamWorkStatus`와 동기화: ERP 기반 초기 상태 기록 후 승격 시 이 테이블로 복제한다.

## 3. API 계약
### 3.1 조회 `GET /api/routings/{routingId}/versions`
- Response
```json
{
  "routingId": "{routingId}",
  "versions": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "versionCode": "REV_A",
      "isPrimary": true,
      "camRevision": "CAM_20251002",
      "is3DModeled": true,
      "isPgCompleted": false,
      "last3DModeledAt": "2025-10-02T01:30:00Z",
      "lastPgCompletedAt": null,
      "legacyHiddenAt": null,
      "legacyHiddenBy": null,
      "createdAt": "2025-09-25T03:11:00Z",
      "createdBy": "cam.lee",
      "updatedAt": "2025-10-02T01:30:00Z",
      "updatedBy": "codex"
    }
  ]
}
```
- UI 사용처: Workspace Version 탭, Products Dashboard 요약, 승인 관리자 페이지.

### 3.2 업데이트 `PATCH /api/routings/{routingId}/versions/{versionId}`
- Request
```json
{
  "isPrimary": true,
  "legacyHidden": false,
  "camRevision": "CAM_20251002",
  "is3DModeled": true,
  "isPgCompleted": true
}
```
- 규칙
  - `isPrimary`가 true로 전환되면 동일 Routing의 다른 버전은 false로 설정.
  - `legacyHidden` true → `LegacyHiddenAt/By` 채움, false → null.
  - CAM 상태 필드 변경 시 `Last3DModeledAt/LastPgCompletedAt` 갱신.
- Response: 단일 Version DTO (위 3.1 구조 재사용).
- 감사 로그: Category `RoutingVersion`, Action `Patch`, Summary `${routingId}/${versionId}`.

### 3.3 연동: ERP/CAM 상태 sync
1. `CamWorkStatus` 갱신 시 해당 RoutingVersion이 존재하면 상태 반영.
2. Explorer Version 탭은 `GET /api/routings/{routingId}/versions` → 최신 상태 바인딩.
3. UI에서 CAM 완료 토글 → `PATCH` 호출 → 성공 시 React Query 캐시 무효화 (`versions` 키).

## 4. 작업 항목
- Infra: `RoutingVersions` 엔터티/DbContext 구성, 마이그레이션 작성.
- Core: DTO/Service 인터페이스 (`IRoutingVersionService`) 확장.
- API: Controller + Validator + Audit.
- Frontend: Workspace Version 탭 레이아웃, Products 요약 업데이트, React Query 캐시 키 정의.
- 테스트: 단위(서비스), 통합(API), E2E(Workspace 토글) 작성.

## 5. 미해결 이슈
- DB 레벨 `IsPrimary` 강제 제약 방식 (filtered unique index vs trigger).
- `CamWorkStatus` → `RoutingVersions` sync 시점 (API 호출 즉시 vs 배치).
- Legacy 라우팅과 신규 버전 공존 전략 (히스토리 테이블과 중복 여부).

