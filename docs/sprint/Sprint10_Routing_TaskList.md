# Sprint 10 Routing Task List (Deployment & Operations)

## 절대 지령
- 본 문서는 1인 개발팀 운영 원칙을 따르며, 모든 실행 주체는 Codex이다.
- 모든 코드와 API 작성은 Codex가 수행하며, 자동화 작업 역시 Codex가 직접 검토한다.
- 작업 전후 활동은 영어 로그와 주석으로 남겨 추적성을 확보한다.
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별하고 이상 없을시에만 해당 task를 [x] 표시한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 신규 생성된 작업에서도 절대 지령을 동일하게 준수한다.
- 오류 개선을 위해 신규 TASK가 발생하면 TASK LIST를 새로 작성하거나 기존 LIST에 업데이트 한다.
- PoC 기준은 1인 기업 관점으로 계획한다.

## 1. 개요
- 목적: 라우팅 기능 배포 및 운영 안정화 준비.
- 기간: Sprint 10 (2025-12-07 ~ 2025-12-20) 가정.
- 산출물: CI 파이프라인 보강, 배포 체크리스트, 롤백 문서, 운영 런북.
- 로그 지침: docs/sprint/Sprint10_Routing_Log.md에 영어로 절차/결과를 기록하고, 스크립트/워크플로 파일에는 변경 목적을 영어 주석으로 명시한다.

## 2. 작업 흐름 및 체크리스트
### Flow U. 파이프라인 업데이트
- [ ] U1. Routing 모듈 전용 lint/test 단계 추가.
  - Log: Document pipeline YAML diff and trigger conditions.
  - Comment: Annotate new job purpose.
- [ ] U2. CI 캐시 전략 조정 (build artifacts for Next.js/Playwright).
  - Log: Capture cache keys, retention.
  - Comment: Explain potential cache invalidation.

### Flow V. 배포 전략
- [ ] V1. Blue/Green 또는 Canary 체크리스트 업데이트 (routing feature flags 포함).
  - Log: Summarize go/no-go criteria.
  - Comment: Document script toggling flags.
- [ ] V2. 배포 dry-run + 모니터링 알람 확인.
  - Log: Include dry-run output, metrics.
  - Comment: Note dashboards to watch.

### Flow W. 롤백 및 Runbook
- [ ] W1. 공유 드라이브 통합 플래그 롤백 절차 문서화.
  - Log: Provide step-by-step instructions.
  - Comment: Annotate automation script entry point.
- [ ] W2. 운영 런북 작성 (Folder path troubleshooting, support FAQ).
  - Log: Link final document and training schedule.
  - Comment: Document location of troubleshooting flowcharts.

## 3. 검증
- CI 파이프라인 실행 로그, 배포 모의 실행 캡처를 로그에 첨부.
- 운영팀 리뷰 회의 메모 첨부.

## 4. 승인 조건
- DevOps/운영팀 서명.
- 비상 롤백 절차 리허설 완료.




