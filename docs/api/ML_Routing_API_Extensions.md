# ML Routing API Extensions (2025-09-29)

## 신규 엔드포인트
- `GET /api/ml/recommendations?itemCode=&revision=`
- `POST /api/ml/recommendations/accept`
- `POST /api/ml/recommendations/reject`
- `GET /api/ml/models` (버전 정보)

## 데이터 계약
- Recommendation DTO: id, itemCode, sequence, confidence, rationale, createdAt.
- Feedback DTO: recommendationId, decision, comment, userId.

## 인증/인가
- Required scopes: `ml.read`, `ml.write`.
- Rate limit: 60 rpm/사용자.

## Validation
- Item/Revision 권한 체크.
- 추천 만료 시간 30분 → 만료 시 410 반환.

## 로깅
- 모든 POST는 Audit 로그 + Event Grid 발행.

## 후속
- OpenAPI (`docs/api/contracts/ml_routing.yaml`) 생성.
- Integration 테스트 작성 계획 (S71~S73 참조).
