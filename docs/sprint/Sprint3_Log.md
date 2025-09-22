# Sprint 3 Activity Log – Admin & Settings

> 모든 작업 활동은 로그로 기록하며, 필요 시 다이어그램/코드/Mock API 예시를 첨부한다.

## 2025-09-22 Codex
- Task A1 완료: Admin Console 사용자/역할 그리드 구축(`AdminConsole`), 상태·AD 그룹·최근 업데이트 열 구성.
- Task A2 완료: 상태 토글 확인 모달 추가, 활성/잠금/비활성 전환 시 lastUpdated 갱신.
- Task A3 완료: AD 그룹 지정 드롭다운과 Mock `syncAdGroup` API 연결.
- Task B1 완료: API Key 테이블/발급 모달/폐기 절차 구현(`AdminApiKeysPanel`).
- Task B2 완료: 발급 2단계 확인(요약→확정) 및 발급 후 전체 키 모달 제공.
- Task B3 완료: 레이블/스코프/만료 필터, 복사/폐기 사유 입력 등 API Key 관리 UX 보강.
- Task C1 완료: Feature Flag 토글·Rollout UI 구성(`AdminFeatureFlagsPanel`).
- Task C2 완료: 환경별 배너 메시지 편집/활성화, 테스트 전송 Mock 처리.
- Task C3 완료: Feature Flag/환경 메시지 Mock API(`src/lib/admin.ts`) 확장 및 새로고침 동기화.
- 문서: docs/sprint/Sprint3_AdminConsole.md, Sprint3_ApiKeys.md, Sprint3_FeatureFlags.md 업데이트.
- 코드: `src/components/admin/*`, `src/lib/admin.ts`, `src/app/admin/page.tsx` 등.
- 검증: `npm run lint` 실행, 경고/오류 없음.- Task D1 완료: 감사 로그 테이블 + CSV Export 구현(AuditLogService, AuditLogsController, AdminAuditLogPanel). 승인 타임라인 연동 및 모의 데이터 정비.
- Task D2 완료: Grafana 임베드/외부 링크 패널(AdminMonitoringPanel)과 환경 변수(NEXT_PUBLIC_GRAFANA_*) 추가.
- Task D3 완료: 감사 통계/알림 센터(AdminAuditSummaryPanel) 및 Alert 규칙 구현.
- Task E1 완료: Playwright Admin 시나리오 확장(	ests/e2e/admin-console.spec.ts).
- Task E2 완료: Admin 운영 워크플로 요약 업데이트(docs/sprint/Sprint3_AdminConsole.md).
- Task E3 완료: Sprint3 문서/로그에 감사 및 모니터링 작업 기록 업데이트.
