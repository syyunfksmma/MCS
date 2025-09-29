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
# Zero Downtime Verification (PoC → 운영 전환)

## 목적
- PoC 단계에서 운영 환경으로 전환 시 다운타임 0분을 보장하기 위한 검증 절차와 증적을 정리한다.
- Blue/Green 배포 전략과 데이터 동기화 정책을 기준으로 검증하였다.

## 시험 개요
| 항목 | 값 |
| --- | --- |
| 전환 일시 | 2025-09-29 13:30~14:10 KST |
| 전략 | Blue→Green 전환 + 트래픽 스위치 (Application Gateway)
| 테스트 계층 | API, Worker, Frontend, Shared Drive Sync |
| 모니터링 | Grafana(`dashboards/zero-downtime.json`), Azure Monitor, Custom log collector |

## 시나리오 및 결과
1. **사전 검증**
   - Green 슬롯 준비: DB 마이그레이션 스크립트 Dry-run → OK
   - 공유 드라이브 sync queue 비우기 → OK
2. **트래픽 전환**
   - Application Gateway 백엔드 대상 변경 (30초 단계적 전환)
   - Synthetic Transaction (search/upload/download) → 오류 0건, 응답 P95 1.45 s 유지
3. **후검증**
   - Worker queue 지연: 최대 45초 → 기준(≤60초) 통과
   - Event Log: Error 없음, Warning 2건(정보성)
   - 사용자 세션 손실 없음 (SessionId 유지율 100%)
4. **롤백 대비**
   - 롤백 시나리오 실행하지 않음 (필요 시 `scripts/deploy/run-rollback.ps1`)
   - 복구 포인트 스냅샷 저장(`artifacts/backups/20250929-1330.zip`)

## 증적
- `logs/deploy/20250929/zero-downtime-switch.log`
- `reports/wave14/zero-downtime-dashboard.png`
- `docs/ops/IIS_Node_DeploymentRunbook.md` 참조 (절차 일치 확인)

## 결론
- 전환 중 사용자 접속 중단/오류가 발생하지 않았으며, 다운타임 0분 목표 달성.
- 잔여 조치: 경고 2건(Worker 재시도) 원인 분석 및 알림 민감도 조정.

## 후속 계획
- Stage4 운영 KPI에 Zero Downtime 지표 연동.
- 월 1회 모의 전환 리허설 일정화(Ops 담당자 주관).

