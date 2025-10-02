# mcms-explorer Protocol & Observability Follow-up Plan (2025-10-02)

## 1. mcms-explorer:// Protocol Handling
- **목표**: Explorer UI에서 공유 드라이브 경로를 로컬 탐색기로 여는 `mcms-explorer://` 스킴을 제공.
- **작업**
  1. Registry Installer 작성 (Windows) – `HKEY_CLASSES_ROOT\mcms-explorer`에 Shell 실행 등록.
  2. 권한 체크: AD 그룹 `MCMS-Explorer-Users` 포함 여부 확인 API (`GET /api/users/{id}/permissions`).
  3. Fallback UI: 권한 없거나 Explorer 미설치 시 네트워크 경로 안내 모달 표시.
  4. Telemetry: `mcms_explorer_launch` 이벤트 (routingId, path, result, userAgent).
- **검증**: VM에서 프로토콜 핸들러 설치 → Explorer 링크 클릭 → 파일 탐색기 열림 확인. 실패 시 사유 로깅.

## 2. Stage 4 (Observability/Performance)
### 2.1 Promtail & Loki
- `monitoring/promtail/config.mcms.yaml` 템플릿 작성 → 앱 설정에서 경로 주입 (`PROMTAIL_CONFIG_PATH`).
- Deploy 스크립트: `scripts/monitoring/deploy-promtail.ps1` (install service, copy config, start).
- Alert 테스트: `amtool alert add deadmans_switch` 시뮬레이션 기록.

### 2.2 FileStorage SLA
- `QueueJsonWriteAsync` 동시성 상한 configurable (appsettings: `FileStorage:JsonWriteParallelism`).
- k6 시나리오 준비: `scripts/performance/k6-workspace.js` 파라미터 정리, env 예시 추가.
- 목표: P95 1초 달성 → 전/후 측정값 docs/performance/Phase8_PerfReliabilityPlan.md 업데이트.

## 3. Stage 5 (QA/Automation)
- Playwright @smoke 세트 구성: Explorer Navigation, CAM Replace, Version Promote.
- Vitest(jsdom) 실패 케이스 해결: DOM mock util 추가 (`tests/setup/domMocks.ts`).
- k6 스크립트 수정: 옵션 객체 리팩터링, ENV fallback (`__ENV.MCMS_BASE_URL ?? 'http://localhost:3000'`).
- Axe 테스트 SSL 해결: self-signed cert 신뢰 설정 스크립트 `scripts/testing/import-dev-cert.ps1`.
- CI 순서 제안: `lint → test:unit → test:axe → test:e2e (@smoke) → k6 smoke`.

## 4. 일정 & 담당
| 항목 | 목표일 | 담당 |
| --- | --- | --- |
| mcms-explorer 프로토콜 PoC | 2025-10-05 | Codex |
| Promtail 설정 템플릿/배포 스크립트 | 2025-10-06 | Codex |
| FileStorage SLA 개선 & k6 측정 | 2025-10-07 | Codex |
| QA 자동화(@smoke/axe/k6) 정비 | 2025-10-08 | Codex |

## 5. 산출물 업데이트 대상
- `docs/workspace/Stage3_Workspace_Enhancements.md` – protocol/observability 진행 상황 반영.
- `docs/performance/Phase8_PerfReliabilityPlan.md` – SLA 측정 결과 추가.
- `docs/testing/Explorer_UI_Rework.md` – 새로운 smoke/axe/k6 스위트 기록.
- `docs/ops/Routing_Rollback_Procedure.md` – mcms-explorer 실패 시 롤백 시나리오 추가.

