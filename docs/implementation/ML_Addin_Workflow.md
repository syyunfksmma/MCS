# ESPRIT Add-in ↔ ML Workflow Plan (2025-09-29)

## 흐름
1. Add-in에서 현재 라우팅 컨텍스트 수집 → 추천 요청.
2. ML 응답을 Add-in UI에 표시, 사용자가 선택.
3. 선택 결과를 MCMS API에 기록 → 감사 로그, 모델 피드백.
4. 필요 시 Add-in이 Shared Drive 파일 구조 검증.

## 기술 세부
- Add-in 언어: C# (WPF) → `HttpClient` + Polly 재시도.
- JSON 직렬화: System.Text.Json.
- 응답 처리: ObservableCollection 바인딩.

## 오류 대응
- 네트워크 실패: Retry 3회, 사용자 경고.
- 모델 비가용: Fallback으로 기존 규칙 기반 추천.

## 추적
- Telemetry: Application Insights custom event `addin_ml_recommendation`.
- Logs: `%APPDATA%\MCMS\logs\addin_ml_<date>.log`.

## 후속
- Add-in 릴리즈 노트에 ML 기능 플래그 기재.
