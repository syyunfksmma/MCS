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

