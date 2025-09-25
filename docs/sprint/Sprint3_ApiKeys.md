# Sprint 3 API Key Management

## 요구사항 요약
- 관리자 콘솔에서 API Key 발급/검색/폐기 기능 제공.
- 발급 시 2단계 확인(발급 사전 요약 → 확정)과 만료일 설정 필수.
- 폐기 시 사유 입력 및 "DELETE" 확인 문자열로 안전장치 구성.
- 복사 기능은 마스킹 키만 허용, 전체 키는 발급 직후 모달에서만 노출.

## UI 흐름
1. **목록**: 스코프/만료/최근 사용/상태 열을 제공하고 활성 개수를 배지로 표시.
2. **발급**: 모달(Form) → 확인 Confirm → 발급 후 전체 키 모달 노출 → 복사 버튼 제공.
3. **폐기**: Reason + DELETE 확인 입력 → Mock API 호출 → 상태를 `revoked`로 업데이트하고 마스킹 문자 변경.
4. **새로고침**: Mock API 재호출로 최신 상태 동기화.

## Mock API (`src/lib/admin.ts`)
- `fetchAdminApiKeys` : 현재 키 목록 반환.
- `issueAdminApiKey` : 랜덤 키를 생성하고 마스킹/원본을 동시에 반환.
- `revokeAdminApiKey` : 상태를 `revoked`로 변경하며 마스킹 업데이트.

## 후속 TODO
- 감사 로그에 발급/폐기 이벤트 기록 (Feature Flag `admin.apikey.audit` 활성화 시).
- 실제 BFF 연동 시 KMS/Secrets Manager에 전체 키 저장.
- 만료 예정 키 Slack 알림 자동화.