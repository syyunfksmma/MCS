# Stage 3 Workspace Enhancements (2025-10-02)

## Routing Version Management
- Exposed `GET /api/routings/{routingId}/versions` and `PATCH /api/routings/{routingId}/versions/{versionId}` for primary toggle and legacy visibility control.
- Added `IRoutingVersionService` with sibling aggregation, legacy hidden timestamps, and history journaling (`RoutingVersionPromoted`, `RoutingVersionLegacyVisibilityChanged`).
- Explorer detail modal renders "Versions" tab with legacy filter, expandable audit timeline, and permission-gated promote/legacy actions.

## SolidWorks Replace Flow
- Implemented `POST /api/routings/{routingId}/solidworks/replace` to link SolidWorks assemblies per routing revision.
- Workspace upload panel supports replace confirmation dialog, telemetry events (`solidworks_replace_*`), and result banner with validation feedback.
- Recorded history entries for replace events and exposed presence status via `GET /api/routings/{routingId}/solidworks`.

## mcms-explorer Protocol Integration
- Explorer ribbon button launches `mcms-explorer://open?path={sharedPath}` guarded by `canOpenExplorer` permission.
- Added fallback warnings when shared paths or permissions are missing, ensuring accessibility compliance.
- Unit tests cover ribbon button states and protocol invocation guardrails.

## QA Notes
- Backend coverage extended via `RoutingVersionServiceTests` and `SolidWorksLinkServiceTests`.
- TypeScript contract `RoutingVersion` updated with legacy metadata to align UI validation.
- Refer to docs/testing/QA_Shakeout_Log.md for verification checklist linkage.

## Version Table Workstream (2025-10-02)
- 신규 스펙 문서: `docs/workspace/Routing_Version_Table_Spec.md`
- 우선 작업
  - EF Core 엔터티/마이그레이션 생성 (`RoutingVersions` 테이블)
  - `IRoutingVersionService` 확장 및 API 컨트롤러 구현 (`GET/PATCH`)
  - Explorer Workspace Version 탭 UI 설계 반영 (React Query 키 `routingVersions`)
- 연동 알림
  - CAM 상태(`CamWorkStatus`) 변경 시 Version 레코드와 동기화
  - 감사 로그 Category `RoutingVersion` 으로 표준화
- 검증 체크리스트
  - 단위 테스트: Service/Validator
  - 통합 테스트: PATCH → IsPrimary 토글/Legacy Hidden 처리
  - UI 테스트: Version 탭 승격 버튼 → API 성공 → 캐시 무효화 → 상태 뱃지 갱신

## SolidWorks Replace Workstream (2025-10-02)
- 신규 플로우 문서: `docs/workspace/SolidWorks_Replace_Flow.md`
- 핵심 기능
  - 업로드 API `POST /api/routings/{routingId}/solidworks/replace`
  - 기존 파일 백업 → 신규본 교체 → CAM 상태/버전 동기화
- UI 요구
  - Replace 버튼 → 파일 선택 모달 → 진행률/취소 → 결과 토스트
  - 24시간 이내 재업로드 시 경고 모달, 실패 시 상태 롤백
- 감사/Telemetry
  - Audit Category `SolidWorks` / Action `Replace`
  - Telemetry 이벤트 `solidworks_replace_*`
- 후속 작업 체크리스트
  - FileStorage 백업 유틸리티 추가
  - React 컴포넌트 & React Query mutation 작성
  - Playwright 테스트 시나리오 준비

## mcms-explorer Protocol & Stage4/5 Plan
- 계획 문서: `docs/workspace/McmsExplorer_Protocol_and_Observability.md`
- 커버 범위
  - mcms-explorer:// 핸들러 등록 및 권한 체크
  - Promtail/Loki 모니터링 배포 절차
  - FileStorage SLA 개선 및 k6 측정
  - QA 자동화(@smoke, axe, k6) 재정비 로드맵
- 타임라인: 2025-10-05 ~ 2025-10-08 (Codex 담당)
- 후속 문서 업데이트: performance, testing, ops runbook 등

