# Phase7 Admin Settings Plan (2025-09-29)

## 1. Shared-Drive Admin Settings Page
- 경로: `/admin/settings/storage`
- 필드: Root path, naming preset dropdown, retry threshold numeric input.
- 저장 시 `PUT /api/admin/settings/storage` 호출, 변경 로그 `docs/logs/admin/settings` 저장.

## 2. Feature Flag Management UI
- Feature 목록: `feature.search-routing`, `feature.solidworks-upload`.
- 토글 → `PATCH /api/admin/feature-flags/{flag}`.
- 감사 로그: flag 변경 시 `AdminAuditLogPanel`에 기록.

## 3. Shared-Drive Health Panel
- 데이터 소스: `GET /api/admin/shared-drive/health` (status, lastError, timestamp).
- Error feed 탭: 최근 20개 이벤트 표시 + CSV export.
- 경고 색상 규칙: 정상=Green, 지연=Yellow, 실패=Red.

## 4. Admin Role Guard
- Access hook: `useAdminGate` → 사용자 권한 `admin` 확인.
- 미승인 시 `/admin/login` 리디렉트 + 경고 배너.
- Playwright 보호 시나리오: admin 페이지 접근 시 권한 테스트.

## 후속 조치
- Storybook: AdminSettingForm 스토리 추가.
- 문서 참조: `docs/operations/FeatureFlagManagement.md` 업데이트 예정.
- 타임라인: Wave16 S31~S34 기록.
