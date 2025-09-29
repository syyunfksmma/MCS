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

