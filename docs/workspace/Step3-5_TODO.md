# Workspace & QA Follow-up TODOs (2025-10-01)

## 3단계 (Workspace 고도화)
- [x] ERP WorkOrder 기반 CAM 버튼 게이팅 연결 (완료 2025-10-02, Codex)
- [ ] Version Table UI/백엔드 설계
  - 결정 필요: Routing 버전 데이터 모델 정의 (별도 테이블 여부, 기존 History 기반 파생 여부).
  - API 계약: `PATCH /api/routings/{routingId}/versions/{versionId}` 요청 본문 스키마, 응답 형태 확정.
  - ExplorerShell 상세 모달 탭 구조 합의 및 UX 스펙(정렬/필터/메인 토글 UI) 확정.
- [ ] SolidWorks Replace 플로우
  - 결정 필요: replace 수행 시 백엔드 엔드포인트/파일 정책, telemetry 이벤트(`solidworks_replace_*`) 필드 정의.
  - UI 확정: Confirm 다이얼로그 메시지/롤백 처리, 업로드 허용 확장자.
- [ ] `mcms-explorer://` 프로토콜 처리
  - 결정 필요: 권한 체크 로직(AD 그룹, 역할 등), fallback 경로, ExplorerShell 내 노출 위치.

## 4단계 (관측/성능)
- [ ] Promtail 설정 반영
  - 결정 필요: 최종 Loki 파이프라인 경로, config 파일 저장 위치(`monitoring/promtail/config.mcms.yaml`)에 포함될 인증 정보 관리 방식.
  - Alertmanager `amtool` 시뮬레이션 시나리오(테스트 라우트) 확정.
- [ ] FileStorage 메타 SLA 최적화
  - 결정 필요: `QueueJsonWriteAsync` 동시성 상한 값, EventCounter 수집 주기, 기준 임계(p95 3s→1s) 달성 전략 합의.
  - 실행 전/후 k6 측정 환경(베이스 URL, 테스트 데이터량) 확정.

## 5단계 (QA/자동화)
- [ ] @smoke 태그 재구성: Playwright 스위트 구성/시나리오 정의 필요.
  - [ ] Playwright @smoke 세부 작업
    - [ ] Explorer Navigation 시나리오 구현
    - [ ] CAM Replace & Version Promote 케이스 추가
    - [ ] CI에서 @smoke만 실행하도록 설정
- [ ] Vitest(jsdom) 오류 해결: 실패 케이스(RoutingDetailModal, ProductDashboardShell) 처리 전략 합의.
  - [ ] Vitest(jsdom) 세부 작업
    - [ ] DOM mock 유틸 추가
    - [ ] 실패 케이스 리팩터링 및 스냅샷 갱신
    - [ ] CI에서 jsdom 환경 변수 표준화
- [ ] k6 스크립트 문법 오류 수정: `scripts/performance/k6-workspace.js` 라인 15 파라미터/환경 변수 처리 방식 확정.
  - [ ] k6 스크립트 세부 작업
    - [ ] 옵션 객체 리팩터링 및 ENV fallback 추가
    - [ ] 테스트 데이터 시드 스크립트 작성
    - [ ] 결과 리포트 템플릿 업데이트
- [ ] 접근성 `npm run test:axe` SSL 문제: self-signed 인증서 처리 전략 결정.
  - [ ] Axe SSL 세부 작업
    - [ ] dev CA 신뢰 스크립트 작성
    - [ ] Playwright/Axe 옵션에 인증서 무시 설정 추가
    - [ ] 실패 로그 템플릿 갱신
- [ ] 통합 파이프라인 설계: Playwright/e2e, 퍼포먼스, Axe 실행 순서 및 CI 통합 여부 합의.
  - [ ] 통합 파이프라인 세부 작업
    - [ ] GitHub Actions 워크플로 초안 작성
    - [ ] 아티팩트 업로드/보존 정책 정의
    - [ ] 실패 시 롤백 안내문 갱신







