# ML Routing 요구사항 · PRD 매핑

## 목적
- ML 기반 Routing 추천 기능을 위해 수집된 요구사항을 PRD 항목과 매핑한다.

## 요구사항 매핑 표
| 요구사항 | PRD 항목 | 설명 | 상태 |
| --- | --- | --- | --- |
| CAM 작업자 우선 순위 추천 | FR-ML-01 | Routing 생성 시 ML 추천 순서 제공 | 준비 완료 |
| 공정 시간 예측 | FR-ML-02 | 예측 시간 ±10% 정확도 | 모델 학습 필요 |
| 파일 품질 검증 | FR-ML-03 | 업로드 시 오류 확률 알림 | 데이터 수집 중 |
| 라우팅 재사용 제안 | FR-ML-04 | 유사 Item 추천 | PoC 대상 |
| Add-in 연동 | FR-ML-05 | ESPRIT Add-in에서 직접 추천 호출 | 설계 진행 |

## 데이터 소스
- ERP Production Table (Item, Revision, Cycle Time)
- Work Order 로그 (지난 24개월)
- Manual Labeling (CAM 전문가 검토)

## 의존성
- API 확장 (`/api/ml/recommendations`)
- Feature Flag `feature.ml-routing`
- 모델 배포 환경 (Docker/AKS)

## 다음 단계
- 2025-10-02까지 모델 MVP 정의.
- PoC 커버리지 테스트 케이스 작성 (`docs/Tasks_ML_Routing.md` 업데이트).
