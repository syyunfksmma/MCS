# Wave14 운영 품질 지표 Baseline

## 배경
- Stage4에서 운영 품질/릴리즈 건강도를 정량화하기 위한 기준선을 2025-09-29 기준으로 정의한다.
- PoC 착수 전 Ops/Training/Dev 팀이 동일한 KPI를 바라볼 수 있도록 공통 대시보드 초기값을 합의한다.

## 핵심 지표
| 카테고리 | 지표 | 기준선 (2025-09-29) | 목표 | 데이터 소스 |
| --- | --- | --- | --- | --- |
| 배포 안정성 | 배포 성공률 | 100% (최근 5회) | ≥ 99% | Azure DevOps Release Logs |
| 배포 안정성 | 롤백 발생 건수 | 0건 | 0건 유지 | Runbook Evidence Vault |
| 성능 | P95 응답시간 (검색) | 1.42 s | ≤ 1.2 s | Application Insights |
| 성능 | 파일 업로드 성공률 | 98.5% | ≥ 99% | Worker Telemetry |
| 품질 | 단위 테스트 커버리지 | 78% | ≥ 85% | `pnpm test:unit --coverage` |
| 품질 | 보안 취약점 Critical | 0건 | 0건 유지 | Defender for DevOps |
| 운영 | 공유 드라이브 Sync 지연 | 평균 6분 | ≤ 5분 | Sync Monitor Dashboard |
| 운영 | UAT Outstanding Issue | 3건 | 0건 | Jira UAT Board |

## 정의 및 산정 방식
- **통계 기간**: 2025-09-15 ~ 2025-09-29 (2주 롤링).
- **데이터 수집**: `scripts/reporting/collect-metrics.ps1`로 자동 집계, `reports/wave14/metrics.json` 저장.
- **검증**: Ops 팀 2인 교차 검증 + Codex 로그 재검토.

## 보고 체계
1. 매주 월요일 09:30 Ops Stand-up에서 공유.
2. 변동 폭이 목표 대비 10% 초과 시 즉시 Training/Ops Slack 채널 알림.
3. 월간 품질 리뷰에 baseline 대비 추이 차트 첨부.

## 후속 과제
- Stage4 완료 시점에 KPI 자동 대시보드(Grafana) 위젯 구성.
- P95 응답시간 개선을 위해 캐시 정책/DB 인덱스 리뷰 진행.
- 공유 드라이브 지연 원인 분석 및 새 모니터링 알림 규칙 추가.
