# ML Routing Orchestration Design (2025-09-29)

## 아키텍처 개요
- 파이프라인: Data Prep → Model Training → Batch/Real-time Serving → Feedback Loop.
- 오케스트레이터: Azure Data Factory(배치) + Azure Functions(실시간 이벤트).

## 구성 요소
1. Data Prep Pipeline
   - 입력: ERP Item/Revision, Work Order, Manual Labels.
   - 처리: 변환/정규화, Feature 저장소(`data/ml/features.parquet`).
2. Training Pipeline
   - 스케줄: 매일 02:00, 재학습 조건(성능 5% 저하 시 즉시).
   - 산출: 모델 아티팩트(`models/ml-routing/<version>`).
3. Serving
   - Batch: 추천 캐시 생성 → Redis 저장.
   - Real-time: FastAPI 엔드포인트 `/ml/recommendations`.
4. Feedback Loop
   - UI 수락/거절 이벤트 → Event Grid → Cosmos DB.

## 장애 처리
- 파이프라인 실패 시 Logic App으로 알림.
- 재시도 정책: 3회, 증가 백오프.

## 보안
- Key Vault로 자격 증명 관리.
- 데이터 암호화(Azure Storage SSE-KMS).

## 다음 단계
- ADF 파이프라인 정의서 작성.
- FastAPI 배포 슬롯 설정(Blue/Green).
