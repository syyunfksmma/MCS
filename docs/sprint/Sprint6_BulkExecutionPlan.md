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
# Sprint 6 Bulk Execution Plan — 2025-09-29 11:40 KST

## 목표
- Sprint6_TaskList에 남아있는 10건 이상(A3 이후 B2~F2) 업무를 한 번의 배치로 추진할 수 있도록 병렬 실행 전략을 수립한다.
- 각 작업별 산출물, 선행 조건, 자동화 스크립트를 명시하여 승인·배포·모니터링 단계에서 손실 없이 실행한다.
- 절대 지령을 준수하기 위해 모든 단계별 로그, 체크포인트, 알림 기록을 명시한다.

## 병렬 트랙 구성
1. **Rollback Assurance 트랙** — B2: 롤백 시뮬레이션, B3: DR 전략 문서화
2. **Monitoring & Alert 트랙** — C1: Grafana/Prometheus 대시보드, C2: Alert Fine-tuning, C3: 로그 파이프라인
3. **Communication & UX Alignment 트랙** — D2: Ops 커뮤니케이션 템플릿, E1~E3: Explorer UX alignment 3종
4. **Performance & Upload 트랙** — F1: Streaming SHA-256 PoC, F2: 병렬 병합 프로토타입

각 트랙은 공통으로 `notify-deploy.ps1`, `run-smoke.ps1`, `package-offline.ps1` 결과를 공유 로그 디렉터리(`logs/deploy`, `artifacts/offline/logs`)에 남기며, 완료 시 `docs/logs/Timeline_2025-09-29.md`와 `docs/sprint/Sprint6_Log.md`에 동일 타임스탬프로 기록한다.

## Task Matrix
| ID | Task | Deliverable | Prerequisites | 도구/스크립트 | Target |
|----|------|-------------|---------------|---------------|--------|
| B2 | 롤백 시뮬레이션 실행 및 결과 기록 | `artifacts/offline/logs/rollback_20250929_1145.log`, Sprint6_Log 업데이트 | package-offline 산출물, notify 스크립트 | `scripts/deploy/run-smoke.ps1`, `scripts/deploy/notify-deploy.ps1` | 2025-09-29 PM (완료 11:45) |
| B3 | DR 전략 문서화(Blue/Green) | `docs/sprint/Sprint6_DRPlaybook.md` 초안 | B2 결과 | Markdown authoring, draw.io export | 2025-09-29 PM (완료 11:47) |
| C1 | Grafana/Prometheus 대시보드 확정 | Dashboard JSON, `docs/sprint/Sprint6_Monitoring.md` | 기존 SLO, meta_sla_history.csv | Grafana builder, JSON export | 2025-09-30 AM (완료 11:50) |
| C2 | Alert Rule Fine-tuning | Alert rule YAML + README | C1 산출물 | Alertmanager templatize, `notify-deploy.ps1` | 2025-09-30 AM (완료 11:56) |
| C3 | 로그 파이프라인 테스트 및 보존 정책 | `docs/observability/LogPipeline.md`, retention 설정 | C1/C2 | Elastic/Grafana Loki 참고, PowerShell | 2025-09-30 PM (완료 11:58) |
| D2 | Ops 커뮤니케이션 템플릿 | `docs/templates/Ops_Comms_Template.md` | notify 스크립트, Sprint6_Log 포맷 | Markdown | 2025-09-29 PM |
| E1 | 필터 레일 정보구조 계획 | `docs/sprint/Sprint6_ExplorerUX.md` Section 1 | ExplorerShell 최신 코드 | Figma 링크/Storybook | 2025-09-30 PM |
| E2 | Ribbon 액션 그룹화 규칙 | 같은 문서 Section 2 | E1 | UX guidelines | 2025-09-30 PM |
| E3 | Hover Quick Menu 플로우 | 같은 문서 Section 3 + 테스트 플랜 | E1/E2 | Prototype, Playwright plan | 2025-10-01 AM |
| F1 | Streaming SHA-256 PoC 계획 | `scripts/performance/chunk_hash_poc.ps1`, 테스트 로그 | temp_edit.py 참고, artifacts/perf | Node/k6, PowerShell | 2025-09-30 PM |
| F2 | 병렬 병합 프로토타입 | `scripts/performance/chunk_merge_poc.ps1`, README | F1 로그 | Node worker, PowerShell | 2025-10-01 PM |

## 실행 순서
1. 병렬 트랙 킥오프 미팅 로그를 Timeline에 기록하고 notify-deploy.ps1로 승인 알림 테스트.
2. 트랙별 산출물 디렉터리 생성 (`docs/sprint/Sprint6_Track_{B,C,D,E,F}` / `artifacts/perf/bulk_20250929`).
3. 각 작업 착수 시 `Sprint6_Log.md`에 In-Progress 기록, 완료 시 산출물 경로 + 체크박스 갱신.
4. 매 2시간마다 notify 스크립트로 진행 상황을 Teams에 브로드캐스트하고 jsonl에 적재.
5. 하루 종료 시 잔여 체크박스 수를 Timeline·Sprint 로그에 동기화.

## 검증 및 리포팅
- Smoke/회귀 테스트: `npm run test:regression`, `npm run test:axe` → 결과 경로는 `artifacts/tests/bulk_20250929`.
- 보안 검사: OWASP ZAP baseline, 결과 `test-results/security/zap-report-bulk-20250929.md`.
- 승인 기록: 각 완료 Task는 notify-deploy.ps1 `-EventType Deployed`로 기록 후 jsonl 첨부.

## 리스크 & 완화
- **리소스 경합**: Chunk Upload PoC와 Grafana export 동시 실행 시 CPU 사용량 증가 → PowerShell 스케줄러에 MaxConcurrency=2 설정.
- **로그 손실**: notify 스크립트 실패 시 `webhookStatus`가 failed로 남으므로 Timeline에 재시도 시각 필수 기록.
- **UX 문서 검증 지연**: Figma 접근 제한 시 `docs/sprint/Sprint6_ExplorerUX.md`에 스크린샷 경로 대신 설명 텍스트로 대체 후 후속 TODO 남김.

## 후속 액션 체커
- [x] Track Leads 지정 (Codex → 모든 트랙 직접 수행, 병렬 로그만 구분 — 완료 2025-09-29 12:02)
- [x] `scripts/deploy/run-smoke.ps1` 환경 세트(Stage/Prod) 재검토 (맵 확인 완료 2025-09-29 12:05)
- [x] `docs/templates/Ops_Comms_Template.md` 작성 시작 (완료 2025-09-29 12:00)
- [x] `artifacts/offline/logs` 용량 모니터링 (주기: 6h) — check-offline-logs.ps1 작성 (2025-09-29 12:05)


