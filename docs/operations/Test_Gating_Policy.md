# 테스트 게이팅 정책

## 원칙
- 테스트 실행이 완료되지 않으면 배포/머지/승인을 진행하지 않는다.
- 테스트를 대체할 수 없는 경우 사전 승인자(User)에게 승인을 재요청한다.

## 절차
1. **사전 점검**: `pnpm test:unit`, `pnpm lint`, `dotnet test`, `pytest` 등 필수 스위트 실행.
2. **실패 또는 미실행 시**:
   - 원인 기록 (예: 환경 오류, 테스트 결함).
   - `docs/logs/Timeline_YYYY-MM-DD.md`에 사유와 보류 상태 기록.
   - 승인자(User)와 Ops 채널에 재승인 요청.
3. **승인 조건**:
   - 위험 평가 작성 (`docs/operations/RiskAssessment_Template.md`).
   - 임시 완화책 및 재테스트 일정 포함.
4. **사후 처리**:
   - 테스트 보강 계획 등록 (Jira).
   - 재테스트 완료 후 체크리스트 업데이트.

## 모니터링
- 파이프라인에서 테스트 단계 누락 시 즉시 실패 처리.
- 테스트 결과 요약은 `reports/<wave>/test-summary.md`에 집계.

## 커뮤니케이션
- Slack #mcms-ops 채널에 자동 통지 (Webhook).
- 승인자 목록: User, Ops Lead, QA Lead.

## 적용 범위
- MCMS Web Portal, API, Worker, Installer 전 구성에 적용.
