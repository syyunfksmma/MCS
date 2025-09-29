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

