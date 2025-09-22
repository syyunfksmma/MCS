# Sprint 3 Feature Flag & Environment Messaging

## 기능 요약
- Feature Flag 목록에서 토글 + rollout % 조정, 소유자/업데이트 시간 확인.
- 환경별 배너 메시지를 편집하고 활성/비활성 전환.
- 테스트 전송 버튼으로 Mock 알림 확인.

## UI 요소
- `AdminFeatureFlagsPanel`: 플래그 테이블, Rollout Segmented(0/25/50/75/100).
- `EnvironmentMessage` Alert 리스트: Dev/Stage/Prod 색상 태그, 최근 수정 시간, 편집/테스트 버튼.
- 상단 배지와 새로고침 버튼으로 현재 상태 요약.

## Mock API (`src/lib/admin.ts`)
- `fetchFeatureFlags` / `updateFeatureFlag`
- `fetchEnvironmentMessages` / `updateEnvironmentMessage`
- rollout 변경과 메시지 편집 시 Mock 데이터 배열을 갱신.

## 후속 과제
- 실제 Feature Flag 서비스(예: LaunchDarkly) 연동 시 SDK/토큰 처리.
- 환경 배너 변경 시 Slack/Teams 브로드캐스트 연동.
- Prod 환경 변경 시 추가 승인(2인 검토) Rule 적용.