# Phase6 Workspace Advanced Flows (2025-09-29)

## 1. Download Bundle & Per-File Links
- API: `POST /api/routings/{id}/bundle` → zip 생성, 응답으로 signed URL 반환.
- 개별 파일: `GET /api/routings/{id}/files/{fileId}` signed URL + checksum 헤더.
- FE: `DownloadMenu.tsx`에서 bundle/단일 선택, 완료 후 토스트 출력.
- 무결성: 다운로드 후 `sha256` 비교, 실패 시 재시도 버튼.

## 2. Version Table (Main Toggle & Audit)
- 테이블 컴포넌트 `components/workspace/RoutingVersionTable.tsx` 신설.
- Main toggle → `PATCH /api/routings/{id}/versions/{versionId}` with `isMain`.
- Legacy visibility 체크박스: soft-hide flag 저장.
- Audit timeline: `HistoryTab`와 동일한 `AuditEntry` 모델 재활용.

## 3. Three-Pane Workspace Layout
- 레이아웃: 좌측 트리(20%), 중앙 상세(55%), 우측 프리뷰(25%).
- Teamcenter Ribbon: `RibbonHeader` 컴포넌트 상단 고정, FAB는 우측 하단.
- 반응형: 1280px 이하에서 프리뷰 탭으로 전환.

## 4. SolidWorks Upload/Replace UI
- 구성: 기존 업로드 영역 재사용, replace 버튼에 confirm 모달.
- 텔레메트리: `solidworks_replace_attempt/success/failure` 이벤트.
- Sync to PLM 버튼은 disabled + tooltip("PoC scope 제외").

## 5. Open-in-Explorer Protocol Handler
- Windows protocol `mcms-explorer://` 등록 가이드 문서화.
- FE: 버튼 클릭 시 `window.location.href = 'mcms-explorer://?path=...'`.
- 권한 체크: API `GET /api/users/me/permissions`에서 `canOpenExplorer` 확인.
- 실패 시 fallback으로 UNC 경로 복사 알림.

## 테스트 & 후속
- Playwright: `routing-download.spec.ts`, `routing-protocol.spec.ts` 작성.
- Ops 문서: `docs/ops/OpenInExplorer_Setup.md` 초안 예정.
- 타임라인: Wave16 S26~S30 기록.
