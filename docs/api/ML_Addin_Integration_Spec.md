# ML Add-in Integration Spec (2025-09-29)

## 범위
- ESPRIT Add-in에서 ML 추천 API 호출 및 결과를 UI에 표시하는 흐름 정의.

## API 계약
- Endpoint: `POST /api/ml/addin/recommend`
- Request:
```
{
  "jobId": "GUID",
  "itemCode": "GT-3100",
  "operation": "MILL",
  "context": { "tool": "Tool123", "material": "AL" }
}
```
- Response:
```
{
  "recommendations": [
    {"sequence": 1, "confidence": 0.87, "reason": "Similar part GT-3200"},
    ...
  ],
  "warnings": []
}
```

## 인증/보안
- OAuth2 Client Credentials, Scope `ml.addin.execute`.
- 요청 시 Add-in에서 JWT 첨부, 유효성 5분.

## 통신 흐름
1. Add-in UI → API 호출.
2. API → ML Service FastAPI 프록시.
3. 응답 → Add-in 추천 패널 표시.
4. 사용자 선택 → `POST /api/ml/addin/decision` 로깅.

## 오류 처리
- Network 오류: 재시도 2회, 사용자 알림.
- 권한 오류: Add-in에서 로그인 갱신 안내.

## 후속
- Add-in 쪽 SDK 업데이트 → 2025-10-03 빌드에 반영.
- 테스트: `scripts/addin/Test-MLIntegration.ps1` 작성 예정.
