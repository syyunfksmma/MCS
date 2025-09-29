# Disaster Recovery Test Report (Wave14)

## 개요
- **일시**: 2025-09-29 16:15~16:35 KST
- **시나리오**: SQL Server 장애 + 공유 드라이브 장애 동시 발생 가정
- **목표**: 30분 내 서비스 정상화 (RTO), 15분 내 데이터 복구 (RPO)

## 시나리오 상세
1. **SQL Server 장애 시뮬레이션**
   - Primary 노드 서비스 중지 → 자동 Failover (AG) 확인.
   - 애플리케이션 연결 문자열 Failover Partner 동작 확인.
2. **공유 드라이브 장애**
   - SMB 경로 차단 후 Worker 재시도 정책 확인.
   - FileStorageService 재시동 → 큐 적재 파일 복구.
3. **동시 장애**
   - SQL Failover + SMB 복구 순차 진행.
   - 사용자에게 제공되는 UI 메시지(배너) 확인.

## 결과 요약
| 항목 | 목표 | 실제 |
| --- | --- | --- |
| SQL Failover | ≤ 5분 | 3분 20초 |
| Shared Drive 복구 | ≤ 10분 | 7분 45초 |
| 전체 서비스 정상화 | ≤ 30분 | 18분 10초 |
| 데이터 손실 | ≤ 15분 | 0분 (트랜잭션 로그 복구) |

## 로그/증적
- `logs/dr/20250929/sql_failover.log`
- `logs/dr/20250929/shared_drive_recovery.log`
- `reports/wave14/dr_summary.xlsx`

## 개선 사항
- Failover 감지 알림 Slack Webhook 추가 배포 (Ops Action Item #214).
- 공유 드라이브 장애 시 Worker 재시동 자동화 스크립트 추가 필요.
- 월 1회 DR 리허설 일정화, 분기 1회 실제 복구 검증 수행.
