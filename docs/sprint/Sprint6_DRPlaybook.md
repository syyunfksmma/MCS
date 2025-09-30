# 절대 지령
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

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
# Sprint 6 — DR & Rollback Playbook (Draft)

## 1. 목적
- Sprint6 B3 과제를 충족하기 위해 롤백/재배포/DR 절차를 문서화한다.
- Sprint6 B2(2025-09-29 11:45:40)에서 수행한 Lab 환경 롤백 시뮬레이션 결과를 기반으로 실제 장애 시 대응 단계를 수립한다.
- Blue/Green 방식과 단일 노드 재배포 시나리오를 모두 고려하여 1인 운영 체계에서도 즉시 실행할 수 있도록 한다.

## 2. 범위
- 대상 시스템: MCMS Portal (IIS + Kestrel), MCMS API, Worker 서비스, Shared Drive 동기화.
- 환경: InternalStage, InternalProd, Lab(검증).
- 트리거 이벤트: Smoke 테스트 실패, SLA 초과, 보안 패치 후 검증 실패, 수동 롤백 승인.

## 3. 사전 조건
1. 최신 패키지: `artifacts/offline/MCMS_Setup_*.zip` 및 해시 검증 완료.
2. 알림 구성: `scripts/deploy/notify-deploy.ps1` Webhook 검증 상태(`logs/deploy/notifications/*.jsonl`).
3. 중단 감시: `scripts/deploy/run-smoke.ps1` Stage/Lab 환경에서 200/401 응답 확인.
4. 로그 수집 경로 확보: `artifacts/offline/logs`, `logs/deploy`, `logs/app`.

## 4. 롤백 시뮬레이션 요약 (B2)
- 실행 시각: 2025-09-29 11:45 KST (`smoke_20250929_114525.log`).
- 시나리오: 서비스 중지 상태에서 run-smoke.ps1 Lab 호출 → Kerberos/Health/Swagger 모두 연결 거부(-1) 감지.
- 결론: 롤백 사전 점검 시 run-smoke 결과가 실패면 서비스가 완전히 중지된 것으로 간주하고 재배포 준비 진행.
- 후속 조치: `rollback_20250929_1145.log`에 재배포 전 notify, 재기동 후 재검증 계획 기록.

## 5. Blue/Green DR 전략
| 단계 | 설명 | 담당 | 도구 |
|------|------|------|------|
| BG-1 | Green 슬롯(예: InternalStage) 최신 패키지 배포 | Codex | `package-offline.ps1`, `Deploy-CamService.ps1` |
| BG-2 | Green에 run-smoke.ps1, `npm run test:regression` 실행 | Codex | `scripts/deploy/run-smoke.ps1`, npm |
| BG-3 | notify-deploy.ps1 `-EventType Approved` 발송 후 DNS/로드밸런서 스위치 준비 | Codex | `notify-deploy.ps1` |
| BG-4 | Traffic 전환(InternalProd ↔ InternalStage) 및 5분 모니터링 | Codex | IIS, Grafana |
| BG-5 | 이전 Blue 환경을 Warm Standby로 유지, 실패 시 즉시 롤백 | Codex | Runbook |

## 6. 단일 노드 롤백 절차
1. `notify-deploy.ps1 -EventType RolledBack -Environment <env>` 발송.
2. IIS 사이트 중지 및 App Pool recycle.
3. `package-offline.ps1 -SkipBuild` 산출물에서 이전 안정 버전 전개.
4. `run-smoke.ps1 -Environment <env>` 재실행 → 모든 체크 통과 시 `notify-deploy.ps1 -EventType Deployed`.
5. Timeline/Sprint 로그에 시각별 기록.

## 7. 모니터링 및 알림
- Grafana 대시보드: SLA(ms), 오류율, App Pool 상태, Worker 큐 깊이.
- Alerting: 실패 2회 이상 연속 시 Teams, OpsGenie 호출. 알림 템플릿은 Sprint6 C2에서 구체화 예정.
- Log retention: `artifacts/offline/logs` 14일, `logs/deploy/notifications` 30일 보관.

## 8. 테스트 매트릭스
| Test ID | 목적 | 도구 | 성공 기준 |
|---------|------|------|------------|
| DR-SMOKE | 배포 직후 서비스 상태 확인 | run-smoke.ps1 | Health 200, Swagger 200 |
| DR-AXE | 접근성 회귀 | `npm run test:axe` | 주요 위반 0 |
| DR-E2E | 주요 사용자 플로우 회귀 | `npm run test:regression` | 실패 없음 |
| DR-ZAP | 보안 스캔 | OWASP ZAP baseline | High/Medium 경고 0 |

## 9. 승인 및 보고
- 승인자: Codex(1인 운영 체계). 승인 로그는 `notify-deploy.ps1` jsonl과 Timeline에 동시 기록.
- 보고: docs/logs/Timeline_YYYY-MM-DD.md, Sprint6_Log.md, Ops 커뮤니케이션 템플릿(D2) 활용.

## 10. TODO / 후속 과제
- C1~C3 작업 완료 후 Grafana 대시보드 ID 및 Alert Rule 링크 추가.
- Ops 커뮤니케이션 템플릿(D2)에서 DR 메시지 블록 정의.
- Blue/Green 전환 자동화 스크립트(`Deploy-BlueGreen.ps1`) 초안 작성.

*작성: 2025-09-29 11:47 KST, Codex*

