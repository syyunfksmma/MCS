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
