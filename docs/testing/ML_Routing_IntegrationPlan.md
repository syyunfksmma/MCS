# ML Routing Integration Test Plan (2025-09-29)

## 범위
- Next.js ↔ MCMS API ↔ ML Service ↔ Add-in

## 시나리오
1. 제품 생성 → ML 추천 패널 표시 → 추천 수락 → Audit 로그 확인
2. Add-in에서 추천 호출 → 결과 수락 → API에 기록 확인
3. 추천 거절 → Feedback 저장 → 모델 학습 큐에 쌓임 확인

## 도구
- Playwright + API mocks
- REST Assured (optional)
- PowerShell 스크립트 `Test-MLIntegration.ps1`

## 검증 포인트
- HTTP 200/202 응답
- Audit 로그 항목 기록
- Event Grid 메시지 큐잉

## 일정
- 2025-10-03 통합 테스트 스프린트 착수

