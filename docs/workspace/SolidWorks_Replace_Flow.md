# SolidWorks Replace Flow Spec (2025-10-02)

## 1. 시나리오
1. CAM 엔지니어가 Workspace에서 Routing Revision을 선택.
2. "SolidWorks Replace" 버튼 클릭 → 파일 선택 다이얼로그 → 신규 3DM 업로드.
3. 업로드 성공 시 기존 파일을 백업(`.../3DM/archive/{timestamp}/`)하고 최신본으로 교체.
4. CAM 상태/버전 기록 갱신, History 및 Audit 로그 남김.
5. 실패 시 UI 롤백 및 오류 메시지 제공.

## 2. 백엔드 API
- `POST /api/routings/{routingId}/solidworks/replace`
  - Body (multipart/form-data): `file`(필수, .3dm), `note`(선택), `retainLegacy`(bool)
  - 인증: Bearer/AD 통합, 역할 `cam.engineer` 이상
  - 동작
    - 파일 유효성 검사 (확장자 .3dm, 최대 50MB, Magic header 확인)
    - 기존 파일 백업 후 덮어쓰기
    - `RoutingVersions`와 `CamWorkStatus` 업데이트 (Is3DModeled=true, Last3DModeledAt=now)
    - HistoryEntry `SolidWorksReplaced` 추가, Audit 로그 기록
  - Response 200
```json
{
  "routingId": "...",
  "versionId": "...",
  "fileName": "3DM/GT-3100.3dm",
  "backupPath": "3DM/archive/20251002T0130/GT-3100.3dm",
  "is3DModeled": true,
  "last3DModeledAt": "2025-10-02T01:30:00Z"
}
```

## 3. UI/UX 요구
- 버튼 상태: `is3DModeled` true 이면서 최신 업로드 24시간 이내면 확인 모달
- 업로드 중 로더 + 취소 버튼, 성공 시 토스트 "3D 모델 교체 완료"
- 오류 메시지
  - 415: "지원되지 않는 파일 형식"
  - 409: "동시 작업 감지 (다른 사용자가 방금 교체)"
  - 500: "업로드 실패 – 로그 참조" (로그 링크 제공)
- 롤백: 실패 시 React Query mutate onError로 optimistic 상태 복구

## 4. Telemetry & Audit
- Telemetry 이벤트: `solidworks_replace_submitted`, `solidworks_replace_succeeded`, `solidworks_replace_failed`
  - 속성: routingId, versionId, fileSize, user, duration
- AuditLogEntry: Category `SolidWorks`, Action `Replace`, Summary `{routingId}`

## 5. TODO & 연계
- [ ] API 컨트롤러/Validator/Service 구현
- [ ] FileStorageService에 백업 디렉터리 헬퍼 추가
- [ ] React UI 컴포넌트 (`SolidWorksReplaceButton.tsx`) 작성
docs/workspace/Stage3_Workspace_Enhancements.md 참고
- [ ] Playwright 시나리오: replace 성공/실패 케이스

