# Operational Data Asset Catalog (2025-09-29)

## 목적
- 운영 환경에서 생성/사용되는 데이터 자산을 분류하고 보존 정책 및 책임을 명확히 한다.

## 분류표
| 카테고리 | 저장 위치 | 보존 기간 | 책임 | 비고 |
| --- | --- | --- | --- | --- |
| API 로그 | Application Insights / `logs/api` | 18개월 | DevOps | GDPR 대응, PII 마스킹 적용 |
| Worker 큐 기록 | `logs/worker` + Azure Queue | 12개월 | Ops | 장애 시 재처리용 스냅샷 |
| Shared Drive 아카이브 | `\\MCMS_SHARE\archive` | 24개월 | CAM | Retention Plan 준수 |
| Email 증적 | `C:\MCMS\logs\email` | 12개월 | Ops | Incident 시 48시간 내 제공 |
| ML 학습 데이터 | `data/ml/training` (Blob) | 36개월 | Data Science | Label 버전 관리 필수 |
| UAT 피드백 | `docs/testing/CAM_UAT_Feedback_Log.md` | 24개월 | QA | 개인 식별 정보 제거 |

## 거버넌스
- 변경사항은 Data Steward(User) 승인 필요.
- 분기마다 Data Asset Review 회의에서 업데이트.
- 보존 만료 시 `scripts/operations/Purge-DataAssets.ps1` 실행.

## 연관 문서
- `docs/operations/SharedDrive_RetentionPlan.md`
- `docs/observability/ApplicationInsights_RoutingSchema.md`
- `docs/ops/LocalDeployment_Email_Runbook.md`

## 다음 단계
- 2025-10-05 데이터 분류 교육 진행.
- ML 데이터셋 암호화 키 로테이션 체크리스트 생성 예정.
