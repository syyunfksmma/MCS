# Phase 10 산출물 - 롤백 전략

## 1. 전략 비교
| 전략 | 장점 | 단점 |
|---|---|---|
| Blue/Green | 무중단 전환, 빠른 롤백 | 서버 두 대 필요, 자원 비용 |
| Canary | 부분 트래픽 검증 가능 | 라우팅/모니터링 복잡 |
| Direct Rollback | 간단, 현재 인프라 유지 | 다운타임 가능성 |

**결정**: 초기에는 Direct Rollback + Stage 검증, 장기적으로 Blue/Green 도입 검토

## 2. 롤백 절차 (Direct)
1. 배포 아티팩트 백업에서 이전 버전 복구
2. `Stop-Service MCMS.NextPortal`
3. 이전 버전 zip 재배포
4. 서비스 재시작, Health Check
5. 문제 원인 분석 후 재배포 계획 수립

## 3. Blue/Green 도입 계획
- 요구 사항: 추가 서버(Secondary) 확보, Load Balancer 구성
- 구현 단계: Pilot(사내 테스트) → Prod 적용
- Phase 12(후속)에서 구체화 예정

## 4. Canary 고려 사항
- IIS ARR에서 트래픽 분할 가능 여부 검토
- 모니터링 알람 세부 조정 필요

## 5. TODO
- Direct Rollback 스크립트 작성 (`rollback.ps1`)
- Blue/Green 인프라 비용 견적 산출
- Ops 팀과 시뮬레이션 일정 잡기
