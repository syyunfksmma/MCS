# Sprint 3 Admin Console 설계

## A1. 사용자/역할 그리드
- Ant Design `Table`를 활용하여 이름/이메일, 부서·역할, 상태, AD 그룹, 최근 업데이트 열을 구성.
- 상단에 상태 필터(전체/활성/비활성/잠금)와 검색창(이름·이메일·부서·역할 대상)을 배치.
- `web/mcs-portal/src/components/admin/AdminConsole.tsx`에서 `AdminStatus` 메타 정보를 활용하여 상태별 Tag 색상 지정.

## A2. 상태 토글 + 확인 모달
- `Modal.confirm`을 통해 활성/잠금/비활성 버튼 클릭 시 액션 라벨·설명을 명시하고, 실행 시 모의 상태 변경.
- 상태 전환 시 `lastUpdated` 를 현재 시간으로 갱신하여 변경 추적.
- 잠금/비활성은 danger 스타일을 적용하여 시각적으로 강조.

## A3. AD 그룹 지정 버튼
- `Dropdown` + `Menu` 구조로 AD 그룹(보안/배포) 리스트를 노출하고 선택 시 `syncAdGroup` Mock API 호출.
- 기존 그룹 배열에 중복 없이 추가하도록 `Set`을 사용.
- 모의 디렉터리 그룹 데이터는 `web/mcs-portal/src/lib/admin.ts`에서 제공.

## Mock 데이터 & API
- `fetchAdminAccounts`, `fetchDirectoryGroups`, `syncAdGroup` 을 통해 딜레이가 있는 Mock API를 구성하여 향후 BFF 연동 시점을 대비.
- 상태 메타(라벨/설명/tag 색상/action 라벨)는 `ADMIN_STATUS_META`로 분리해 UI와 로직이 동일한 Enum을 참조.

## 후속 작업(다음 섹션)
- B섹션에서 API Key 관리 화면 추가 시 동일한 Mock 패턴을 확장.
- SignalR 연동 후 실제 상태 변경 이벤트와 동기화할 수 있도록 API 추상화 계층을 유지.## D1. 감사 로그 테이블 & 타임라인
- AuditLogService, AuditLogsController 추가로 승인/보안 이벤트 감사 로그 API 제공.
- Admin UI AdminAuditLogPanel에서 필터/페이지네이션/CSV Export 지원.
- 승인 타임라인 버튼으로 etchApprovalHistory 호출, Drawer로 History 노출.

## D2. 모니터링 대시보드 임베드
- AdminMonitoringPanel에서 NEXT_PUBLIC_GRAFANA_EMBED_URL 기반 iframe 임베드.
- 새로고침/외부 링크 버튼 제공 (Grafana 전체화면 이동).

## D3. 통계 알림 센터
- AdminAuditSummaryPanel에서 승인 SLA, 경고 비율, Critical 이벤트 카드화.
- Alert 규칙(임계 이벤트, 반려율, SLA 초과) 시 메시지 센터에 노출.

## E1~E3. 테스트 & 문서
- Playwright dmin-console.spec.ts에 감사 로그 시나리오 추가 (환경 변수로 실행 제어).
- Admin 운영 워크플로 문서 업데이트 및 Sprint 로그 정리.
